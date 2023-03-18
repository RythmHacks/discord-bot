import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("help"),
  async execute(interaction: ChatInputCommandInteraction) {
    interaction.reply("wait help is obsolete now whelp");
  },
};
