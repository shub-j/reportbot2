const { MessageEmbed } = require("discord.js");
const rbx = require("noblox.js");
const Trello = require("trello");
let trello = new Trello("cff3175d7e0b5be89e089575811f1d73", "8ce146c5b5292bdf11f551bf057095db934257b9a3128c66c7df2960f82c6150");

module.exports = {
    name: "report",
    category: "info",
    description: "Report a player",
    run: async (client, message, args) => {
        if (!args[0]) return message.reply("usage: \`\`;report [USERNAME] [EVIDENCE LINK] [REASON]\`\`");
        if (!args[1]) return message.reply("usage: \`\`;report [USERNAME] [EVIDENCE LINK] [REASON]\`\`")
        if (!args[1].startsWith("http")) return message.reply("you must enter a valid link!");
        const rUsername = args[0];
        rbx.getIdFromUsername(rUsername).catch(err => {
            return message.reply("sorry, that user doesn't seem to exist, double check your spelling and try again!");
        })
        rbx.getIdFromUsername(rUsername).then(id => { // gets user id for the specific part of the embed
            if (id) {
                const rEvidence = args[1];
                const rReason = args.splice(2).join(" ");
                trello.addCard(`${rUsername}:${id}`, `**Report**\n\n**Username:** ${rUsername}\n**User ID:** ${id}\n**Reason:** ${rReason}\n**Evidence:** ${rEvidence}\n\n\n**Reported by:** ${message.member.user.tag}`, '5e8a6c78235ba178691e8538',
                function (error, trelloCard) {
                    if (error) {
                        const failedEmbed = new MessageEmbed()
                            .setAuthor(message.member.user.tag, message.author.displayAvatarURL())
                            .setColor("RED")
                            .setFooter(client.user.username)
                            .setTimestamp()
                            .setTitle("Report Failed")
                            .setDescription("Report has failed to publish. Contact a staff member and try again.");

                        message.channel.send(failedEmbed);

                    }
                    else {
                        const successEmbed = new MessageEmbed()
                            .setAuthor(message.member.user.tag, message.author.displayAvatarURL())
                            .setColor("YELLOW")
                            .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`) // gets the roblox profile picture
                            .setFooter(client.user.username)
                            .setTimestamp()
                            .setTitle("Report")
                            .addField("Username", rUsername)
                            .addField("User ID", id)
                            .addField("Reason", rReason)
                            .addField("Evidence link", rEvidence);

                        message.channel.send(trelloCard.shortUrl, successEmbed);
                    }
                });
            }
        });
    }
}