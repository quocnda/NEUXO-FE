/* eslint-disable react-hooks/exhaustive-deps */
import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { signUpWithGoogle } from '@/api/auth';
import { Icons } from '@/assets/icons';
import { AuthLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import Base3 from '@/components/ui/typography/base3';
import H2 from '@/components/ui/typography/h2';
import { Show, VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { useUserStore } from '@/stores';
import { type NextPageWithLayout, ROUTE } from '@/types';

import FormSignUp from './components/FormSignUp';

const SignUpPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { step: stepRouter } = router.query;
  const [step, setStep] = useState<number>(1);
  const { setStore, setIsRole, user, setIsLogin } = useUserStore();

  const { mutate } = useMutation(signUpWithGoogle, {
    onSuccess: (res) => {
      setStore(res.data);
      setIsLogin(true);
      setIsRole(res?.data?.user?.role);
      if (res.data.user.user_name) {
        router.push('/matching-companies');
      } else setStep(2);
    },
    onError: onMutateError,
  });

  const signUpGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      mutate({ token_id: tokenResponse.access_token });
    },
    onError: () => {
      toast.error('Signup unsuccessful. Please try again!');
    },
    flow: 'implicit',
  });

  useEffect(() => {
    if (stepRouter) {
      setStep(Number(stepRouter));
    }
  }, [stepRouter]);

  if (user?.user_name) {
    router.push('/matching-companies');
  }
  return (
    <>
      <Show when={step === 1}>
        <VStack className="max-w-auth col-span-2 mx-auto w-full rounded-lg" spacing={32}>
          <Image src={'/images/auth/logo-small.svg'} width={48} height={48} alt="" />
          <H2 className="text-neutral-70">Sign Up</H2>
          <Base3 className="text-neutral-70">Sign up with Open account</Base3>
          <Button
            variant={'secondary'}
            onClick={() => signUpGoogle()}
            rounded={'md'}
            className="border-neutral-30 flex items-center gap-2 border-2"
          >
            <Icons.google1 size={18} /> <span className="text-[15px] font-bold leading-6">Sign up with Google</span>
          </Button>
          <Link
            href={ROUTE.SIGN_IN}
            className="border-neutral-30 flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 hover:opacity-50"
          >
            <ArrowLeft size={24} color="#6F767E" className="cursor-pointer" />
          </Link>
        </VStack>
      </Show>
      <Show when={step === 2}>
        <FormSignUp />
      </Show>
    </>
  );
};
export default SignUpPage;
SignUpPage.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
