import { GetLeaderboard } from "@utils/generate-leaderboard";
import {
  Defer,
  FetchGuild,
  FetchUser,
  FetchUsersFromGuild,
} from "@utils/shortcuts";
import type { CommandInteraction } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Command } from "sheweny";

export class Leaderboard extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "leaderboard",
      description: "🏆 Get the leaderboard of the server.",
    });
  }
  async execute(interaction: CommandInteraction) {
    await Defer(interaction);

    const { guild, user } = interaction;

    const guildData = await FetchGuild(guild!);
    const userData = await FetchUser(user.id, guild!);
    const usersData = await FetchUsersFromGuild(guild!);
    if (!guildData || !userData || !usersData)
      return interaction.editReply({
        content: "An error occured. Could not fetch data.",
      });

    GetLeaderboard(usersData, interaction);
  }
}
