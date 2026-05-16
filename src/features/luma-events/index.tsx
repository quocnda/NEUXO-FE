import React from 'react';

import withAuth from '@/lib/withAuth';

import LumaEventsCard from './components/LumaEventsCard';

const LumaEvents = () => {
  return <LumaEventsCard />;
};

export default withAuth(LumaEvents);
