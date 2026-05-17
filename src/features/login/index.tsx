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
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [googleToken, setGoogleToken] = useState('');
  const router = useRouter();
  if (user?.user_name) {
    router.push('/matching-companies');
  }
  return (
    <>
      <Show when={currentStep === 1}>
        <LoginForm setStep={setCurrentStep} setTokenGoogle={setGoogleToken} />
      </Show>
      <Show when={currentStep === 2}>
        <CheckRedirectSignUp setStep={setCurrentStep} tokenGoogle={googleToken} />
      </Show>
    </>
  );
};
export default LoginPage;
LoginPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
