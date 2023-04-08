import {
    Events,
    MessageReaction,
    EmbedBuilder,
    MessageEditOptions,
    TextBasedChannel,
    MessageCreateOptions,
} from "discord.js";
import supabase from "../supabase";

module.exports = {
    name: Events.MessageReactionAdd,
    once: false,
    async execute(reaction: MessageReaction) {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (err) {
                console.error(`Error when fetching message reaction ${err}`);
                return;
            }
        }

        if (reaction.emoji.name === "⭐" && reaction.count > 3) {
            const { data, error } = await supabase
                .from("starboard-msgs")
                .select()
                .eq("id", reaction.message.id);

            if (error) {
                console.error(error);
                return;
            }

            const embed: EmbedBuilder = new EmbedBuilder()
                .setAuthor({
                    name:
                        reaction.message?.member?.nickname ??
                        reaction.message?.author?.username ??
                        "",
                    url:
                        reaction.message?.member?.avatarURL() ??
                        reaction.message.author?.avatarURL() ??
                        "",
                })
                .setTitle("Link to message")
                .setURL(reaction.message.url)
                .setDescription(reaction.message.content)
                .setTimestamp(Date.now());

            if (reaction.message.attachments.first()) {
                embed.setImage(reaction.message.attachments.first()?.url ?? "");
            }

            const message: MessageEditOptions & MessageCreateOptions = {
                content: `⭐ ${reaction.count} | <#${reaction.message.channelId}>, <@${reaction.message?.author?.id}>`,
                embeds: [embed],
            };

            if (data.length === 0) {
                const starboardMsg = await (
                    (await reaction.client.channels.fetch(
                        "1094284449434321016"
                    )) as TextBasedChannel
                ).send(message);

                const { error } = await supabase.from("starboard-msgs").insert({
                    id: reaction.message.id,
                    "starboard-message-id": starboardMsg.id,
                });

                if (error) {
                    console.error(error);
                }
            } else {
                (
                    await (
                        (await reaction.client.channels.fetch(
                            "1094284449434321016"
                        )) as TextBasedChannel
                    ).messages.fetch(data[0]["starboard-message-id"])
                ).edit(message);
            }
        }
    },
};
