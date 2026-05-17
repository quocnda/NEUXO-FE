import 'react-quill/dist/quill.snow.css';

import type { DefaultOptions } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { memo } from 'react';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { FCC } from '@/types';

interface Props {}

const queryOption: DefaultOptions['queries'] = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

const queryClient = new QueryClient({ defaultOptions: { queries: queryOption } });

const Provider: FCC<Props> = ({ children }) => {
  const [_queryClient] = React.useState(() => queryClient);

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
        <QueryClientProvider client={_queryClient}>
          <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ThemeProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            padding: '12px',
            color: '#fff',
            background: '#333',
          },
          success: {
            style: {
              background: '#22c55e',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#16a34a',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#b91c1c',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#1e40af',
            },
          },
        }}
      />
    </>
  );
};

export default memo(Provider);
