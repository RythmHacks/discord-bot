"use strict";
const { Client, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const token = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (c) => {
    console.log(`ready nerd ${c.user.tag}`);
});
client.login(token);
