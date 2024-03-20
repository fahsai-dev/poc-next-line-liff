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
    <section>
      <Head>
        <title>My Profile</title>
      </Head>
      <p>LINE</p>
      <div>
        <p>accessToken: {line?.decodedIDToken?.name}</p>
        <p>accessToken: {line?.accessToken}</p>
        <button onClick={line?.logout} type="button">
          Sign Out
        </button>
      </div>
    </section>
  );
};

export default Home;
