import {
    Events,
    Message,
    MessagePayload,
    MessageReplyOptions,
} from "discord.js";

import qa from "../constants/faq";
import supabase from "../supabase";

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message: Message) {
        if (message.author.bot) {
            return;
        }

        if (message.author.id == "978466574497370113") {
            message.react("🐒");
        }

        // Automatic FAQ
        if (
            message.channel.id === "1063665997166428270" ||
            message.channel.id === "1086658699201884321"
        ) {
            for (let pair of qa) {
                if (message.content.match(pair.match)) {
                    message.reply(pair.answer);

                    let { data, error } = await supabase
                        .from("faq")
                        .select()
                        .eq("id", pair!.id);

                    if (error) {
                        console.error(error);
                        return;
                    }

                    ({ error } = await supabase.from("faq").upsert({
                        id: pair!.id,
                        timesAsked:
                            data && data.length > 0
                                ? data[0].timesAsked + 1
                                : 1,
                    }));

                    if (error) {
                        console.error(error);
                        return;
                    }

                    break;
                }
            }
        }
    },
};
