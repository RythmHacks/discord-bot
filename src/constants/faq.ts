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
        answer: "RythmHacks will be on <t:1693602000:D> (<t:1693602000:R>)",
    },
    {
        id: "location",
        question: "Where will RythmHacks be?",
        match: /^(?=.*(rythmhacks|hackathon))(?=.*(where|location)).*$/gim,
        answer: "RythmHacks will be taking place at the Accelerator Centre (295 Hagey Blvd, Waterloo, Ontario, Canada, Earth, Solar System, Milky Way, Local Cluster, Universe, Simulation #83) https://www.google.com/maps/place/Accelerator+Centre/@43.4772382,-80.5520769,17z/data=!3m1!4b1!4m6!3m5!1s0x882bf154a15e1049:0x19ae946fefbc593a!8m2!3d43.4772343!4d-80.5494966!16s%2Fg%2F11b62103_j?entry=ttu",
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
    {
        id: "participationCost",
        question: "How much does it cost to participate in RythmHacks?",
        match: /^(?=.*(cost|money))(?=.*(entry|participat)).*$/gim,
        answer: "Participation in RythmHacks is completely free!",
    },
    {
        id: "food",
        question: "Will there be food/what food will be served at RythmHacks?",
        match: /^.*food.*$/gim,
        answer: "Food will be served for free at RythmHacks. Food outline will come out later",
    },
    {
        id: "sleep",
        question: "Can we stay overnight?",
        match: /^.*(sleep|overnight).*$/gim,
        answer: "You are welcome to stay overnight (bring a sleeping bag!)",
    },
];

export default qa;
