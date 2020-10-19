import mongoose, {Schema} from 'mongoose';
import {UserDocument} from "./user";

export type EndPointDocument = mongoose.Document & {
    url: string,
    user: UserDocument,
    watchFields: [
        {
            path: string,
            value: string
        }
    ]
};

const endPointSchema = new mongoose.Schema({
    url: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    watchFields: [
        {
            path: String,
            value: String
        }
    ]
}, {timestamps: true});

endPointSchema.index({user: 1, url: 1}, {unique: true})
endPointSchema.index({createdAt: 1})

export const EndPoint = mongoose.model<EndPointDocument>('EndPoint', endPointSchema);
