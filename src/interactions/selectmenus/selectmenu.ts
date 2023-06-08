import {
  FetchGuild,
  FetchUser,
  UpdateGuild,
  UpdateUser,
} from "@utils/shortcuts";
import { StringSelectMenuInteraction } from "discord.js";
import { SelectMenu } from "sheweny";
import type { ShewenyClient } from "sheweny";

export class UserSelect extends SelectMenu {
  constructor(client: ShewenyClient) {
    super(client, ["users-select"]);
  }

  async execute(selectMenu: StringSelectMenuInteraction) {
    const { values, guild } = selectMenu;

    selectMenu.deferUpdate();

    const guildData = await FetchGuild(guild!);
    values.forEach(async (element) => {
      await FetchUser(element);
    });

    const users = guildData!.pickableUsers;
    users.push(...values);

    await UpdateGuild(guild!, {
      pickableUsers: users,
    });
  }
}
