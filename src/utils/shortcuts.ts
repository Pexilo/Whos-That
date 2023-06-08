import {
  CommandInteraction,
  EmbedBuilder,
  Guild,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonInteraction,
} from "discord.js";
const { GuildData } = require("../db/index");

export function Embed(color = true) {
  const embed = new EmbedBuilder();
  if (color) embed.setColor("#2b2d31");
  return embed;
}

export function Wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function Defer(interaction: CommandInteraction | ButtonInteraction) {
  let bool = true;
  await interaction.deferReply({ ephemeral: true }).catch(() => {
    bool = false;
  });
  await Wait(1000);
  return bool;
}

export function Truncate(str: string, max: number) {
  return str.length > max ? str.substring(0, max - 1) + "..." : str;
}

export function CreateButtons(buttons: any[]) {
  let buttonRow = new ActionRowBuilder<ButtonBuilder>();
  for (const button of buttons) {
    buttonRow.addComponents(
      new ButtonBuilder()
        .setCustomId(button.customId)
        .setLabel(button.label)
        .setStyle(button.style)
        ?.setEmoji(button.emoji)
    );
  }
  return buttonRow;
}

export async function CreateGuild(guild: Guild) {
  const createGuild = new GuildData({ id: guild.id });
  createGuild
    .save()
    .then(() =>
      console.log(
        `➕ Guild: ${guild.name} - ${guild.id} - ${guild.members.cache.size} users`
      )
    );
}

export async function DeleteGuild(guild: Guild) {
  await GuildData.deleteOne({ id: guild.id }).then(() =>
    console.log(
      `➖ Guild: ${guild.name} - ${guild.id} - ${guild.members.cache.size} users`
    )
  );
}

export async function FetchGuild(guild: Guild) {
  const data = await GuildData.findOne({ id: guild.id });
  if (!data) await CreateGuild(guild);
  return data;
}

export async function UpdateGuild(guild: Guild, data: any) {
  const guildData = await FetchGuild(guild);
  if (typeof data !== "object") return;
  for (const key in data) {
    if (guildData[key] !== data[key]) guildData[key] = data[key];
  }
  return guildData.save();
}
