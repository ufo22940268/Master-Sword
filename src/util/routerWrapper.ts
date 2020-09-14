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
      if (validators.length) {
        await Promise.all(validators.map(async val => {
          await val.run(req);
        }));
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw errors;
        }
      }

      let r = await func(req, res);
      res.send({ result: r, ok: true });
    } catch (e) {
      console.error(e)
      res.status(500).send({ ok: false, error: e.stack });
    }
  };
}


export default routerWrapper;
