import express, { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import fetch from 'node-fetch';
import supabase from './supabase';

const apiUrl = process.env.DISCORD_API_URL || 'https://discord.com/api'

interface ResponseError extends Error {
    statusCode: number
}

const app = express();

app.use(function (req, res, next) {
    const corsWhitelist = [
        'http://localhost:5173',
        'https://dash.rythmhacks.ca',
        'https://dash-rythmhacks-ca.vercel.app'
    ]
    if (corsWhitelist.includes(req.headers.origin || '')) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
        return;
    }
    next();
  });

app.set('json spaces', 2)


app.use(express.json())

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    return next(createHttpError(400, 'Error parsing JSON.'))
})

app.use(express.urlencoded({ extended: true }))


app.get('/join-discord', (req: Request, res: Response, next: NextFunction) => {
    return next(createHttpError(405, 'Route must use POST method.'))
})

app.post('/join-discord', async (req: Request, res: Response, next: NextFunction) => {
    res.type('json')
    if (!req.is('json')) {
        return next(createHttpError(400, 'Request type must be set to application/json.'))
    }

    const { code, supabase_user_id } = req.body
    if (!code) {
        return next(createHttpError(400, 'Request body missing code parameter.'))
    }
    if (!supabase_user_id) {
        return next(createHttpError(400, 'Request body missing supabase_user_id parameter.'))
    }
        
    try {
        const { data, error } = await supabase.auth.admin.getUserById(supabase_user_id)

        if (error) return next(createHttpError(400, 'An error occured while trying to access your RythmHacks data: ' + error.message))
        
        const { user: { user_metadata } } = data

        const tokenResponse = await fetch(apiUrl + '/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                'client_id': process.env.CLIENTID,
                'client_secret': process.env.CLIENTSECRET,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': 'http://dash.rythmhacks.ca/dashboard/discord'
            })
        })

        const json = await tokenResponse.json()
        const accessToken = json.access_token
        if (tokenResponse.status === 400) {
            return next(createHttpError(400, 'Invalid code: ' + JSON.stringify(json)))
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
                'access_token': accessToken,
                'nick': `${user_metadata.first_name || '[First Name]'} ${user_metadata.last_name || 
                '[Last Name]'}`,
                'roles': ['1058796629622263868']
            })
        })

        if (addMemberResponse.status === 201) {
            res.status(201).send({
                status: 201,
                message: 'User successfully added to Discord server.'
            })
        }
        else if (addMemberResponse.status === 204) {
            res.status(200).send({
                status: 204,
                message: 'User is already a member of the Discord server.'
            })
        }
        else {
            return next(createHttpError(addMemberResponse.status, 'Error being added to Discord server.'))
        }
    }
    catch (error: any) {
        console.error(error)
        return next(createHttpError(500, 'An unexpected internal error occured, please contact the RythmHacks devs: ' + error.message))
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