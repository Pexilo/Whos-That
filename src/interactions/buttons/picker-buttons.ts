import { Button } from "sheweny";
import type { ShewenyClient } from "sheweny";
import {
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
} from "discord.js";
import { Defer, Embed, FetchGuild } from "@utils/shortcuts";
import GenerateDiscordMessage from "@utils/generate-image";
import { SendMessageToPickerChannel } from "src/sender";
import IGuild from "@models/IGuild";
const { rando, randoSequence } = require("@nastyox/rando.js");

export class WhosThatMesageListener extends Button {
  constructor(client: ShewenyClient) {
    super(client, [/picker_.*/]);
  }

  async execute(button: ButtonInteraction) {
    if (!(await Defer(button))) return;

    const { guild } = button;
    const guildData: IGuild = await FetchGuild(guild!);
    if (!guildData)
      return button.editReply({
        content: "An error occured. Could not fetch guild data.",
      });

    //Refresh button
    if (button.customId === "picker_refresh") {
      SendMessageToPickerChannel(this.client);
      return button.editReply({
        content: "🔁 Picker refreshed.",
      });
    }

    const messageId = button.customId.split("_")[1];
    const authorId = button.customId.split("_")[2];

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

    let userToPick = guildData.pickableUsers.filter(
      (u: string) => u !== authorId
    );

    userToPick = randoSequence(userToPick)
      .map((item: { value: any }) => item.value)
      .slice(0, 4);
    userToPick.push(authorId);
    userToPick = randoSequence(userToPick).map(
      (item: { value: any }) => item.value
    );

    const GuildMembers = guild!.members.cache
      .filter((m) => userToPick.includes(m.id))
      .map((m) => m);
    GuildMembers.sort(() => Math.random() - 0.5);

    const select =
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`whosthat-select_${authorId}_${messageId}`)
          .setPlaceholder("C'est qui ?")
          .addOptions(
            GuildMembers.map((m) =>
              new StringSelectMenuOptionBuilder()
                .setLabel(m.displayName)
                .setValue(m.id)
                .setDescription(m.user.tag)
            )
          )
      );

    await whosThatChannel
      .send({
        embeds: [embed],
        files: [attachment],
        components: [select],
      })
      .then(async (msg) => {
        button.editReply({
          content: `✅ Message sent ${msg.url}`,
        });
      });
  }
}
