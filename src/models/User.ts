import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
  appleId: string,
  username: string,
};

const userSchema = new mongoose.Schema({
  appleId: String,
  username: String
}, { timestamps: true });

export const User = mongoose.model<UserDocument>('User', userSchema);
