import { GetLeaderboard } from "@utils/generate-leaderboard";
import { Defer, FetchUsersFromGuild } from "@utils/shortcuts";
import type { CommandInteraction } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Command } from "sheweny";

export class LeaderboardCommand extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "leaderboard",
      nameLocalizations: {
        fr: "classement",
      },
      description: "🏆 Get the leaderboard of the server.",
      descriptionLocalizations: {
        fr: "🏆 Récupère le classement du serveur.",
      },
      category: "Misc",
      clientPermissions: ["ViewChannel", "EmbedLinks"],
    });
  }
  async execute(interaction: CommandInteraction) {
    const { guild } = interaction;
    await Defer(interaction);

    const usersData = await FetchUsersFromGuild(guild!);
    GetLeaderboard(usersData, interaction);
  }
}
