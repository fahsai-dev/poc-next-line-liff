import config from '@/config';
import axios from 'axios';

const lineConfig = { timeout: 5000 };

export const lineClient = axios.create({
  baseURL: config.lineApi.baseUrl,
  ...lineConfig,
});
