import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Defer, FetchGuild, UpdateGuild } from "@utils/shortcuts";
import { fetchChannelCheckpoints } from "@utils/init-channel";
import {
  CommandInteraction,
  ApplicationCommandOptionType,
  TextChannel,
} from "discord.js";
import SelectUsers from "@utils/select-users";

export class WhosThatSetupCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "setup",
      description: "🤖 Setup the bot",
      category: "Misc",
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "source",
          description: "Channel to process",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Channel,
          name: "picker",
          description: "Channel to choose wich message to send",
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Channel,
          name: "channel",
          description: "Channel to send the whos that message",
          required: true,
        },
      ],
    });
  }
  async execute(interaction: CommandInteraction) {
    if (!(await Defer(interaction))) return;
    const { options, guild } = interaction;

    let guildData = await FetchGuild(guild!);
    const sourceChannel = options.get("source")!.channel as TextChannel;
    const pickerChannel = options.get("picker")!.channel as TextChannel;
    const whosThatChannel = options.get("channel")!.channel as TextChannel;

    if (guildData?.checkpoints?.length === 0) {
      const approxMsgs =
        (await fetchChannelCheckpoints(sourceChannel, guild!, interaction)) *
        100;
      interaction.editReply({
        content: `✅ Approximately \`${approxMsgs}\` messages were processed.`,
      });
      guildData = await FetchGuild(guild!);
    }

    pickerChannel.send({
      content: `🤖 **WhosThat** is now setup to send messages in <#${whosThatChannel.id}>.\n\n> <#${pickerChannel.id}> will let you pick between 10 messages everyday.\n> Make sure to select the best message to send!`,
    });

    await UpdateGuild(guild!, {
      sourceChannel: sourceChannel.id,
      pickerChannel: pickerChannel.id,
      whosThatChannel: whosThatChannel.id,
    });

    const GuildMembers = guild!.members.cache
      .filter((member) => !member.user.bot)
      .map((member) => member);

    SelectUsers(GuildMembers, interaction);
  }
}
