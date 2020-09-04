import mongoose, {Schema, Types} from 'mongoose';
import {EndPointDocument} from './EndPoint';

export interface ScanLogDocument extends mongoose.Document {
    endPoint: EndPointDocument,
    duration: number
}

const scanLogSchema = new mongoose.Schema({
    endPoint: {type: Schema.Types.ObjectId, ref: 'EndPoint'}, duration: Number
}, {timestamps: true});

export const ScanLog = mongoose.model<ScanLogDocument>('ScanLog', scanLogSchema);
