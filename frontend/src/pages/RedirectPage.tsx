import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useLogInMutation } from '@/hooks/api/useLoginMutation';

const RedirectPage = () => {
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code');

  if (!code) {
    throw new Error('로그인/회원가입에 실패했습니다.');
  }

  const mutateLogIn = useLogInMutation();

  useEffect(() => {
    console.log('code', code);
    mutateLogIn.mutate(code);
  }, []);

  return <div>로그인 중입니다.</div>;
};

export default RedirectPage;
