import IUser from "@models/IUser";
import { GetLeaderboard } from "@utils/generate-leaderboard";
import { Defer, FetchUsersFromGuild } from "@utils/shortcuts";
import { type ButtonInteraction } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Button } from "sheweny";

export class LeaderboardButtons extends Button {
  constructor(client: ShewenyClient) {
    super(client, [/whosthat-leaderboard_.*/]);
  }

  async execute(button: ButtonInteraction) {
    const { guild } = button;
    await Defer(button);

    const usersData: IUser[] = await FetchUsersFromGuild(guild!);
    const messageId = button.customId.split("_")[1];

    GetLeaderboard(usersData, button, messageId);
  }
}
