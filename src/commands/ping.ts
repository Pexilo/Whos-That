import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Defer, Embed } from "@utils/shortcuts";
import type { CommandInteraction } from "discord.js";

export class Ping extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "ping",
      description: "🏓 Show the bot latency",
      category: "Misc",
      cooldown: 3,
      clientPermissions: ["EmbedLinks"],
    });
  }

  async execute(interaction: CommandInteraction) {
    let start = Date.now();
    await Defer(interaction);
    const djsApiLantency = Date.now() - 1000 - start;

    await interaction.followUp({
      embeds: [
        Embed()
          .setTitle("🏓 Pong!")
          .addFields(
            {
              name: "🤖 Bot Latency",
              value: `${"```"}${djsApiLantency}ms${"```"}`,
            },
            {
              name: "📡 Discord API",
              value: `${"```"}${interaction.client.ws.ping + 1}ms${"```"}`,
              inline: true,
            }
          ),
      ],
    });
  }
}
