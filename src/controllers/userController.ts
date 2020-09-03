import { Request, Response } from 'express';
import routerWrapper from '../util/routerWrapper';
import { User } from '../models/User';

export const postLogin = routerWrapper(async (req: Request, res: Response) => {
  let { appleUserId, username } = req.body;
  return User.findOneAndUpdate({ appleId: appleUserId }, { username: username }, { new: true, upsert: true });
});
