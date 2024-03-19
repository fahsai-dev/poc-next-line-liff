// import logHandler from '@/logger/logHandler';
// import { getLocale } from '@/utils/locales';
import { pickPropertiesByKeys } from '@/utils/object';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
// import { randomUUID } from 'crypto';
import { GetServerSidePropsContext, NextApiRequest } from 'next';

export type TRequestHelperContext<Payload = {}> = NextApiRequest | (GetServerSidePropsContext & { body?: Payload });

const isServerSidePropsContext = (ctx: NextApiRequest | GetServerSidePropsContext) =>
  (<GetServerSidePropsContext>ctx).req !== undefined;

export const requestHelper = (instance: AxiosInstance) => (ctx: TRequestHelperContext) => {
  const req = isServerSidePropsContext(ctx)
    ? { ...(<GetServerSidePropsContext>ctx), ...(<GetServerSidePropsContext>ctx).req, body: ctx.body }
    : ctx;

  // const locale = getLocale({ req });

  const headers = pickPropertiesByKeys(
    ['Content-Type', 'Authorization', 'x-correlation-id', 'x-request-id', 'language'],
    {
      ...(req as any)?.headers,
    }
  );

  const _config: AxiosRequestConfig<any> = {
    headers: {
      ...headers,
      // language: (req as any)?.headers?.['language'] || locale.toLocaleUpperCase(),
      // 'x-correlation-id': (req as any)?.headers?.['x-correlation-id'] || randomUUID(),
    },
    params: req.query,
  };

  return {
    get<T>(url: string) {
      // logHandler.call({
      //   consumer: 'server',
      //   path: url,
      //   body: { ...req, headers: _config.headers },
      // });

      return instance.get<T>(url, _config);
    },
    post<T>(url: string, config?: AxiosRequestConfig<any>) {
      // logHandler.call({
      //   consumer: 'server',
      //   path: url,
      //   body: { ...req, headers: _config.headers },
      // });

      return instance.post<T>(url, req.body, { ..._config, ...config });
    },
  };
};
