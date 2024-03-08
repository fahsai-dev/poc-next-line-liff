import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import config from "@/config";

export default function App({ Component, pageProps }: AppProps) {
  const liffInit = async () => {
    const liff = (await import("@line/liff")).default;

    try {
      await liff.init({ liffId: config.liffId });
    } catch (error) {
      console.error("liff init error", error);
    }
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  };

  useEffect(() => {
    liffInit();
  }, []);

  return <Component {...pageProps} />;
}
