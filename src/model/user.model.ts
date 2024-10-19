import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyToken: string;
  verifyTokenExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Invalid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  verifyTokenExpiry: {
    type: Date,
    required: [true, "Verify token expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
});

const UserModel = mongoose.models.users as mongoose.Model<User> || mongoose.model<User>("users", UserSchema);
export default UserModel;