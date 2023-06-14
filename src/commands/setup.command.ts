import { fetchChannelCheckpoints } from "@utils/fetch-messages";
import SelectUsers from "@utils/generate-select-users";
import LanguageManager from "@utils/language-manager";
import {
  Defer,
  FetchAndGetLang,
  FetchGuild,
  UpdateGuild,
} from "@utils/shortcuts";
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  TextChannel,
} from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Command } from "sheweny";

export class WhosThatSetupCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "setup",
      description: "🤖 Setup the bot",
      descriptionLocalizations: {
        fr: "🤖 Configure le bot",
      },
      category: "Setup",
      options: [
        {
          type: ApplicationCommandOptionType.Channel,
          name: "target",
          nameLocalizations: {
            fr: "cible",
          },
          description: "🎨 Channel to process",
          descriptionLocalizations: {
            fr: "🎨 Channel à traiter",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Channel,
          name: "picker",
          nameLocalizations: {
            fr: "choix",
          },
          description: "🎨 Channel to pick messages from (keep it private)",
          descriptionLocalizations: {
            fr: "🎨 Channel pour choisir les messages (gardez-le privé)",
          },
          required: true,
        },
        {
          type: ApplicationCommandOptionType.Channel,
          name: "whosthat",
          description: "🎨 Channel where to send the whosthat",
          descriptionLocalizations: {
            fr: "🎨 Channel où envoyer le whosthat",
          },
          required: true,
        },
      ],
      clientPermissions: ["ViewChannel", "ManageChannels"],
      userPermissions: ["ManageGuild"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const { options, guild } = interaction;
    await Defer(interaction);

    let { guildData, lang } = await FetchAndGetLang(guild!);
    const sourceChannel = options.get("target")!.channel as TextChannel;
    const pickerChannel = options.get("picker")!.channel as TextChannel;
    const whosThatChannel = options.get("whosthat")!.channel as TextChannel;

    const languageManager = new LanguageManager();
    const setup = languageManager.getCommandTranslation(lang).setup;

    if (guildData?.checkpoints?.length === 0) {
      const approxMsgs =
        (await fetchChannelCheckpoints(sourceChannel, guild!, interaction)) *
        100;

      interaction.editReply({
        content: eval(setup.processed),
      });
      guildData = await FetchGuild(guild!);
    }

    pickerChannel.send({
      content: eval(setup.done),
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
