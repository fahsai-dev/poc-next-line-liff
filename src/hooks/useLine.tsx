import config from '@/config';
import { Liff } from '@line/liff';
import { useEffect, useState } from 'react';

type Status = 'signin';

export const useLine = () => {
  const [liffObject, setLiffObject] = useState<Liff | null>(null);
  const [status, setStatus] = useState<Status>();

  const logout = () => {
    liffObject?.logout();
  };

  const initial = async () => {
    try {
      if (status === 'signin') return;
      const liff = (await import('@line/liff')).default;
      await liff.init({ liffId: config.lineApi.liffId });
      setLiffObject(liff);

      if (liff.isLoggedIn()) {
        setStatus('signin');
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
    liffObject,
    status,
    logout,
  };
};
