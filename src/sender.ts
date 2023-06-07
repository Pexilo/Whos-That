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
      if (
        !guild.sourceChannel ||
        !guild.pickerChannel ||
        !guild.whosThatChannel ||
        !guild.checkpoints
      )
        return;
      const sourceChannel = (await client.channels.fetch(
        guild.sourceChannel
      )) as TextChannel;
      const pickerChannel = (await client.channels.fetch(
        guild.pickerChannel
      )) as TextChannel;
      const whosThatChannel = (await client.channels.fetch(
        guild.whosThatChannel
      )) as TextChannel;
      if (
        !sourceChannel ||
        !pickerChannel ||
        !whosThatChannel ||
        !guild.checkpoints
      )
        return;

      const randomCheckpoints = guild.checkpoints
        .sort(() => Math.random() - 0.5)
        .splice(0, 3);

      const randomMessages: Message<true>[] = [];

      for (const checkpoint of randomCheckpoints) {
        const msg = (
          await FindMessagesFromCheckpoint(sourceChannel, checkpoint)
        ).random(3);
        randomMessages.push(...msg);
      }

      let buttons = [];
      buttons.push(
        randomMessages.splice(0, 4).map((message, i) => {
          return new ButtonBuilder()
            .setCustomId(`picker_${i}`)
            .setLabel(`${NumberToEmoji[i]}`)
            .setStyle(ButtonStyle.Primary);
        })
      );

      //send message to picker channel
      pickerChannel.send({
        content: `Time to pick a message to send!`,
        embeds: [
          Embed()
            .setTitle(`WhosThat`)
            .setDescription(
              `Pick a message to send to <#${whosThatChannel.id}>`
            )
            .setTimestamp()
            .addFields(
              randomMessages.map((message, i) => {
                return {
                  name: `${NumberToEmoji[i]}`,
                  value: message.content,
                };
              })
            ),
        ],
        // components: [
        //   {
        //     type: 1,
        //     components: [buttons],
        //   },
        //   {
        //     type: 1,
        //     components: [
        //       new ButtonBuilder()
        //         .setCustomId("picker_1")
        //         .setLabel("1")
        //         .setStyle(ButtonStyle.Primary),
        //     ],
        //   },
        // ],
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
      message.content.length > 15
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
    limit: 50,
    after: randomCheckpoint,
  });
  const randomMessages = await SortMessages(messagesFromCheckpoint);

  return randomMessages;
}
