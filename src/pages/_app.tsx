import { useLine } from '@/hooks/useLine';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const { liffObject, status } = useLine();

  pageProps.liffObject = liffObject;
  pageProps.status = status;

  return <Component {...pageProps} />;
}
