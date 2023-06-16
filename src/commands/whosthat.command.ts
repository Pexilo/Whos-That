import LanguageManager from "@utils/language-manager";
import { SendMessageToPickerChannel } from "@utils/sender";
import { Defer, FetchAndGetLang } from "@utils/shortcuts";
import type { CommandInteraction } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Command } from "sheweny";

export class WhosThatCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "whosthat",
      description: "❔ Send a whosthat message to the picker channel",
      descriptionLocalizations: {
        fr: "❔ Envoie un message whosthat au channel de choix",
      },
      category: "Misc",
      clientPermissions: ["EmbedLinks"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: CommandInteraction) {
    const { guild } = interaction;
    await Defer(interaction);

    const { guildData, lang } = await FetchAndGetLang(guild!);
    const languageManager = new LanguageManager();
    const whosthat = languageManager.getCommandTranslation(lang).whosthat;

    const config = require("src/config.ts");
    if (!guildData?.pickableUsers) {
      return interaction.followUp({
        content: whosthat.noPickableUsers,
        ephemeral: true,
      });
    }

    await SendMessageToPickerChannel(this.client, interaction, guildData, lang);

    return interaction.followUp({
      content: eval(whosthat.response),
    });
  }
}
