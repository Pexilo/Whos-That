import { Embed } from "@utils/shortcuts";
import {
  ButtonBuilder,
  ButtonStyle,
  Collection,
  Message,
  TextChannel,
} from "discord.js";
import { ShewenyClient } from "sheweny";
const { GuildData } = require("./db/index");


type Guilds = {
  id: string;
  sourceChannel: string;
  pickerChannel: string;
  whosThatChannel: string;
  checkpoints: [];
};

module.exports = (client: ShewenyClient) => {
  const NumberToEmoji = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
    "🔟",
  ];

  (async () => {
    const guilds = await GuildData.find();
    guilds.forEach(async (guild: Guilds) => {
      console.log("l36");
      if (
        !guild.sourceChannel ||
        !guild.pickerChannel ||
        !guild.whosThatChannel ||
        !guild.checkpoints
      )
        return;
      console.log("l44")
      //fetch guild 
      const currentGuild = await client.guilds.fetch(guild.id);
      const sourceChannel = await client.channels.fetch(
        guild.sourceChannel
      ) as TextChannel;
      const pickerChannel = await currentGuild.channels.fetch(
        guild.pickerChannel
      ) as TextChannel;
      if (
        !currentGuild
      )
        return;
      console.log("l56")

      const randomCheckpoints = guild.checkpoints
        .sort(() => Math.random() - 0.5)
        .splice(0, 2);

      const randomMessages: Message<true>[] = [];

      for (const checkpoint of randomCheckpoints) {
        const msg = (
          await FindMessagesFromCheckpoint(sourceChannel, checkpoint)
        ).random(5);
        randomMessages.push(...msg);
      }

      const randMessagesYears = GetMessageYears(randomMessages)

      console.log("l73");
      let buttons: ButtonBuilder[] = [];
      randomMessages.map((message, i) => {
        buttons.push(
          new ButtonBuilder()
            .setCustomId(`picker_${message.id}_${message.author.id}`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji(`${NumberToEmoji[i]}`)
        );
      });

      //send message to picker channel
      pickerChannel.send({
        embeds: [
          Embed()
            .setTitle("Who's that?")
            .setDescription(`Pick the message to send to <#${guild.whosThatChannel}>`)
            .addFields(
              randomMessages.map((message, i) => {
                return {
                  name: `${NumberToEmoji[i]}`,
                  value: message.content,
                };
              }
              )
            )
            .setFooter({
              text: `from ${randMessagesYears}`,
              iconURL: client.user?.displayAvatarURL(),
            })
        ],
        components: [
          {
            type: 1,
            components: buttons.slice(0, 5),
          },
          {
            type: 1,
            components: buttons.slice(5, buttons.length),
          },
        ],
      });
    });
  })();
};


async function SortMessages(randomMessages: Collection<string, Message<true>>) {
  const randomMessagesWithoutEmbeds = new Collection<string, Message<true>>();

  for (const message of randomMessages.values()) {
    if (
      !message.embeds.length &&
      !message.attachments.size &&
      !message.content.includes("http") &&
      message.content.length > 15 &&
      (!message.content.startsWith("<") && !message.content.endsWith(">")) && (!message.content.startsWith(":") && (!message.content.endsWith(":")))
    ) {
      randomMessagesWithoutEmbeds.set(message.id, message);
    }
  }

  return randomMessagesWithoutEmbeds;
}

async function FindMessagesFromCheckpoint(
  sourceChannel: TextChannel,
  randomCheckpoint: string
) {
  const messagesFromCheckpoint = await sourceChannel.messages.fetch({
    limit: 100,
    after: randomCheckpoint,
  });
  const randomMessages = await SortMessages(messagesFromCheckpoint);

  return randomMessages;
}

function GetMessageYears(messages: Message<true>[]) {
  let years: number[] = []
  for (const message of messages) {
    let year = new Date(
      message.createdTimestamp
    ).getFullYear()
    if (!years.includes(year)) {
      years.push(year)
    }
  }
  return years
}
