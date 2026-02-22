import { useRouter } from 'next/router';
import { useState } from 'react';

import { AuthLayout } from '@/components/layouts';
import { Show } from '@/components/ui/Utilities';
import { useUserStore } from '@/stores';
import type { NextPageWithLayout } from '@/types';

import CheckRedirectSignUp from './components/CheckRedirectSignUp';
import LoginForm from './components/LoginForm';

const LoginPage: NextPageWithLayout = () => {
  const { user } = useUserStore();
  const [step, setStep] = useState<number>(1);
  const [tokenGoogle, setTokenGoogle] = useState('');
  const router = useRouter();
  if (user?.user_name) {
    router.push('/matching-companies');
  }
  return (
    <>
      <Show when={step === 1}>
        <LoginForm setStep={setStep} setTokenGoogle={setTokenGoogle} />
      </Show>
      <Show when={step === 2}>
        <CheckRedirectSignUp setStep={setStep} tokenGoogle={tokenGoogle} />
      </Show>
    </>
  );
};
export default LoginPage;
LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
