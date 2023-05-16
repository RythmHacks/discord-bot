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
    {
        id: "teamSize",
        question: "How large can my team be?",
        match: /^(?=.*(team))(?=.*(size|big|large)).*$/gim,
        answer: "Teams can be a maximum of 4 people",
    },
    {
        id: "uniStudents",
        question: "Can university students/undergraduates participate?",
        match: /^.*((university student)|(undergraduate)).*$/gim,
        answer: "Unfortunately, university students and undergraduates are not allowed to attend",
    },
];

export default qa;
