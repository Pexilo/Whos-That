import mongoose from "mongoose";

const guildSchema = new mongoose.Schema({
  id: String,
  checkpoints: {
    type: Array,
    default: [],
  },
  pickableUsers: {
    type: Array,
    default: [],
  },
  sourceChannel: String,
  pickerChannel: String,
  whosThatChannel: String,
  language: {
    type: String,
    default: "en",
  },
});

export default mongoose.model("Guild", guildSchema);
