import {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    BaseInteraction,
} from "discord.js";
import { Command } from "./types/commandData";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";

config();
const token = process.env.TOKEN;

interface CustomClient extends Client {
    commands?: Collection<{}, {}>;
}

const client: CustomClient = new Client({
    intents: [GatewayIntentBits.Guilds],
});
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

client.once(Events.ClientReady, (c: Client) => {
    console.log(`ready nerd ${c?.user?.tag}`);
});

// Command handling
client.once(Events.InteractionCreate, async (interaction: BaseInteraction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const command: Command | undefined = <Command | undefined>(
        (interaction.client as CustomClient)?.commands?.get(
            interaction.commandName
        )
    );

    if (!command) {
        console.error(
            `couldn't find the ${interaction.commandName} command you idiot`
        );
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: `Whoops! The monkeys who "programmed" me hecked up`,
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: `Whoops! The monkeys who "programmed" me hecked up`,
                ephemeral: true,
            });
        }
    }
});

client.login(token);
