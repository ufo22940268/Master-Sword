import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  appleId: string,
  email: string,
  username: string,
};

const userSchema = new mongoose.Schema({
  appleId: String,
  email: { type: String, unique: true },
  username: String
}, { timestamps: true });

export const User = mongoose.model<UserDocument>('User', userSchema);
