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
        {
          type: ApplicationCommandOptionType.Boolean,
          name: "fetch-again",
          description: "🎨 Fetch the messages from target channel again",
          descriptionLocalizations: {
            fr: "🎨 Récupérer les messages du canal cible à nouveau",
          },
          required: false,
        },
      ],
      clientPermissions: ["ViewChannel", "SendMessages", "EmbedLinks"],
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
    const fetchAgain = options.get("fetch-again")?.value as boolean;

    const languageManager = new LanguageManager();
    const setup = languageManager.getCommandTranslation(lang).setup;
    const config = require("src/config.ts");

    if (guildData?.checkpoints?.length === 0 || fetchAgain) {
      interaction.editReply({
        content: setup.processing,
      });

      let checkpointCount: number | undefined;
      do {
        checkpointCount = await fetchChannelCheckpoints(
          sourceChannel,
          guild!,
          interaction,
          lang
        );
      } while (checkpointCount === undefined);

      const approxMsgs = checkpointCount! * 100;
      pickerChannel.send({
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

    const GuildMembers = (await guild!.members.fetch())
      .filter((member) => !member.user.bot)
      .map((member) => member);

    SelectUsers(GuildMembers, interaction);
  }
}
