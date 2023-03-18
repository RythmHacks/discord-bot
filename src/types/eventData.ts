import { Events, Client } from "discord.js";

export interface EventData {
    name: string;
    once: boolean;
    execute: (...args: any[]) => void;
}
