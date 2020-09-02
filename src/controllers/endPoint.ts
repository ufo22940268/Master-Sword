import { Request, Response, NextFunction } from 'express';
import routerWrapper from '../util/routerWrapper';
import { EndPointDocument, EndPoint } from '../models/EndPoint';

export const postUpsertEndPoint = routerWrapper(async (req: Request, res: Response) => {
  if (!Array.isArray(req.body)) {
    throw new Error('invalid arguments');
  }

  await Promise.all(req.body.map(async b => {
    let ep = new EndPoint();
    ep.url = b.url;
    await ep.save();
  }));
});
