import { getDefaultProps } from '@/utils/ssrHelper';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

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

const Home = ({ data, line }: IServerSideProps) => {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Head>
        <title>My Profile</title>
      </Head>

      {line?.isLoading ? (
        <div style={{ textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      ) : line?.isLoggedIn && line?.profile ? (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          {/* Profile Picture */}
          {line.profile.pictureUrl && (
            <img
              src={line.profile.pictureUrl}
              alt={line.profile.displayName}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '16px',
                border: '4px solid #06C755',
              }}
            />
          )}

          {/* Display Name */}
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#333',
            }}
          >
            {line.profile.displayName}
          </h1>

          {/* User ID */}
          <p
            style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '24px',
            }}
          >
            User ID: {line.profile.userId}
          </p>

          {/* Status Message */}
          {line.profile.statusMessage && (
            <p
              style={{
                fontSize: '14px',
                color: '#888',
                fontStyle: 'italic',
                marginBottom: '24px',
                padding: '12px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
              }}
            >
              "{line.profile.statusMessage}"
            </p>
          )}

          {/* Logout Button */}
          <button
            onClick={line.logout}
            type="button"
            style={{
              backgroundColor: '#06C755',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#05B04C')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#06C755')}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <p>Please log in with LINE</p>
        </div>
      )}
    </section>
  );
};

export default Home;
