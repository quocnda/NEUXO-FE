/* eslint-disable react/no-unescaped-entities */
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { signUpWithGoogle } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Base3 from '@/components/ui/typography/base3';
import H2 from '@/components/ui/typography/h2';
import { VStack } from '@/components/ui/Utilities';
import { onMutateError } from '@/lib/common';
import { useUserStore } from '@/stores';

const CheckRedirectSignUp = ({
  setStep,
  tokenGoogle,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  tokenGoogle: string;
}) => {
  const router = useRouter();
  const { setStore, setIsRole, setIsLogin } = useUserStore();
  const { mutate } = useMutation(signUpWithGoogle, {
    onSuccess: (res) => {
      setStore(res.data);
      setIsLogin(true);
      setIsRole(res?.data?.user?.role);
      router.push('/sign-up?step=2');
    },
    onError: onMutateError,
  });

  const signUpGoogle = () => {
    mutate({
      token_id: String(tokenGoogle),
    });
  };

  return (
    <>
      <VStack className="max-w-auth col-span-2 mx-auto w-full rounded-lg" spacing={32}>
        <Image src={'/images/auth/logo-small.svg'} width={48} height={48} alt="" />
        <H2 className="text-neutral-70">Sign In</H2>
        <Separator />
        <p className="text-[16px] font-semibold">
          It looks like you haven't signed up yet. Would you like to create an account?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant={'outline'} onClick={() => setStep(1)}>
            Back to Sign in
          </Button>
          <Button onClick={() => signUpGoogle()}>Continue</Button>
        </div>
        <Base3 className="text-shades-0">This site is protected by reCAPTCHA and the Google Privacy Policy.</Base3>
      </VStack>
    </>
  );
};

export default CheckRedirectSignUp;
