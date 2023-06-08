import { Button } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type {
  AttachmentBuilder,
  ButtonInteraction,
  TextChannel,
} from "discord.js";
import { Defer, Embed, FetchGuild } from "@utils/shortcuts";
import GenerateDiscordMessage from "@utils/generate-image";

export class WhosThatMesageListener extends Button {
  constructor(client: ShewenyClient) {
    super(client, [/picker_.*/]);
  }

  async execute(button: ButtonInteraction) {
    if (!(await Defer(button))) return;

    const { guild } = button;
    const guildData = await FetchGuild(guild!);
    if (!guildData)
      return button.editReply({
        content: "An error occured. Could not fetch guild data.",
      });

    const messageId = button.customId.split("_")[1];
    //const authorId = button.customId.split("_")[2];

    const sourceChannel = (await guild!.channels.fetch(
      guildData.sourceChannel
    )) as TextChannel;
    const message = await sourceChannel.messages.fetch(messageId);
    if (!message)
      return button.editReply({
        content: "An error occured. Could not fetch message.",
      });

    const { attachment, content } = await GenerateDiscordMessage(message);

    const whosThatChannel = (await guild!.channels.fetch(
      guildData.whosThatChannel
    )) as TextChannel;
    if (!whosThatChannel)
      return button.editReply({
        content: "An error occured. Could not fetch whosThatChannel.",
      });

    const embed = Embed()
      .setTitle("Whos that?")
      .setAuthor({
        name: guild!.name,
        iconURL: guild!.iconURL()!,
      })
      .setImage(`attachment://${attachment.name}`);
    if (content.length > 150) embed.setDescription(content);

    whosThatChannel.send({
      embeds: [embed],
      files: [attachment],
    });

    if (!guildData) return;
  }
}
