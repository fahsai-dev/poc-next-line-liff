import { useLine } from '@/hooks/useLine';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const line = useLine();
  pageProps.line = line;

  return <Component {...pageProps} />;
}
