import {
    Events,
    Message,
    MessagePayload,
    MessageReplyOptions,
} from "discord.js";

import qa from "../constants/faq";

module.exports = {
    name: Events.MessageCreate,
    once: false,
    execute(message: Message) {
        // Automatic FAQ
        if (
            message.channel.id === "1063665997166428270" ||
            message.channel.id === "1086658699201884321"
        ) {
            for (let pair of qa) {
                if (message.content.match(pair.match)) {
                    message.reply(pair.answer);
                }
            }
        }
    },
};
