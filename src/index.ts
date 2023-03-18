import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    BaseInteraction,
} from "discord.js";
import { Command } from "./types/commandData";
import { EventData } from "./types/eventData";
import { CustomClient } from "./types/misc";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";

config();
const token = process.env.TOKEN;

const client: CustomClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const eventsDir = join(__dirname, "events");
const eventsFiles = readdirSync(eventsDir).filter((file) =>
    file.endsWith(".js")
);

for (const file of eventsFiles) {
    const eventPath = join(eventsDir, file);
    const event: EventData = require(eventPath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.commands = new Collection();

const commandsDir = join(__dirname, "commands");
const commandFiles = readdirSync(commandsDir).filter((file) =>
    file.endsWith(".js")
);

for (const file of commandFiles) {
    const commandPath = join(commandsDir, file);
    const command: Command = require(commandPath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(
            `wtf man ${commandPath} doesn't have a data or execute property you nerd`
        );
    }
}

client.login(token);
