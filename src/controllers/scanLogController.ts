import {Request, Response, NextFunction} from 'express';
import routerWrapper from '../util/routerWrapper';
import {EndPoint} from "../models/EndPoint";
import {ScanLog} from "../models/ScanLog";


export const listScanLogsByEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let {endPointId} = req.params;
    return (await ScanLog.find({endPoint: endPointId}).sort({createdAt: -1}).limit(80)).map(t => ({
        duration: t.duration,
        statusCode: t.statusCode || 500,
        errorCount: Math.floor(Math.random() * 10),
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
        errorCount: Math.floor(Math.random() * 10),
        url: (endPoints.find(e => e._id.equals(t.endPoint._id)) || {}).url,
        id: t.id
    }))
});

export const getScanLog = routerWrapper(async (req: Request, res: Response) => {
    let id = req.params.id
    let log = await ScanLog.findById(id);
    return {
        responseHeader: log.responseHeader || '',
        requestHeader: log.requestHeader || '',
        responseBody: log.data,
        statusCode: log.statusCode || 500,
        time: log.createdAt,
        errorCount: Math.floor(Math.random() * 10),
        duration: log.duration
    }
});


