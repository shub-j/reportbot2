const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setAuthor(message.member.user.tag, message.author.displayAvatarURL())
            .setColor("YELLOW")
            .setThumbnail(client.user.displayAvatarURL)
            .setFooter(client.user.username)
            .setTimestamp()
            .setTitle("Ping")
            .setDescription("🏓 Pinging...");

        const msg = await message.channel.send(embed);
        embed.setDescription(`🏓 Pong!\nLatency: \`\`${Math.floor(msg.createdAt - message.createdAt)}ms\`\`\nAPI Latency: \`\`${Math.round(client.ping)}ms\`\``)
        msg.edit(embed);
    }
}