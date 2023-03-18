import {
    Events,
    Message,
    MessagePayload,
    MessageReplyOptions,
} from "discord.js";

interface QA {
    question: RegExp;
    answer: string | MessagePayload | MessageReplyOptions;
}

const qa: QA[] = [
    {
        question: /^(?=.*(rythmhacks|hackathon))(?=.*(start|begin)).*$/gim,
        answer: "Rythmhacks will be on <t:1691121600:D> (<t:1691121600:R>)",
    },
];

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
                if (message.content.match(pair.question)) {
                    message.reply(pair.answer);
                }
            }
        }
    },
};
