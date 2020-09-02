import mongoose from 'mongoose';
import { UserDocument } from './User';

export type EndPointDocument = mongoose.Document & {
  url: string
};

const endPointSchema = new mongoose.Schema({
  url: String,
}, { timestamps: true });

export const EndPoint = mongoose.model<EndPointDocument>('EndPoint', endPointSchema);
