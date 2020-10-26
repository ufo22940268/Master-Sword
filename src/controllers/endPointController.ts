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

async function scanNewEndPoints(user: UserDocument) {
    let scanEndPoints = await ScanLog.distinct('endPoint', {user: user});
    let newEndPoints = await EndPoint.find({user: user, _id: {$nin: scanEndPoints}});
    for (let newEndPoint of newEndPoints) {
        await scanEndPoint(newEndPoint);
    }
}

export const postUpsertEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let user = res.locals.user;
    let b = req.body;
    await upsertEndPoint(user, b);

    await scanNewEndPoints(user)
});


export const postDeleteEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let url = req.body.url;
    if (!url) {
        throw new Error();
    }

    await EndPoint.deleteOne({url: url, user: res.locals.user});
});

interface SyncRequest {
    url: string
}

export const postSyncEndPoints = routerWrapper(async (req: Request, res: Response) => {
    let syncs: SyncRequest[] = req.body
    for (const e of syncs) {
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

async function getWarningInRange(endPointId: string, begin: moment.Moment, end: moment.Moment) {
    return {
        hasTimeout: !!(await ScanLog.findOne({
            endPoint: endPointId,
            createdAt: {$gte: begin, $lte: end},
            duration: {$gt: 1}
        })),
        hasIssue: !!(await ScanLog.findOne({
            endPoint: endPointId,
            createdAt: {$gte: begin, $lte: end},
            errorCount: {$gt: 0}
        })),
    }
}

export const listEndPoints = routerWrapper(async (req: Request, res: Response) => {
    let {user} = res.locals;
    return Promise.all((await EndPoint.find({user})).map(async endPoint => {
        let obj = endPoint.toObject()
        obj = {...obj, ...(await getWarningInRange(endPoint._id, moment().startOf('day'), moment().endOf('day')))}
        return obj
    }));
});

export const getListEndPointForSync = routerWrapper(async (req: Request, res: Response) => {
    let {user} = res.locals;
    return EndPoint.find({user});
});
