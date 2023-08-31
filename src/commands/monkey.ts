import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import fetch from "node-fetch";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("monkey")
        .setDescription("Get a random image of a monkey, because why not"),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const image: any = await fetch(
            `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASHKEY}&query=monkey`
        );
        interaction.editReply((await image.json()).urls.full);
        return 
    },
};