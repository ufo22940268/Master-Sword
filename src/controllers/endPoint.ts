import { Request, Response, NextFunction } from 'express';

export const postUpsertEndPoint = async (req: Request, res: Response, next: NextFunction) => {
  if (Array.isArray(req.body)) {
    next();
  }
  // let endPoints = req.body.map(t => {
  // });
  next();
};
