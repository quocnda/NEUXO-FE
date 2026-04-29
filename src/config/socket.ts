import { io } from 'socket.io-client';

import { env } from '@/lib/const';
import { useUserStore } from '@/stores';

const accessToken = useUserStore.getState().access_token;

export const socket = io(env.APP_SOCKET_URL, {
  autoConnect: typeof window !== 'undefined',
  extraHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
  path: '/wss/socket.io',
});

export const SOCKET_LISTENER_EVENT = {
  NOTIFICATION: 'email_opened_notification',
};
