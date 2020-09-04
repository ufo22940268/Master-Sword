import mongoose, {Schema, Types} from 'mongoose';
import {EndPointDocument} from './EndPoint';
import {ScanBatchDocument} from "./scanBatch";

export interface ScanLogDocument extends mongoose.Document {
    endPoint: EndPointDocument,
    batch: ScanBatchDocument,
    duration: number
}

const scanLogSchema = new mongoose.Schema({
    endPoint: {type: Schema.Types.ObjectId, ref: 'EndPoint'},
    duration: Number,
    batch: {type: Schema.Types.ObjectId, ref: 'ScanBatch'}
}, {timestamps: true});

export const ScanLog = mongoose.model<ScanLogDocument>('ScanLog', scanLogSchema);
