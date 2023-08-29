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
                    [Hacker dashboard](https://dash.rythmhacks.ca)
                    [Hacker guide](https://rythmhacks.notion.site/rythmhacks/RythmHacks-2023-Hacker-Guide-81f51ef2250741d89dd91b2ca1650749)
                    [Devpost](https://rythmhacks2023.devpost.com)
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
