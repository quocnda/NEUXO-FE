import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/Utilities';

export default function NoPermission() {
  const router = useRouter();
  return (
    <VStack align={'center'} spacing={12} className="container mx-auto flex min-h-[50vh] justify-center px-6 py-12">
      <img src="/images/no-permission.png" alt="No Permission" className="mx-auto h-48 w-48" />

      <h1 className="text-main text-center text-2xl font-bold">Sorry, you don’t have permission to access this page</h1>

      <p className="text-main-red text-center">Please contact your administrator or try navigating to another page.</p>

      <div className="flex justify-center space-x-4">
        <Button variant={'outline'} onClick={router.back}>
          Go Back
        </Button>
        <Button onClick={() => router.push('/')}>Take Me Home</Button>
      </div>
    </VStack>
  );
}
