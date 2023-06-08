import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  points: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("User", userSchema);
