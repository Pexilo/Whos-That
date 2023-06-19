import SelectUsers from "@utils/generate-select-users";
import { Defer } from "@utils/shortcuts";
import type { CommandInteraction } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Command } from "sheweny";

export class PickUsersCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "users",
      nameLocalizations: {
        fr: "utilisateurs",
      },
      description: "👤 Select users of whosthat",
      descriptionLocalizations: {
        fr: "👤 Sélectionne les utilisateurs du whosthat",
      },
      category: "Setup",
      clientPermissions: ["EmbedLinks"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: CommandInteraction) {
    const { guild } = interaction;
    await Defer(interaction);

    const GuildMembers = (await guild!.members.fetch())
      .filter((member) => !member.user.bot)
      .map((member) => member);

    await SelectUsers(GuildMembers, interaction);
  }
}
