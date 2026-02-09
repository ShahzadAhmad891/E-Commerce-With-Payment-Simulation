import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  provider: {
    type: String,
    enum: ["JAZZCASH", "EASYPAISA"],
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Wallet", walletSchema);
