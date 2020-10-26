import mongoose, {Schema, Types} from 'mongoose';
import {EndPointDocument} from './endPoint';
import {ScanBatchDocument} from "./scanBatch";
import {UserDocument} from "./user";

export interface ScanLogDocument extends mongoose.Document {
    endPoint: EndPointDocument,
    batch: ScanBatchDocument,
    //Always use seconds as unit.
    duration: number,
    fields: ScanLogField[],
    createdAt: Date,
    data: string
    requestHeader: string,
    responseHeader: string,
    statusCode: number,
    errorCount: number,
    notified: boolean,
    timings: {
        wait?: Number,
        dns?: Number,
        tcp?: Number,
        request?: Number,
        firstByte?: Number,
        download?: Number,
        total?: Number
    }
    hasIssue: boolean
    user: UserDocument
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
    endPoint: {type: Schema.Types.ObjectId, ref: 'EndPoint', index: true},

    //Always use seconds as unit. Keep the unit the same as iOS.
    duration: Number,

    batch: {type: Schema.Types.ObjectId, ref: 'ScanBatch'},
    requestHeader: String,
    responseHeader: String,
    statusCode: Number,
    errorCount: Number,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    data: String,
    notified: Boolean,
    fields: [scanLogFieldSchema],
    timings: {
        wait: Number,
        dns: Number,
        tcp: Number,
        request: Number,
        firstByte: Number,
        download: Number,
        total: Number
    }
}, {timestamps: true});

scanLogSchema.index({createdAt: 1})

scanLogSchema.virtual("hasIssue").get(function () {
    return this.fields?.some((f: any) => !f.match);
});


export const ScanLog = mongoose.model<ScanLogDocument>('ScanLog', scanLogSchema);
