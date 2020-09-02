import mongoose from 'mongoose';
import { UserDocument } from './User';

export type EndPointDocument = mongoose.Document & {
  url: string
  watchFields: [
    {
      path: string,
      value: string
    }
  ]
};

const endPointSchema = new mongoose.Schema({
  url: String,
  watchFields: [
    {
      path: String,
      value: String
    }
  ]
}, { timestamps: true });

export const EndPoint = mongoose.model<EndPointDocument>('EndPoint', endPointSchema);
