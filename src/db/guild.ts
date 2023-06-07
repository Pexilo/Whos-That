const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  id: String,
  checkpoints: {
    type: Array,
    default: [],
  },
  sourceChannel: String,
  pickerChannel: String,
  whosThatChannel: String,
});

module.exports = mongoose.model("Guild", guildSchema);
