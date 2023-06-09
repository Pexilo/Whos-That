import { Defer, FetchGuild, FetchUser, UpdateUser } from "@utils/shortcuts";
import { StringSelectMenuInteraction, TextChannel } from "discord.js";
import { SelectMenu } from "sheweny";
import type { ShewenyClient } from "sheweny";
import IGuild from "@models/IGuild";
import IWTRes from "@models/IWTRes";

export class WhosThatSelect extends SelectMenu {
  constructor(client: ShewenyClient) {
    super(client, [/whosthat-select_.*/]);
  }

  async execute(selectMenu: StringSelectMenuInteraction) {
    if (!(await Defer(selectMenu))) return;

    const { values, guild, user } = selectMenu;

    const authorId = selectMenu.customId.split("_")[1];
    const messageId = selectMenu.customId.split("_")[2];
    if (!authorId || !messageId) return;

    const userData = await FetchUser(selectMenu.user.id, guild!);
    const guildData: IGuild = await FetchGuild(guild!);
    if (!guildData || !userData) return;

    const sourceChannel = (await guild!.channels.fetch(
      guildData.sourceChannel
    )) as TextChannel;
    if (!sourceChannel)
      return selectMenu.editReply({
        content: "An error occured. Could not fetch sourceChannel.",
      });

    const message = await sourceChannel.messages.fetch(messageId);
    if (!message)
      return selectMenu.editReply({
        content: "An error occured. Could not fetch message.",
      });

    const messageAlreadyResponded = userData.whosThatResponded.find(
      (r: IWTRes) => r.id === messageId
    );
    if (messageAlreadyResponded && messageAlreadyResponded.id === messageId)
      return selectMenu.editReply({
        content: `⛔ Vous avez déjà répondu aujourd'hui !\nLa réponse était <@${authorId}> ! ${message.url}\n\n> Points: \`${userData.points}\` points`,
      });

    const whosthatRes = [
      ...userData.whosThatResponded,
      { id: messageId, correct: authorId === values[0] },
    ];
    await UpdateUser(user.id, guild!, {
      whosThatResponded: whosthatRes,
    });

    if (authorId === values[0]) {
      await UpdateUser(user.id, guild!, {
        points: userData!.points + 2,
      });

      return selectMenu.editReply({
        content: `<a:cocoDance:1055513979960696892> Bonne réponse !\nLa personne qui a envoyé le message est <@${authorId}> ! ${
          message.url
        }\n\n> \`+1\` point de participation\n> \`+1\` point de bonne réponse\n> Total: \`${
          userData!.points + 2
        }\` points`,
      });
    } else {
      await UpdateUser(user.id, guild!, {
        points: userData!.points + 1,
      });

      return selectMenu.editReply({
        content: `⛔ Mauvaise réponse !\nLa réponse était <@${authorId}> ! ${
          message.url
        }\n\n> \`+1\` point de participation\n> Total: \`${
          userData!.points + 1
        }\` points`,
      });
    }
  }
}
