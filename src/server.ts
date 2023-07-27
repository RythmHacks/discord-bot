import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'
import createHttpError from 'http-errors';
import fetch from 'node-fetch';

const apiUrl = process.env.DISCORD_API_URL || 'https://discord.com/api'

interface ResponseError extends Error {
    statusCode: number
}

const app = express();

app.set('json spaces', 2)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    return next(createHttpError(400, 'Error parsing JSON.'))
})

app.get('/join-discord', (req: Request, res: Response, next: NextFunction) => {
    return next(createHttpError(405, 'Route must use POST method.'))
})

app.post('/join-discord', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.is('json')) {
        return next(createHttpError(400, 'Request type must be set to application/json.'))
    }
    if (!req.body.code) {
        return next(createHttpError(400, 'Request body missing code parameter.'))
    }
        
    try {
        const tokenResponse = await fetch(apiUrl + '/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': process.env.CLIENTID,
                'client_secret': process.env.CLIENTSECRET,
                'grant_type': 'authorization_code',
                'code': req.body.code,
                'redirect_uri': 'http://localhost:5173/dashboard/discord'
            })
        })

        const accessToken = (await tokenResponse.json()).access_token
        if (tokenResponse.status === 400) {
            return next(createHttpError(400, 'Invalid code.'))
        }
        else if (!tokenResponse.ok || !accessToken) {
            throw createHttpError(tokenResponse.status, 'Failed to fetch access token from Discord.')
        }
        
        const usersMeResponse = await fetch(apiUrl + '/users/@me', {
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        })
        const userId = (await usersMeResponse.json()).id
        if (!usersMeResponse.ok || !userId) {
            throw createHttpError(usersMeResponse.status, 'Failed to fetch user id from Discord.')
        }

        const addMemberResponse = await fetch(`${apiUrl}/guilds/1019349424369057966/members/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bot ${process.env.TOKEN}`
            },
            body: JSON.stringify({
                'access_token': accessToken
            })
        })

        if (addMemberResponse.status === 201) {
            res.status(201).type('json').send({
                status: 201,
                message: 'User successfully added to Discord server.',
                data: await addMemberResponse.json()
            })
        }
        else if (addMemberResponse.status === 204) {
            res.status(204).type('json').send({
                status: 204,
                message: 'User is already a member of the Discord server.'
            })
        }
        else {
            throw createHttpError(addMemberResponse.status, 'Error being added to Discord server.')
        }
    }
    catch (error) {
        console.error(error)
        return next(createHttpError(500, 'Error adding to Discord server.'))
    }
    
})

app.get('*', (req: Request, res: Response, next: NextFunction) => {
    next(createHttpError(404, 'Route not found.'))
})

app.use((error: ResponseError, request: Request, response: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal server error.'
    response.status(statusCode).type('json').send({
        'status': statusCode,
        'message': message
    })
})

export default app