import * as dotenv from "dotenv";
dotenv.config();

export default {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  MONGO_URI: process.env.MONGO_URI,
  SLASH_COMMANDS_IDS: {
    users: "1118657612783812622",
    setup: "1118657612783812621",
    whosthat: "1119193500429336669",
  },
};
