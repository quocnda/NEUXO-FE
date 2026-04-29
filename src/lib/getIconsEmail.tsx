import { Mail, Mails } from 'lucide-react';

export const getTooltipLabel = (status_mail: string, user_name: string) => {
  if (status_mail === 'Send mail') {
    return 'Send email';
  }

  const names = status_mail?.split(',').map((name) => name.trim());
  const isUserIncluded = names?.includes(user_name);
  const otherNames = names?.filter((name) => name !== user_name);

  if (isUserIncluded && otherNames?.length === 0) {
    return 'This company was reached out by you';
  }

  if (isUserIncluded) {
    return `This company was reached out by you and ${otherNames?.join(', ')}`;
  }

  return `This company was reached out by ${names?.join(', ')}`;
};

export const getIconsEmail = (status_mail: string, user_name: string, opacity: number) => {
  if (status_mail === 'Send mail') {
    return <Mail size={12} color="#6F767E" opacity={opacity} />;
  }

  const names = status_mail?.split(',').map((name) => name.trim());
  const isUserIncluded = names?.includes(user_name);
  const otherNames = names?.filter((name) => name !== user_name);

  if (isUserIncluded && otherNames.length === 0) {
    return <Mail size={12} color="#FFDB59" opacity={opacity} />;
  }

  if (isUserIncluded) {
    return <Mails size={12} color="#FFDB59" opacity={opacity} />;
  }

  return <Mails size={12} color="#6F767E" opacity={opacity} />;
};
