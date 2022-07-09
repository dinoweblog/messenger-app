const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: { type: Array },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("conversation", conversationSchema);
