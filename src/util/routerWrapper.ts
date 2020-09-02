import { Request, Response, NextFunction } from 'express';

type ApiFunc = (req: Request, res: Response) => Promise<any>

export default (func: ApiFunc) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let r = await func(req, res);
      res.send({ result: r, ok: true });
    } catch (e) {
      res.send({ ok: false, error: e });
    }
  };
}
