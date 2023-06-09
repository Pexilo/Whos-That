import { Embed } from "@utils/shortcuts";
import {
  ButtonBuilder,
  ButtonStyle,
  Collection,
  Message,
  TextChannel,
} from "discord.js";
import { ShewenyClient } from "sheweny";
import IGuild from "@models/IGuild";
const { GuildData } = require("./db/index");

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

export const SendMessageToPickerChannel = async (client: ShewenyClient) => {
  const guilds = await GuildData.find();
  guilds.forEach(async (guild: IGuild) => {
    if (
      !guild.sourceChannel ||
      !guild.pickerChannel ||
      !guild.whosThatChannel ||
      !guild.checkpoints ||
      guild.pickableUsers.length < 1
    )
      return;

    const currentGuild = await client.guilds.fetch(guild.id);
    const sourceChannel = (await client.channels.fetch(
      guild.sourceChannel
    )) as TextChannel;
    const pickerChannel = (await currentGuild.channels.fetch(
      guild.pickerChannel
    )) as TextChannel;
    if (!currentGuild) return;

    const randomCheckpoints = guild.checkpoints
      .sort(() => Math.random() - 0.5)
      .splice(0, 2);

    const randomMessages: Message<true>[] = [];

    for (const checkpoint of randomCheckpoints) {
      const msg = (
        await FindMessagesFromCheckpoint(sourceChannel, checkpoint, guild)
      ).random(5);
      randomMessages.push(...msg);
    }

    const randMessagesYears = GetMessageYears(randomMessages);

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
          .setDescription(
            `Pick the message to send to <#${guild.whosThatChannel}>`
          )
          .addFields(
            randomMessages.map((message, i) => {
              return {
                name: `${NumberToEmoji[i]}`,
                value: message.content,
              };
            })
          )
          .setFooter({
            text: `from ${randMessagesYears}`,
            iconURL: client.user?.displayAvatarURL(),
          })
          .setTimestamp(),
      ],
      components: [
        {
          type: 1,
          components:
            buttons.length >= 5
              ? buttons.slice(0, 5)
              : [
                  new ButtonBuilder()
                    .setCustomId("button-disable2")
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                ],
        },
        {
          type: 1,
          components:
            buttons.length > 5
              ? buttons.slice(5, buttons.length)
              : [
                  new ButtonBuilder()
                    .setCustomId("button-disable1")
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                ],
        },
        {
          type: 1,
          components: [
            new ButtonBuilder()
              .setCustomId(`picker_refresh`)
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("🔁"),
          ],
        },
      ],
    });
  });
};

async function SortMessages(
  randomMessages: Collection<string, Message<true>>,
  guild: IGuild
) {
  const randomMessagesWithoutEmbeds = new Collection<string, Message<true>>();

  for (const message of randomMessages.values()) {
    if (
      !message.embeds.length &&
      !message.attachments.size &&
      !message.content.includes("http") &&
      message.content.length > 15 &&
      !message.content.includes("<") &&
      !message.content.includes(">") &&
      !message.content.startsWith(":") &&
      !message.content.endsWith(":") &&
      guild.pickableUsers.includes(message.author.id)
    ) {
      randomMessagesWithoutEmbeds.set(message.id, message);
    }
  }

  return randomMessagesWithoutEmbeds;
}

async function FindMessagesFromCheckpoint(
  sourceChannel: TextChannel,
  randomCheckpoint: string,
  guild: IGuild
) {
  const messagesFromCheckpoint = await sourceChannel.messages.fetch({
    limit: 100,
    after: randomCheckpoint,
  });
  const randomMessages = await SortMessages(messagesFromCheckpoint, guild);

  return randomMessages;
}

function GetMessageYears(messages: Message<true>[]) {
  let years: number[] = [];
  for (const message of messages) {
    let year = new Date(message.createdTimestamp).getFullYear();
    if (!years.includes(year)) {
      years.push(year);
    }
  }
  return years;
}
