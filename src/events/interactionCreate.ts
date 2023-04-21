import {
    Events,
    BaseInteraction,
    Collection,
    InteractionReplyOptions,
} from "discord.js";
import { Command } from "../types/commandData";
import { CustomClient } from "../types/misc";
import qa from "../constants/faq";
import supabase from "../supabase";

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: BaseInteraction) {
        if (interaction.isChatInputCommand()) {
            const client: CustomClient = interaction.client;
            const command: Command | undefined = <Command | undefined>(
                client?.commands?.get(interaction.commandName)
            );
            const cooldowns: Collection<string, number> =
                client?.cooldowns?.get(command!.data!.name) as Collection<
                    string,
                    number
                >;

            if (!command) {
                console.error(
                    `couldn't find the ${interaction.commandName} command you idiot`
                );
                return;
            }
            const now = Date.now();

            if (cooldowns?.has(interaction.user.id)) {
                const userTimestamp = cooldowns?.get(interaction.user.id);
                if (
                    now - (userTimestamp ?? 0) * 1000 <
                    (command?.cooldown ?? 0)
                ) {
                    return await interaction.reply(
                        `The ${
                            command.data.name
                        } command is on cooldown. Try again <t:${~~(
                            ((command?.cooldown ?? 0) * 1000 -
                                (now - (userTimestamp ?? 0)) +
                                now) /
                            1000
                        )}:R>`
                    );
                }
            }

            try {
                await command.execute(interaction);
                if (cooldowns) {
                    cooldowns.set(interaction.user.id, now);
                    setTimeout(
                        () => cooldowns.delete(interaction.user.id),
                        (command.cooldown ?? 0) * 1000
                    );
                }
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
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === "faq") {
                let pair = qa.find((pair) => pair.id === interaction.values[0]);
                let answer = pair!.answer;

                let { data, error } = await supabase
                    .from("faq")
                    .select()
                    .eq("id", pair!.id);

                if (error) {
                    console.error(error);
                    return;
                }

                ({ error } = await supabase.from("faq").upsert({
                    id: pair!.id,
                    timesAsked:
                        data && data.length > 0 ? data[0].timesAsked + 1 : 1,
                }));

                if (error) {
                    console.error(error);
                    return;
                }

                interaction.reply(
                    typeof answer === "string"
                        ? { content: answer, ephemeral: true }
                        : {
                              ...(answer as InteractionReplyOptions),
                              ephemeral: true,
                          }
                );
            }
        }
    },
};
