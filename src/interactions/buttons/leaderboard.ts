import { Button } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { type ButtonInteraction } from "discord.js";
import {
  Defer,
  FetchGuild,
  FetchUser,
  FetchUsersFromGuild,
} from "@utils/shortcuts";
import { GetLeaderboard } from "@utils/generate-leaderboard";

export class Leaderboard extends Button {
  constructor(client: ShewenyClient) {
    super(client, [/whosthat-leaderboard_.*/]);
  }

  async execute(button: ButtonInteraction) {
    await Defer(button);

    const { guild, user } = button;

    const guildData = await FetchGuild(guild!);
    const userData = await FetchUser(user.id, guild!);
    const usersData = await FetchUsersFromGuild(guild!);
    if (!guildData || !userData || !usersData)
      return button.editReply({
        content: "An error occured. Could not fetch data.",
      });

    const messageId = button.customId.split("_")[1];

    GetLeaderboard(usersData, button, messageId);
  }
}
