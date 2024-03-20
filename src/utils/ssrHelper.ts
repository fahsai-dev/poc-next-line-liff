import { LineState } from '@/hooks/useLine';
import { GetServerSidePropsContext } from 'next';

export const getDefaultProps = async (
  ctx: GetServerSidePropsContext
): Promise<{ props: { line: LineState | null } }> => {
  return {
    props: {
      line: null,
    },
  };
};
