const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: [true, "Amount is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    concept: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", transactionSchema);

module.exports = Transaction;
