export const getColorStatus = (status: string) => {
  switch (status) {
    case 'Active':
      return 'text-[#FF9500]';
    case 'Paused':
      return 'text-[#A2845E]';
    case 'Completed':
      return 'text-[#6F767E]';
    default:
      return 'text-[#A2845E]';
  }
};
