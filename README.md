# discord-bot

## How to contribute

1. Clone the repo
2. In a terminal in the project directory, run `npm i`
3. Run `tsc -w` to start the typescript compiler
4. Create a file in the project root directory called `.env`
5. Copy everything in `.env.template` and put it in `.env`, filling in the missing values
6. Write some code and run `node .` to start the bot

### Getting database types
1. Run `npx supabase login`
2. Put in your login stuff
3. Run `npx supabase projects list`
4. Find the correct project and copy the ID
5. Run `npx supabase gen types typescript --project-id <ID> > ./src/types/database.ts`

### Updating/deleting slash commands

For updating slash commands, the npm scripts `cmdsDev` and `cmdsProd` have been conveniently created for this very purpose. Simply run `npm run cmdsDev` or `npm run cmdsProd` to update the guild and global slash commands respectively

To delete all slash commands in the guild, or globally, run the `deleteCommands.js` file with `ENV=dev` or `ENV=prod` before the node command.

Guild slash commands update instantly in one guild, while global slash commands take a while, but update everywhere. Probably use guild slash commands for everything.
