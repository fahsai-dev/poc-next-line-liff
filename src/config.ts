const config = {
  appEnv: process.env.NEXT_PUBLIC_APPLICATION_ENV || 'development',
  lineApi: {
    baseUrl: 'https://api.line.me',
    liffId: process.env.NEXT_PUBLIC_LIFF_ID || '',
    redirectUri: process.env.NEXT_PUBLIC_LINE_REDIRECT_URI || '',
  },
};

export default config;
