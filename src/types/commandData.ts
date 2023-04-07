import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface Command {
    data: SlashCommandBuilder;
    cooldown?: number;
    execute: (interaction: ChatInputCommandInteraction) => void;
}
