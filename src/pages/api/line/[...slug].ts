import { getUserProfileHandler } from '@/libs/handler/line.handler';
import makeHandler from '@/libs/makeHandler';

export default makeHandler([
  {
    method: 'GET',
    path: 'getUserProfile',
    handler: async (req, res) => res.send(await getUserProfileHandler(req)),
  },
]);
