import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';

const calculateTimeDifference = (createdUtc: string) => {
  const currentUtc = moment.utc();
  const createdUtcMoment = moment.utc(createdUtc);

  const years = currentUtc.diff(createdUtcMoment, 'years');
  createdUtcMoment.add(years, 'years');

  const months = currentUtc.diff(createdUtcMoment, 'months');
  createdUtcMoment.add(months, 'months');

  const weeks = currentUtc.diff(createdUtcMoment, 'weeks');
  createdUtcMoment.add(weeks, 'weeks');

  const days = currentUtc.diff(createdUtcMoment, 'days');
  createdUtcMoment.add(days, 'days');

  let displayTime = '';
  if (years > 0) displayTime += years === 1 ? '1 year ago ' : `${years} years ago `;
  if (months > 0) displayTime += months === 1 ? '1 month ago ' : `${months} months ago `;
  if (weeks > 0) displayTime += weeks === 1 ? '1 week ago ' : `${weeks} weeks ago `;
  if (days > 0) displayTime += days === 1 ? '1 day ago ' : `${days} days ago `;
  displayTime = displayTime.trim();

  if (!displayTime) {
    const hours = currentUtc.diff(createdUtcMoment, 'hours');
    const minutes = currentUtc.diff(createdUtcMoment, 'minutes') % 60;
    if (hours > 0) displayTime = hours === 1 ? '1 hour ago ' : `${hours} hours ago `;
    if (minutes > 0) displayTime += minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    displayTime = displayTime.trim();
  }
  if (!displayTime) displayTime = 'just now';

  return displayTime;
};

const useTimeDifference = (created_utc: string) => {
  const [timeDifference, setTimeDifference] = useState<string | null>(null);

  const calculateCreatedTimeDifference = useCallback(() => {
    setTimeDifference(calculateTimeDifference(created_utc));
  }, [created_utc]);
  useEffect(() => {
    calculateCreatedTimeDifference();
  }, [calculateCreatedTimeDifference]);

  return { timeDifference };
};

export default useTimeDifference;
