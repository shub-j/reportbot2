const { MessageEmbed } = require("discord.js");
const rbx = require("noblox.js");
const Trello = require("trello");
let trello = new Trello(
  "cff3175d7e0b5be89e089575811f1d73",
  "8ce146c5b5292bdf11f551bf057095db934257b9a3128c66c7df2960f82c6150"
);
const fetch = require("node-fetch");

module.exports = {
  name: "check",
  category: "info",
  description: "Check a player",
  run: async (client, message, args) => {
    if (!args[0]) return message.reply("usage: ``;check [USERNAME]");
    const rUsername = args[0];
    rbx.getIdFromUsername(rUsername).catch(err => {
      return message.reply(
        "sorry, that user doesn't seem to exist, double check your spelling and try again!"
      );
    });
    rbx.getIdFromUsername(rUsername).then(id => {
      // gets user id for the specific part of the embed
      if (id) {
        fetch("https://trello.com/b/ATaw6olA/testing.json")
          .then(res => res.json())
          .then(json => {
            const cards = json.cards;
            const card = cards.find(c => c.name === `${rUsername}:${id}`);
            if (!card) {
              return message.reply("this player has no active report.");
            }
            // console.log(card)
            // return console.log(card.id)
            trello.getCard("5e8a5ab750c2ca26842c6d9f", card.id, function(
              error,
              trelloCard
            ) {
              if (error) {
                return;
              } else {
                let status;
                if (card.idList === "5e8a5bf4ec11e251601d8c9c") {
                  status = "Pending";
                } else if (card.idList === "5e8a5c0912c17e588f7a5914") {
                  status = "Accepted";
                } else if (card.idList === "5e8a5c031cc7618cedfa7657") {
                  status = "Declined";
                } else {
                  status = "Unknown";
                }
                const cardInfo = new MessageEmbed()
                  .setAuthor(
                    message.member.user.tag,
                    message.author.displayAvatarURL()
                  )
                  .setColor("YELLOW")
                  .setThumbnail(
                    `https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`
                  ) // gets the roblox profile picture
                  .setFooter(client.user.username)
                  .setTimestamp()
                  .setTitle("Report")
                  .setDescription(trelloCard.desc)
                  .addField("Status", status);

                message.channel.send(trelloCard.shortUrl, cardInfo);
              }
            });
          });
      }
    });
  }
};
