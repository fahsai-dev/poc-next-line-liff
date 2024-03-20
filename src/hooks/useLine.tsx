import config from '@/config';
import { Liff } from '@line/liff';
import { useEffect, useState } from 'react';

export interface LineState {
  liff: Liff | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  decodedIDToken: JWTPayload | null;
  logout: () => void;
}

interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  auth_time?: number;
  nonce?: string;
  amr?: string[];
  name?: string;
  picture?: string;
  email?: string;
}

export const useLine = (): LineState => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [decodedIDToken, setDecodedIDToken] = useState<JWTPayload | null>(null);

  const logout = () => {
    liffObject?.logout();
    window.location.reload();
  };

  const initial = async () => {
    try {
      if (isLoggedIn) return;
      const liff = (await import('@line/liff')).default;
      await liff.init({ liffId: config.lineApi.liffId });
      setLiffObject(liff);

      if (liff.isLoggedIn()) {
        setIsLoggedIn(true);

        var accessToken = await liff.getAccessToken();
        setAccessToken(accessToken);

        var idToken = await liff.getDecodedIDToken();
        setDecodedIDToken(idToken);
      } else {
        liff?.login();
      }
    } catch (error) {
      console.error('@line/liff error', error);
    }
  };

  useEffect(() => {
    initial();
  }, []);

  return {
    liff: liffObject,
    isLoggedIn: isLoggedIn,
    accessToken: accessToken,
    decodedIDToken: decodedIDToken,
    logout: logout,
  };
};
