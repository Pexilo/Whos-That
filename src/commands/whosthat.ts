import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";
import { Defer } from "@utils/shortcuts";
import { SendMessageToPickerChannel } from "src/sender";

export class WhosThat extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "whosthat",
      description: "❔ Who's that person?",
      category: "Misc",
      cooldown: 3,
    });
  }

  async execute(interaction: CommandInteraction) {
    await Defer(interaction);

    SendMessageToPickerChannel(this.client);

    return interaction.editReply({
      content: "✅ Message envoyé !",
    });
  }
}
