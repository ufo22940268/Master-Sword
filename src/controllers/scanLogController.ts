import {Request, Response} from 'express';
import routerWrapper from '../util/routerWrapper';
import {EndPoint} from "../models/endPoint";
import {ScanLog} from "../models/scanLog";


export const listScanLogsByEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let {endPointId} = req.params;
    return (await ScanLog.find({endPoint: endPointId}).sort({createdAt: -1}).limit(80)).map(t => ({
        duration: t.duration,
        statusCode: t.statusCode || 500,
        errorCount: t.errorCount,
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
        errorCount: t.errorCount,
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
        errorCount: log.errorCount,
        duration: log.duration,
        fields: log.fields.map(t => ({
            path: t.path,
            value: t.value,
            watchValue: t.expectValue
        }))
    }
});


