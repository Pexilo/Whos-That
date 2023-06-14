import { Interaction } from "discord.js";
import type { ShewenyClient } from "sheweny";
import { Event } from "sheweny";

export class ClientMissingPermissionsListener extends Event {
  constructor(client: ShewenyClient) {
    super(client, "clientMissingPermissions", {
      description: "Client missing permissions.",
      emitter: client.managers.commands,
    });
  }

  async execute(interaction: Interaction) {
    // const { guild } = interaction;
    // const { lang } = await this.client.FetchAndGetLang(guild);
    // const { clientMissingPermissions } =
    //   this.client.la[lang].events.permissions;
    // interaction.reply({
    //   content: eval(clientMissingPermissions.reply),
    //   ephemeral: true,
    // });
  }
}
