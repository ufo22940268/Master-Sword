import mongoose, {Schema, Types} from 'mongoose';
import {EndPointDocument} from './EndPoint';

export interface ScanBatchDocument extends mongoose.Document {
}

const scanBatchSchema = new mongoose.Schema({}, {timestamps: true});

export const ScanBatch = mongoose.model<ScanBatchDocument>('ScanBatch', scanBatchSchema);
