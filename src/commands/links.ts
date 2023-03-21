import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("links")
        .setDescription("Get all the links you'll ever need"),
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({
            embeds: [
                new EmbedBuilder().setTitle("RythmHacks Links").setDescription(
                    `
                    [Pre-register now!](https://opnform.com/forms/rythmhacks-pre-registration)
                    [Check out our cool website!](https://www.rythmhacks.ca)
                    [Read some blog posts!](https://medium.com/@rythmhacks)
                    [Instagram](https://www.instagram.com/rythm.hacks/)
                    [Twitter](https://twitter.com/rythmhacks/)
                    [GitHub](https://github.com/RythmHacks)
                    Got a question? Email us at \`rythmhacks@gmail.com\`!
            `.replace(/  +/g, "")
                ),
            ],
            ephemeral: true,
        });
    },
};
