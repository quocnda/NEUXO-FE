import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { loginRequest, loginWithGoogle } from '@/api/auth';
import { onMutateError } from '@/lib/common';
import type { LoginSchema } from '@/lib/validations/auth';
import { useUserStore } from '@/stores';

const useServices = (setStep?: React.Dispatch<React.SetStateAction<number>>) => {
  const router = useRouter();
  const { setIsLogin, setStore, setIsRole } = useUserStore();

  const { mutate: mutateLogin, isLoading } = useMutation(loginRequest, {
    onSuccess: (data) => {
      setStore(data.data);
      setIsLogin(true);
      setIsRole(data?.data?.user?.role);
      toast.success('Login successfully!');
      router.push('/matching-companies');
    },
    onError: onMutateError,
  });

  const { mutate: mutateLoginGoogle } = useMutation(loginWithGoogle, {
    onSuccess: (data) => {
      setStore(data.data);
      setIsLogin(true);
      setIsRole(data?.data?.user?.role);
      if (data?.data?.user?.user_name) {
        toast.success('Login successfully!');
        router.push('/matching-companies');
      } else setStep?.(2);
    },
    onError: (err: any) => {
      if (err?.message === 'User not found') {
        setStep?.(2);
      } else toast.error(err?.message);
    },
  });

  const handleSubmit: SubmitHandler<LoginSchema> = (formData) => {
    mutateLogin({
      username: formData.username,
      password: formData.password,
    });
  };
  return { handleSubmit, isLoading, mutateLoginGoogle };
};

export default useServices;
