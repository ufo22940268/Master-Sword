import {Request, Response, NextFunction} from 'express';
import routerWrapper from '../util/routerWrapper';
import {EndPoint} from "../models/EndPoint";
import {ScanLog} from "../models/ScanLog";


export const listScanLogsByEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let {endPointId} = req.params;
    return (await ScanLog.find({endPoint: endPointId}).sort({createdAt: -1}).limit(80)).map(t => ({
        duration: t.duration,
        time: t.createdAt,
        id: t.id
    }))
});


export const listScanLogs = routerWrapper(async (req: Request, res: Response) => {
    let {user} = res.locals;
    let endPoints = (await EndPoint.find({user: user}, {_id: 1, url: 1}))
    return (await ScanLog.find({endPoint: {$in: endPoints.map(t => t._id)}}).sort({createdAt: -1}).limit(80)).map(t => ({
        duration: t.duration,
        time: t.createdAt,
        endPointId: t.endPoint.toString(),
        url: (endPoints.find(e => e._id.equals(t.endPoint._id)) || {}).url,
        id: ''
    }))
});

export const getScanLog = routerWrapper(async (req: Request, res: Response) => {
    let id = req.params.id
    let log = await ScanLog.findById(id);
    return {
        'responseHeader': log.responseHeader.trim(),
        'requestHeader': log.requestHeader.trim(),
        'responseBody': log.data,
        'statusCode': log.statusCode,
        'time': log.createdAt,
        'duration': log.duration
    }
});


