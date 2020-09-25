import {Request, Response} from 'express';
import routerWrapper from '../util/routerWrapper';
import {EndPoint} from '../models/endPoint';
import {UserDocument} from "../models/user";
import {scanEndPoint} from "../tasks/scanEndPointTask";
import {ScanLog} from "../models/scanLog";
import moment from "moment";

let upsertEndPoint = async function (user: UserDocument, body: any) {
    let ep = await EndPoint.findOne({url: body.url, user: user});
    if (!ep) {
        ep = new EndPoint();
        ep.url = body.url;
        ep.user = user;
    }
    ep.watchFields = body.watchFields;
    await ep.save();
};

export const postUpsertEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let user = res.locals.user;
    let b = req.body;
    await upsertEndPoint(user, b);
});


export const postDeleteEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let url = req.body.url;
    if (!url) {
        throw new Error();
    }

    await EndPoint.deleteOne({url: url, user: res.locals.user});
});

export const postSyncEndPoints = routerWrapper(async (req: Request, res: Response) => {
    for (const e of req.body) {
        await upsertEndPoint(res.locals.user, e);
    }
});

export const postScanEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let {user} = res.locals;
    let endPoints = await EndPoint.find({user})
    if (await ScanLog.findOne({
        endPoint: {$in: endPoints.map(t => t.id)},
        createdAt: {$gt: moment().subtract(1, 'week').toDate()}
    })) {
        return;
    }

    for (let endPoint of endPoints) {
        await scanEndPoint(endPoint)
    }
});

export const getListEndPointForSync = routerWrapper(async (req: Request, res: Response) => {
    let {user} = res.locals;
    return EndPoint.find({user});
});
