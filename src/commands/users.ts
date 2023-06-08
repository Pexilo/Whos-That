import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction, GuildMember } from "discord.js";
import SelectUsers from "@utils/select-users";
import { Defer } from "@utils/shortcuts";

export class PickUsers extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "users",
      description: "👤 Select users",
      category: "Misc",
      cooldown: 3,
      clientPermissions: ["EmbedLinks"],
    });
  }

  async execute(interaction: CommandInteraction) {
    if (!(await Defer(interaction))) return;

    const { guild } = interaction;

    const GuildMembers = guild!.members.cache
      .filter((member) => !member.user.bot)
      .map((member) => member);

    await SelectUsers(GuildMembers, interaction);
  }
}
