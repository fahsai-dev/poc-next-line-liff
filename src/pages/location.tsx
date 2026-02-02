import { getDefaultProps } from '@/utils/ssrHelper';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const defaultProps = await getDefaultProps(ctx);

  return {
    props: {
      ...defaultProps.props,
      data: {},
    },
  };
}

type IServerSideProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Location = ({ data, line }: IServerSideProps) => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if the browser supports the Geolocation API
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback: get the coordinates
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          // Error callback: handle potential errors
          // setError(err.message);
        },
        // Optional: set options for better accuracy/timeout
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.log('Geolocation is not supported by your browser');
      // setError('Geolocation is not supported by your browser');
    }
  }, []);

  if (error) {
    return <p>Error getting location: {error}</p>;
  }

  if (!location) {
    return <p>Fetching location...</p>;
  }

  return (
    <div>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
    </div>
  );
};

export default Location;
