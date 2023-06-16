import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  guilds: {
    type: Array,
    default: ["" /* Guild ID */],
  },
  points: {
    type: Array,
    default: [
      {
        guildId: "",
        score: 0,
      },
    ],
  },
  whosThatResponded: {
    type: Array,
    default: [
      {
        messageId: "",
        guildId: "",
        correct: false,
      },
    ],
  },
});

export default mongoose.model("User", userSchema);
