import {
    MessagePayload,
    MessageReplyOptions,
    InteractionReplyOptions,
} from "discord.js";

export interface QA {
    id: string;
    question: string;
    match: RegExp;
    answer:
        | string
        | MessagePayload
        | (MessageReplyOptions & InteractionReplyOptions);
}
const qa: QA[] = [
    {
        id: "start",
        question: "When will RythmHacks start?",
        match: /^(?=.*(rythmhacks|hackathon))(?=.*(start|begin)).*$/gim,
        answer: "RythmHacks will be on <t:1691121600:D> (<t:1691121600:R>)",
    },
    {
        id: "location",
        question: "Where will RythmHacks be?",
        match: /^(?=.*(rythmhacks|hackathon))(?=.*(where|location)).*$/gim,
        answer: "Stay tuned for the venue!",
    },
];

export default qa;
