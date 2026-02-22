import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { ROUTE } from '@/types';

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        await router.replace(ROUTE.MATCHING_COMPANIES);
      } catch (error) {
        console.error('Error redirecting:', error);
      }
    };

    redirect();
  }, [router]);

  return <></>;
};

export default LandingPage;
