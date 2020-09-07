import {Request, Response, NextFunction} from 'express';
import routerWrapper from '../util/routerWrapper';
import {EndPointDocument, EndPoint} from '../models/EndPoint';

export const postUpsertEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let user = res.locals.user;
    let b = req.body;
    let ep = await EndPoint.findOne({url: b.url, user: user});
    if (!ep) {
        ep = new EndPoint();
        ep.url = b.url;
        ep.user = user;
    }
    ep.watchFields = b.watchFields;
    await ep.save();
});


export const postDeleteEndPoint = routerWrapper(async (req: Request, res: Response) => {
    let url = req.body.url;
    if (!url) {
        throw new Error();
    }

    await EndPoint.deleteOne({url: url, user: res.locals.user});
});
