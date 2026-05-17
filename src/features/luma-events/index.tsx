import React from 'react';

import withAuth from '@/lib/withAuth';

import LumaEventsCard from './components/LumaEventsCard';

const LumaEventsPage = () => <LumaEventsCard />;

export default withAuth(LumaEventsPage);
