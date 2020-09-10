import {Request, Response, NextFunction} from 'express';
import routerWrapper from '../util/routerWrapper';
import {EndPoint} from "../models/EndPoint";
import {ScanLog} from "../models/ScanLog";

export const getListScanLogs = routerWrapper(async (req: Request, res: Response) => {
    let {user} = res.locals;
    let endPoints = (await EndPoint.find({user: user}, {_id: 1, url: 1}))
    return (await ScanLog.find({endPoint: {$in: endPoints.map(t => t._id)}}).limit(80)).map(t => ({
        duration: t.duration,
        time: t.createdAt,
        url: (endPoints.find(e => e._id.equals(t.endPoint._id)) || {}).url
    }))
});

