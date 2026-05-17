import { zodResolver } from '@hookform/resolvers/zod';
import { useGoogleLogin } from '@react-oauth/google';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Icons } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import { Separator } from '@/components/ui/separator';
import Base3 from '@/components/ui/typography/base3';
import H2 from '@/components/ui/typography/h2';
import { VStack } from '@/components/ui/Utilities';
import type { LoginSchema } from '@/lib/validations/auth';
import { loginSchema } from '@/lib/validations/auth';
import { ROUTE } from '@/types';

import useServices from '../hooks/useServices';

const LoginForm = ({
  setStep,
  setTokenGoogle,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setTokenGoogle: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const router = useRouter();

  const { handleSubmit, isLoading, mutateLoginGoogle } = useServices(setStep);

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await mutateLoginGoogle({ token_id: tokenResponse.access_token });
      setTokenGoogle(tokenResponse.access_token);
    },
    onError: () => {
      toast.error('Login unsuccessful. Please try again!');
    },
    flow: 'implicit',
  });

  return (
    <>
      <VStack className="max-w-auth col-span-2 mx-auto w-full rounded-lg" spacing={32}>
        <Image src={'/images/auth/logo-small.svg'} width={48} height={48} alt="" />
        <H2 className="text-neutral-70">Sign In</H2>
        <Base3 className="text-neutral-70"></Base3>
        <Button
          onClick={() => handleGoogleSignIn()}
          variant={'secondary'}
          rounded={'md'}
          className="border-neutral-30 flex items-center gap-2 border-2"
        >
          <Icons.google1 size={18} /> <span className="text-[15px] font-bold leading-6">Sign in with Google</span>
        </Button>
        <Separator className="h-[2px]" />
        <FormWrapper form={loginForm} onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-3">
              <TextField
                control={loginForm.control}
                name="username"
                placeholder="Your email"
                className="pl-12"
                suffix={<Mail size={23} />}
              />
              <TextField
                control={loginForm.control}
                type="password"
                name="password"
                placeholder="Password"
                className="pl-12"
                suffix={<Icons.lock width={23} />}
              />
            </div>
            <Button
              variant="primary"
              rounded={'md'}
              type="submit"
              className="text-[15px] font-bold leading-6"
              loading={isLoading}
            >
              Continue
            </Button>
            {/* <Link href={'/forgot-password'}>
              <Caption1 className="text-neutral-70 cursor-pointer">Forgot password ?</Caption1>
            </Link> */}

            <Base3 className="text-shades-0">This site is protected by reCAPTCHA and the Google Privacy Policy.</Base3>
            <Base3 className="text-shades-0">
              Don’t have an account ?{' '}
              <span className="text-neutral-70 cursor-pointer" onClick={() => router.push(ROUTE.SIGN_UP)}>
                Sign up
              </span>
            </Base3>
          </div>
        </FormWrapper>
      </VStack>
    </>
  );
};

export default LoginForm;
