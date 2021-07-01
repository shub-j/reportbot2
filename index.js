
            trello.updateCardList(card.id, "5e8a5c0912c17e588f7a5914", function(
              error,
              trelloCard
            ) {
              if (error) {
                return;
              } else {
                trello.addCommentToCard(
                  card.id,
                  `**Report accepted by:** ${message.member.user.tag}`
                );
                const acceptedEmbed = new MessageEmbed()
                  .setAuthor(
                    message.member.user.tag,
                    message.author.displayAvatarURL()
                  )
                  .setColor("GREEN")
                  .setThumbnail(
                    `https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`
                  ) // gets the roblox profile picture
                  .setFooter(client.user.username)
                  .setTimestamp()
                  .setTitle("Report Accepted")
                  .addField("Description", trelloCard.desc);

                message.channel.send(trelloCard.shortUrl, acceptedEmbed);
              }
            });
          });
      }
    });
  }

  if (cmd === "decline") {
    if (!args[0])
      return message.reply("usage: ``;decline [USERNAME] [REASON]``");
    if (!args[1])
      return message.reply("usage: ``;decline [USERNAME] [REASON]``");
    const rUsername = args[0];
    const rReason = args[1];
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
            trello.updateCardList(card.id, "5e8a5c031cc7618cedfa7657", function(
              error,
              trelloCard
            ) {
              if (error) {
                return;
              } else {
                trello.addCommentToCard(
                  card.id,
                  `**Report declined by:** ${message.member.user.tag}\n**Reason:** ${rReason}`
                );
                const declinedEmbed = new MessageEmbed()
                  .setAuthor(
                    message.member.user.tag,
                    message.author.displayAvatarURL()
                  )
                  .setColor("RED")
                  .setThumbnail(
                    `https://www.roblox.com/bust-thumbnail/image?userId=${id}&width=420&height=420&format=png`
                  ) // gets the roblox profile picture
                  .setFooter(client.user.username)
                  .setTimestamp()
                  .setTitle("Report Declined")
                  .addField("Description", trelloCard.desc)
                  .addField("Reason", rReason);

                message.channel.send(trelloCard.shortUrl, declinedEmbed);
              }
            });
          });
      }
    });
  }

  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  console.log(`${prefix}${cmd} run in server ${message.guild.name}`);
  if (command) command.run(client, message, args);
});

client.login(process.env.TOKEN);
