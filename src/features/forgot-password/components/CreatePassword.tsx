import { Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { Icons } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { TextField } from '@/components/ui/FormField';
import Base3 from '@/components/ui/typography/base3';
import Caption4 from '@/components/ui/typography/caption4';
import H3 from '@/components/ui/typography/h3';
import { HStack, VStack } from '@/components/ui/Utilities';
import { cn } from '@/lib/utils';
import { ROUTE } from '@/types';

interface FormValueCreatePassword {
  password: string;
  confirmPassword: string;
}

const CRITERION_ICON_CLASS =
  'border-neutral-40 text-neutral-40 flex items-center justify-center rounded-full border-[1.5px] h-[14px] w-[14px]';
const CRITERION_ICON_VALID_CLASS = 'bg-main-green border-0 text-white';

const PasswordCriteria = ({ isValid, label }: { isValid: boolean; label: string }) => (
  <HStack spacing={8}>
    <div
      className={cn(CRITERION_ICON_CLASS, isValid && CRITERION_ICON_VALID_CLASS)}
      style={{ lineHeight: 'normal' }}
    >
      <Check size={10} strokeWidth={3} />
    </div>
    <Caption4 className={isValid ? 'text-main-green' : 'text-neutral-40'}>{label}</Caption4>
  </HStack>
);

const validatePassword = (password: string) => {
  return {
    isMinLength: password.length >= 8 && !/\s/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
};

const validatePasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return Boolean(password && confirmPassword && password === confirmPassword);
};

const CreatePassword = () => {
  const form = useForm<FormValueCreatePassword>({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const router = useRouter();
  const passwordValue = form.watch('password');
  const confirmPasswordValue = form.watch('confirmPassword');

  const { isMinLength, hasUppercase, hasNumber } = validatePassword(passwordValue);
  const isPasswordMatch = validatePasswordsMatch(passwordValue, confirmPasswordValue);
  const isPasswordValid = isMinLength && hasUppercase && hasNumber && isPasswordMatch;

  const handleContinue: SubmitHandler<FormValueCreatePassword> = () => {
    router.push(ROUTE.SIGN_IN);
  };

  return (
    <VStack className="max-w-auth col-span-2 mx-auto w-full rounded-lg" spacing={32}>
      <Image src="/images/auth/logo-small.svg" width={48} height={48} alt="" />
      <H3 className="text-neutral-70">Create Password</H3>

      <FormWrapper form={form} onSubmit={handleContinue} className="flex flex-col gap-[20px]">
        <TextField
          control={form.control}
          type="password"
          name="password"
          placeholder="Password"
          className="pl-12"
          suffix={<Icons.lock color="#6F767E" width={23} />}
        />
        <TextField
          control={form.control}
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          className="pl-12"
          suffix={<Icons.lock color="#6F767E" width={23} />}
        />

        <VStack spacing={8}>
          <PasswordCriteria isValid={isMinLength} label="At least 8 characters and no spaces" />
          <PasswordCriteria isValid={hasUppercase} label="Contain uppercase characters (A-Z)" />
          <PasswordCriteria isValid={hasNumber} label="Must contain number (0-9)" />
          <PasswordCriteria isValid={isPasswordMatch} label="Password matches" />
        </VStack>

        <Button
          disabled={!isPasswordValid}
          variant="primary"
          rounded="md"
          type="submit"
          className="text-[15px] font-bold leading-6"
        >
          Create
        </Button>

        <Base3 className="text-shades-0">This site is protected by reCAPTCHA and the Google Privacy Policy.</Base3>
      </FormWrapper>
    </VStack>
  );
};

export default CreatePassword;
