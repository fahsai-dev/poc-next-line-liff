import { NextApiRequest, NextApiResponse } from 'next';
import { lineClient } from '../lineConnector';
import { TRequestHelperContext } from './helper';

export const getUserProfileHandler = async (req: TRequestHelperContext) => {
  const { data } = await lineClient.post<any>(
    '/login',
    { payload: {} },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return {};
};
