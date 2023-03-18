import { Events, BaseInteraction } from "discord.js";
import { Command } from "../types/commandData";
import { CustomClient } from "../types/misc";

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: BaseInteraction) {
        console.log(interaction);
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
    },
};
