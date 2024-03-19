import { isObjEmpty } from '@/utils/object';
import { NextApiHandler } from 'next';
import { METHOD_NOT_ALLOWED, UNKNOWN_ERROR } from './constants/errors';

type Error = {
  code: string;
  message: string;
  status: number;
  data?: any;
};

type HandlerOption = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path?: string;
  handler: NextApiHandler;
};

const makeHandler: (_handlerOptions: HandlerOption[]) => NextApiHandler<Error> = (handlerOptions) => {
  return async (req, res) => {
    const { slug } = req.query;

    const handlerOption = handlerOptions.find((handlerOption) => {
      if (slug?.length) {
        return handlerOption.path === slug[0] && handlerOption.method === req.method;
      }

      return handlerOption.method === req.method;
    });

    if (!handlerOption) {
      res.setHeader(
        'Allow',
        handlerOptions.map((handlerOption) => handlerOption.method)
      );

      res.status(METHOD_NOT_ALLOWED.status).json(METHOD_NOT_ALLOWED);
      return;
    }

    try {
      await handlerOption.handler(req, res);
    } catch (error: any) {
      res
        .status(error?.response?.status || UNKNOWN_ERROR.status)
        .json(isObjEmpty(error?.response) ? UNKNOWN_ERROR : error?.response);
    }
  };
};

export default makeHandler;
