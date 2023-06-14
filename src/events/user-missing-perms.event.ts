import { Interaction } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Event } from "sheweny";

export class UserMissingPermissionsListener extends Event {
  constructor(client: ShewenyClient) {
    super(client, "userMissingPermissions", {
      description: "User missing permissions.",
      emitter: client.managers.commands,
    });
  }

  async execute(interaction: Interaction) {
    // const { guild } = interaction;
    // const { lang } = await this.client.FetchAndGetLang(guild);
    // const { userMissingPermissions } = this.client.la[lang].events.permissions;
    // interaction.reply({
    //   content: eval(userMissingPermissions.reply),
    //   ephemeral: true,
    // });
  }
}
