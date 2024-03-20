const config = {
  appEnv: process.env.NEXT_PUBLIC_APPLICATION_ENV || 'development',
  lineApi: {
    baseUrl: 'https://api.line.me',
    liffId: process.env.NEXT_PUBLIC_LIFF_ID || '',
  },
};

export default config;
