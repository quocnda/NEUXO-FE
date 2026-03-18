export const getColorLabel = (category: string) => {
  switch (category) {
    case 'Blockchain':
      return 'bg-secondary-yellow';
    case 'AI':
      return 'bg-secondary-purple';
    case 'General':
      return 'bg-secondary-blue';
    case 'Unity game':
      return 'bg-secondary-green';
    default:
      return 'bg-none';
  }
};
