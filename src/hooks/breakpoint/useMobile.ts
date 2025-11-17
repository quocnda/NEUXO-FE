import { useMediaQuery } from '@mantine/hooks';

const useMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

export default useMobile;
