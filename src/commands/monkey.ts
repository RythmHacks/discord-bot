import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import fetch from "node-fetch";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("monkey")
        .setDescription("Get a random image of a monkey, because why not"),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        let choice = Math.floor(Math.random() * 25)

        if (choice === 0) {
            interaction.editReply("https://cdn.discordapp.com/attachments/1086658699201884321/1093953022318616636/Hooman.jpg")
            return
        } else {
            const image: any = await fetch(
                `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASHKEY}&query=monkey`
            );
            interaction.editReply((await image.json()).urls.full);
            return 
        }
    },
};