import config from '@/config';
import liff, { Liff } from '@line/liff';
import LIFFInspectorPlugin from '@line/liff-inspector';
import { useEffect, useState } from 'react';
export interface LineState {
  liff: Liff | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  accessToken: string | null;
  idToken: string | null; // JWT Token สำหรับ verify
  decodedIDToken: JWTPayload | null; // JWT Token decoded
  profile: Profile | null;
  logout: () => void;
}

interface Profile {
  displayName: string;
  userId: string;
  pictureUrl?: string;
  statusMessage?: string;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [decodedIDToken, setDecodedIDToken] = useState<JWTPayload | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const logout = () => {
    if (!liffObject) {
      console.warn('[LINE LIFF] Cannot logout: LIFF not initialized');
      return;
    }

    try {
      liffObject.logout();
      // Clear all states
      setIsLoggedIn(false);
      setAccessToken(null);
      setIdToken(null);
      setDecodedIDToken(null);
      setProfile(null);
    } catch (error) {
      console.error('[LINE LIFF] Logout error:', error);
    }
  };

  const initializeLiff = async () => {
    try {
      setIsLoading(true);

      const inspectorUrl = process.env.NEXT_PUBLIC_LIFF_INSPECTOR_URL;
      if (inspectorUrl) {
        console.log('[LINE LIFF] Using Inspector Origin:', inspectorUrl);
        liff.use(new LIFFInspectorPlugin({ origin: inspectorUrl }));
      }
      await liff.init({ liffId: config.lineApi.liffId });

      setLiffObject(liff);

      if (liff.isLoggedIn()) {
        const accessToken = liff.getAccessToken();
        const idToken = liff.getIDToken();
        const decodedIDToken = liff.getDecodedIDToken();
        const profile = await liff.getProfile();

        setAccessToken(accessToken);
        setIdToken(idToken);
        setDecodedIDToken(decodedIDToken);
        setProfile(profile);
        setIsLoggedIn(true);

        console.log('[LINE LIFF] Initialized successfully:', {
          userId: profile.userId,
          displayName: profile.displayName,
        });
      } else {
        console.log('[LINE LIFF] User not logged in, redirecting to login...');
        liff.login();
      }
    } catch (err) {
      console.error('[LINE LIFF] Initialization failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeLiff();
  }, []);

  return {
    liff: liffObject,
    isLoggedIn,
    isLoading,
    accessToken,
    idToken,
    decodedIDToken,
    profile,
    logout,
  };
};
