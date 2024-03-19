import config from '@/config';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const liffInit = async () => {
    const liff = (await import('@line/liff')).default;

    try {
      await liff.init({ liffId: config.lineApi.liffId });
    } catch (error) {
      console.error('liff init error', error);
    }

    if (!liff.isLoggedIn()) {
      await liff.login();
    }
  };

  useEffect(() => {
    liffInit();
  }, []);

  return <Component {...pageProps} />;
}
