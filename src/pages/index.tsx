import { useLine } from '@/hooks/useLine';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const { logout } = useLine();

  // const liffGetProfile = async () => {
  //   const liff = (await import('@line/liff')).default;
  //   await liff.ready;
  //   const profile = await liff.getProfile();
  //   setProfile(profile);
  // };

  // useEffect(() => {
  //   liffGetProfile();
  // }, [profile.userId]);

  return (
    <section>
      <Head>
        <title>My Profile2</title>
      </Head>
      <h1>Profile</h1>
      <div>
        <button onClick={logout} type="button">
          Sign Out
        </button>
      </div>
    </section>
  );
}
