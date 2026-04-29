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
export const bgTrigger = (triger: string) => {
  switch (triger) {
    case 'event':
      return 'bg-secondary-yellow';
    case 'hiring':
      return 'bg-secondary-blue';
    case 'news':
      return 'bg-secondary-purple';
    default:
      return 'bg-neutral-30';
  }
};
