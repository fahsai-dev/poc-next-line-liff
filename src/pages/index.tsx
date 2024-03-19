import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [profile, setProfile] = useState<any>({});

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
        <title>My Profile</title>
      </Head>
      <h1>Profile</h1>
      <div>
        {/* {profile.pictureUrl && (
          <Image
            src={profile.pictureUrl}
            alt={profile.displayName}
            width={500}
            height={500}
          />
        )} */}
        {/* <div>Name: {profile.displayName}</div> */}
      </div>
    </section>
  );
}
