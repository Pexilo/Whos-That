import GenerateDiscordMessage from "@utils/generate-image";
import LanguageManager from "@utils/language-manager";
import { SendMessageToPickerChannel } from "@utils/sender";
import { Defer, Embed, FetchAndGetLang } from "@utils/shortcuts";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
} from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Button } from "sheweny";
const { randoSequence } = require("@nastyox/rando.js");

export class WhosThatMesageButtons extends Button {
  constructor(client: ShewenyClient) {
    super(client, [/picker_.*/]);
  }

  async execute(button: ButtonInteraction) {
    const { guild } = button;
    await Defer(button);

    const { guildData, lang } = await FetchAndGetLang(guild!);
    const languageManager = new LanguageManager();
    const whosThatMsgBtns =
      languageManager.getInterractionTranslation(lang).whosThatMsgBtns;

    if (button.customId === "picker_refresh") {
      await SendMessageToPickerChannel(this.client, button, guildData, lang);
      return button.editReply({
        content: whosThatMsgBtns.refreshResponse,
      });
    }

    const messageId = button.customId.split("_")[1];
    const authorId = button.customId.split("_")[2];

    const sourceChannel = (await guild!.channels.fetch(
      guildData!.sourceChannel
    )) as TextChannel;
    const message = await sourceChannel.messages.fetch(messageId);
    if (!message)
      return button.editReply({
        content: whosThatMsgBtns.fetchMsgErr,
      });

    const { attachment, content } = await GenerateDiscordMessage(message, lang);

    const whosThatChannel = (await guild!.channels.fetch(
      guildData!.whosThatChannel
    )) as TextChannel;
    if (!whosThatChannel)
      return button.editReply({
        content: whosThatMsgBtns.fetchWTCErr,
      });

    const embed = Embed()
      .setTitle(whosThatMsgBtns.title)
      .setAuthor({
        name: guild!.name,
        iconURL: guild!.iconURL()!,
      })
      .setImage(`attachment://${attachment.name}`)
      .setTimestamp();
    if (content.length > 150) embed.setDescription(content);

    let userToPick = guildData!.pickableUsers.filter(
      (u: string) => u !== authorId
    );

    userToPick = randoSequence(userToPick)
      .map((item: { value: any }) => item.value)
      .slice(0, 4);
    userToPick.push(authorId);
    userToPick = randoSequence(userToPick).map(
      (item: { value: any }) => item.value
    );

    const GuildMembers = (await guild!.members.fetch())
      .filter((m) => userToPick.includes(m.id))
      .map((m) => m);
    GuildMembers.sort(() => Math.random() - 0.5);

    const select =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`whosthat-select_${authorId}_${messageId}`)
          .setPlaceholder(whosThatMsgBtns.placeholder)
          .addOptions(
            GuildMembers.map((m) =>
              new StringSelectMenuOptionBuilder()
                .setLabel(m.displayName)
                .setValue(m.id)
                .setDescription(m.user.username)
            )
          )
      );

    const leaderboardBtn = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`whosthat-leaderboard_${messageId}`)
        .setLabel(whosThatMsgBtns.label)
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🏆")
    );

    await whosThatChannel
      .send({
        embeds: [embed],
        files: [attachment],
        components: [select, leaderboardBtn],
      })
      .then(async (msg) => {
        button.editReply({
          content: eval(whosThatMsgBtns.response),
        });
      });
  }
}
