import { Request, Response, NextFunction } from 'express';
import { check, ValidationChain, validationResult } from 'express-validator';
import { resolveNaptr } from 'dns';

type ApiFunc = (req: Request, res: Response) => Promise<any>

function routerWrapper(func: ApiFunc): any;
function routerWrapper(validators: [ValidationChain], func: ApiFunc): any;
function routerWrapper(validatorsOrFunc: [ValidationChain] | ApiFunc, optionalFunc?: ApiFunc): any {
  let validators: ValidationChain[] = [];
  let func: ApiFunc;
  if (Array.isArray(validatorsOrFunc)) {
    validators = validatorsOrFunc;
    func = optionalFunc!;
  } else {
    validators = [];
    func = validatorsOrFunc;
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators) {
        await Promise.all(validators.map(async val => {
          await val.run(req);
        }));
        let errors = validationResult(req);
        throw errors;
      }

      let r = await func(req, res);
      res.send({ result: r, ok: true });
    } catch (e) {
      if (!Array.isArray(e)) {
        e = [e];
      }
      res.send({ ok: false, errors: e });
    }
  };
}


export default routerWrapper;
