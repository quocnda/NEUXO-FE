import { useRouter } from 'next/router';
import { useState } from 'react';

import { AuthLayout } from '@/components/layouts';
import Caption1 from '@/components/ui/typography/caption1';
import { Show } from '@/components/ui/Utilities';
import { useAuth } from '@/hooks/useAuth';
import type { NextPageWithLayout } from '@/types';

import CreatePassword from './components/CreatePassword';
import EmailReset from './components/EmailReset';
import VerifyCode from './components/VerifyCode';

const ForgotPassword: NextPageWithLayout = () => {
  const { isLoggedIn } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  if (isLoggedIn) {
    router.push('/matching-companies');
  }
  return (
    <>
      <div className="absolute right-6 top-6">
        <Caption1 className="text-shades-0">
          Already a member? <span className="text-neutral-70 cursor-pointer">Sign in</span>
        </Caption1>
      </div>
      <Show when={currentStep === 1}>
        <EmailReset setStep={setCurrentStep} />
      </Show>
      <Show when={currentStep === 2}>
        <VerifyCode setStep={setCurrentStep} />
      </Show>
      <Show when={currentStep === 3}>
        <CreatePassword />
      </Show>
    </>
  );
};
export default ForgotPassword;
ForgotPassword.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
