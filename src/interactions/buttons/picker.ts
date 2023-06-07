import { Button } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { ButtonInteraction, TextChannel } from "discord.js";
import { Defer, FetchGuild } from "@utils/shortcuts";
import GenerateDiscordMessage from "@utils/generate-image";

export class WhosThatMesageListener extends Button {
  constructor(client: ShewenyClient) {
    super(client, [/picker_.*/]);
  }

  async execute(button: ButtonInteraction) {
    if (!(await Defer(button))) return;

    const { guild } = button;
    const guildData = await FetchGuild(guild!);
    if (!guildData) return button.editReply({ content: "An error occured. Could not fetch guild data." });

    const messageId = button.customId.split("_")[1];
    //const authorId = button.customId.split("_")[2];

    const sourceChannel = await guild!.channels.fetch(guildData.sourceChannel) as TextChannel;
    const message = await sourceChannel.messages.fetch(messageId);
    if (!message) return button.editReply({ content: "An error occured. Could not fetch message." });

    const image = await GenerateDiscordMessage(message);

    const whosThatChannel = await guild!.channels.fetch(guildData.whosThatChannel) as TextChannel;
    if (!whosThatChannel) return button.editReply({ content: "An error occured. Could not fetch whosThatChannel." });

    whosThatChannel.send({
      files: [image]
    });


    if (!guildData) return
  }
};
