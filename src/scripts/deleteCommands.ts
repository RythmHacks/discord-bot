import { REST, Routes } from "discord.js";
import { config } from "dotenv";

config();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

(async () => {
    try {
        console.log(
            `Removing all commands from ${
                process.env.ENV === "dev" ? "guild" : "global"
            } commands`
        );
        let data: any;
        if (process.env.ENV === "dev") {
            data = await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENTID as string,
                    "1019349424369057966"
                ),
                { body: [] }
            );
        } else {
            data = await rest.put(
                Routes.applicationCommands(process.env.CLIENTID as string),
                { body: [] }
            );
        }
        console.log(`commands are set to ${data}`);
    } catch (err) {
        console.error(err);
    }
})();
