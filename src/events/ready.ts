import {
    Events,
    Client,
    TextChannel,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} from "discord.js";
import qa from "../constants/faq";

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        console.log(`ready nerd ${client?.user?.tag}`);
        // change this to update the faq message (yeah probably a dumb way to do this)
        if (false) {
            (
                (await client.channels.fetch(
                    "1064681828335767633"
                )) as TextChannel
            )?.send({
                embeds: [
                    {
                        title: "Frequently Asked Questions",
                        description:
                            "Please select a question below. If you can't find your question, feel free to ask at <#1063665997166428270>",
                    },
                ],
                components: [
                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId("faq")
                            .setPlaceholder("No question selected")
                            .addOptions(
                                ...qa.map((pair) => {
                                    return {
                                        label: pair.question,
                                        value: pair.id,
                                    };
                                })
                            )
                    ),
                ],
            });
        }
    },
};
