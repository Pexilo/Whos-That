import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  guilds: {
    type: Array,
    default: ["" /* Guild ID */],
  },
  points: {
    type: Array,
  },
  whosThatResponded: {
    type: Array,
  },
});

export default mongoose.model("User", userSchema);
