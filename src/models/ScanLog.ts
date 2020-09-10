import mongoose, {Schema, Types} from 'mongoose';
import {EndPointDocument} from './EndPoint';
import {ScanBatchDocument} from "./scanBatch";

export interface ScanLogDocument extends mongoose.Document {
    endPoint: EndPointDocument,
    batch: ScanBatchDocument,
    duration: number,
    fields: ScanLogField[],
    createdAt: Date,
    data: string
}

export interface ScanLogField {
    // watchFieldId: Types.ObjectId,
    path: string,
    match: boolean,
    value: string,
    expectValue: string
}

const scanLogFieldSchema = new mongoose.Schema({
    watchFieldId: Schema.Types.ObjectId,
    path: String,
    match: Boolean,
    value: String,
    expectValue: String,
})

const scanLogSchema = new mongoose.Schema({
    endPoint: {type: Schema.Types.ObjectId, ref: 'EndPoint'},
    duration: Number,
    batch: {type: Schema.Types.ObjectId, ref: 'ScanBatch'},
    data: String,
    fields: [scanLogFieldSchema]
}, {timestamps: true});

export const ScanLog = mongoose.model<ScanLogDocument>('ScanLog', scanLogSchema);
