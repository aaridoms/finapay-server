const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User'
    },
    expenses: [{
      type: Schema.Types.ObjectId,
      ref: 'Expense'
    }],
    investments: [{
      type: Schema.Types.ObjectId,
      ref: 'Investment'
    }],
    funds: {
      type: Number,
      required: [true, 'Funds is required.'],
      default: 0
    },
    profilePic: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  },
  { 
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;