import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/Utilities';
import { ROUTE } from '@/types';

export default function Custom404() {
  const router = useRouter();
  return (
    <VStack align={'center'} spacing={12} className="container mx-auto flex min-h-[50vh] justify-center px-6 py-12">
      <img src="/images/404.png" alt="No Permission" className="mx-auto h-48 w-48" />

      <h1 className="text-main text-center text-2xl font-bold">We can’t find that page</h1>

      <p className="text-main-red text-center">
        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex justify-center space-x-4">
        <Button variant={'outline'} onClick={router.back}>
          Go Back
        </Button>
        <Button onClick={() => router.push(ROUTE.HOME)}>Take Me Home</Button>
      </div>
    </VStack>
  );
}
