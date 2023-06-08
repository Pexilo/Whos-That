import { ShewenyClient } from "sheweny";
import { IntentsBitField, PermissionFlagsBits, Partials } from "discord.js";
const { mongoose } = require("mongoose");
import config from "./config";
import GenerateDiscordMessage from "@utils/generate-image";

interface Error {
  reason?: string;
}
const client = new ShewenyClient({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildPresences,
  ],
  partials: [
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      applicationPermissions: true,
      default: {
        type: "SLASH_COMMAND",
        channel: "GUILD",
        cooldown: 3,
        userPermissions: [PermissionFlagsBits.UseApplicationCommands],
      },
    },
    events: {
      directory: "./events",
      default: {
        once: false,
      },
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
  },
  mode: "development", // Change to production for production bot
});

mongoose
  .connect(config.MONGO_URI, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => console.log("✅ MongoDB"))
  .catch((err: Error) => console.error("❌ MongoDB\n", err.reason));

import { SendMessageToPickerChannel } from "./sender";
SendMessageToPickerChannel(client);

client.login(config.DISCORD_TOKEN);
