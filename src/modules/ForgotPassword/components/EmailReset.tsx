import { ArrowLeft, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Base3 from '@/components/ui/typography/base3';
import Caption1 from '@/components/ui/typography/caption1';
import H3 from '@/components/ui/typography/h3';
import { VStack } from '@/components/ui/Utilities';
import { ROUTE } from '@/types';

interface IEmailResetProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
const EmailReset = ({ setStep }: IEmailResetProps) => {
  const handleContinue = () => {
    setStep(2);
  };
  return (
    <>
      <VStack className="max-w-auth col-span-2 mx-auto w-full rounded-lg" spacing={32}>
        <Image src={'/images/auth/logo-small.svg'} width={48} height={48} alt="" />
        <H3 className="text-neutral-70">Resset Password</H3>
        <div className="flex flex-col gap-[20px]">
          <Input placeholder="Your email" className="pl-12" suffix={<Mail color="#6F767E" size={23} />} />

          <Button variant="primary" rounded={'md'} onClick={handleContinue} className="text-[15px] font-bold leading-6">
            Continue
          </Button>

          <Base3 className="text-shades-0">This site is protected by reCAPTCHA and the Google Privacy Policy.</Base3>
          <Caption1 className="text-shades-0">
            Don’t have an account ? <span className="text-neutral-70 cursor-pointer">Sign up</span>
          </Caption1>
          <Link
            href={ROUTE.SIGN_IN}
            className="border-neutral-30 flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 hover:opacity-50"
          >
            <ArrowLeft size={24} color="#6F767E" className="cursor-pointer" />
          </Link>
        </div>
      </VStack>
    </>
  );
};

export default EmailReset;
