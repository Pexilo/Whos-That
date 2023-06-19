import * as dotenv from "dotenv";
dotenv.config();

export default {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  MONGO_URI: process.env.MONGO_URI,
  SLASH_COMMANDS_IDS: {
    users: "1116505214376226937",
    setup: "1115395521423609877",
    whosthat: "1116741539381641248",
  },
};
