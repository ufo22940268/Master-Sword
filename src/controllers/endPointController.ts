import { Request, Response, NextFunction } from 'express';
import routerWrapper from '../util/routerWrapper';
import { EndPointDocument, EndPoint } from '../models/EndPoint';

export const postUpsertEndPoint = routerWrapper(async (req: Request, res: Response) => {
  let b = req.body
  let ep = await EndPoint.findOne({ url: b.url });
  if (!ep) {
    ep = new EndPoint();
    ep.url = b.url;
  }
  ep.watchFields = b.watchFields;
  await ep.save();
});
