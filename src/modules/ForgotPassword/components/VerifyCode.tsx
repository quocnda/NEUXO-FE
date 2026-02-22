import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import PinInput from 'react-pin-input';

import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import Base3 from '@/components/ui/typography/base3';
import Caption1 from '@/components/ui/typography/caption1';
import H3 from '@/components/ui/typography/h3';
import { VStack } from '@/components/ui/Utilities';
import type { VerifyCodeSchema } from '@/lib/validations/auth';
import { verifyCodeSchema } from '@/lib/validations/auth';

interface IVerifyCodeProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}
const VerifyCode = ({ setStep }: IVerifyCodeProps) => {
  const form = useForm<VerifyCodeSchema>({
    mode: 'onChange',
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      correntPin: '',
    },
  });
  const [errorMessage, setErrorMessage] = useState('');

  const correctCode = '1234';

  const handleContinue: SubmitHandler<VerifyCodeSchema> = () => {
    if (form.watch('correntPin') === correctCode) {
      setStep(3);
    } else {
      setErrorMessage('The code you entered is incorrect.');
    }
  };
  return (
    <>
      <VStack className="max-w-auth col-span-2 mx-auto w-full rounded-lg" spacing={32}>
        <Image src={'/images/auth/logo-small.svg'} width={48} height={48} alt="" />
        <H3 className="text-neutral-70">Resset Password</H3>
        <Base3 className="text-neutral-70">
          We have just sent you a verification code. Please check your inbox to find it.
        </Base3>
        <FormWrapper form={form} onSubmit={handleContinue} className="flex flex-col gap-[20px]">
          <VStack>
            <Controller
              control={form.control}
              name="correntPin"
              render={({ field: { onChange, value } }) => (
                <PinInput
                  focus={true}
                  length={4}
                  secret={false}
                  type="numeric"
                  inputMode="number"
                  style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}
                  inputStyle={{
                    maxWidth: '56px',
                    width: '20%',
                    height: '72px',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    color: errorMessage ? '#FF6A55' : '#1A1D1F',
                    fontSize: '32px',
                    textAlign: 'center',
                    backgroundColor: errorMessage ? '#FFBC9940' : '#efefef',
                  }}
                  onChange={(v) => {
                    onChange(v);
                    if (errorMessage) setErrorMessage('');
                  }}
                  initialValue={value}
                  onComplete={(val, index) => {
                    return val;
                  }}
                  autoSelect={true}
                />
              )}
            />
            {form.formState.errors.correntPin?.message && (
              <div
                style={{
                  marginTop: '5px',
                  fontSize: '0.75rem',
                  lineHeight: '1rem',
                }}
                className="text-error"
                dangerouslySetInnerHTML={{ __html: form.formState.errors.correntPin?.message || 'Error' }}
              />
            )}
            {errorMessage && (
              <div
                style={{
                  marginTop: '5px',
                  fontSize: '0.75rem',
                  lineHeight: '1rem',
                }}
                className="text-error"
                dangerouslySetInnerHTML={{ __html: errorMessage }}
              />
            )}
          </VStack>

          <Button variant="primary" rounded={'md'} type="submit" className="text-[15px] font-bold leading-6">
            Continue
          </Button>
          <Base3 className="text-neutral-70 cursor-pointer">Resend code</Base3>
          <Base3 className="text-shades-0">This site is protected by reCAPTCHA and the Google Privacy Policy.</Base3>
          <Caption1 className="text-shades-0">
            Don’t have an account ? <span className="text-neutral-70 cursor-pointer">Sign up</span>
          </Caption1>
          <div
            onClick={() => setStep(1)}
            className="border-neutral-30 flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 hover:opacity-50"
          >
            <ArrowLeft size={24} color="#6F767E" className="cursor-pointer" />
          </div>
        </FormWrapper>
      </VStack>

      <style jsx global>{`
        .pincode-input-text {
          border: 0 !important;
        }

        .pincode-input-text:hover,
        .pincode-input-text:focus {
          border: 2px solid #9a9fa5 !important;
          background-color: #fff !important;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) !important;
          color: #1a1d1f !important;
        }
      `}</style>
    </>
  );
};

export default VerifyCode;
