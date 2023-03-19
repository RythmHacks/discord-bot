import {
    REST,
    Routes,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { Command } from "../types/commandData";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";

config();

const commandsDir = join(__dirname, "../commands");
const commandFiles = readdirSync(commandsDir).filter((file) =>
    file.endsWith(".js")
);

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
for (const file of commandFiles) {
    const command: Command = require(join(commandsDir, file));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

(async () => {
    try {
        console.log(`Refreshing ${commands.length} slash commands`);

        let data: any;
        if (process.env.ENV === "dev") {
            data = await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENTID as string,
                    "1019349424369057966"
                ),
                { body: commands }
            );
        } else {
            data = await rest.put(
                Routes.applicationCommands(process.env.CLIENTID as string),
                { body: commands }
            );
        }

        console.log(
            `Successfully refreshed ${data?.length ?? 0} slash commands`
        );
    } catch (err) {
        console.error(err);
    }
})();
