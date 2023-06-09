import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  guilds: {
    type: Array,
    default: ["" /* Guild ID */],
  },
  points: {
    type: Number,
    default: 0,
  },
  whosThatResponded: {
    type: Array,
    default: [
      {
        id: "",
        correct: false,
      },
    ],
  },
});

export default mongoose.model("User", userSchema);
