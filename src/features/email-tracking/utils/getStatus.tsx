import TextBody1 from '@/components/ui/typography/TextBody1';

export const colorStatus = (status: string) => {
  switch (status) {
    case 'ERROR':
      return (
        <TextBody1 className="bg-main-red flex w-fit items-center gap-1 rounded-[6px] px-2 py-1 text-center text-xs font-medium text-white">
          Error
        </TextBody1>
      );
    case 'SENT':
      return (
        <TextBody1 className="bg-main flex w-fit items-center gap-1 rounded-[6px] px-2 py-1 text-center text-xs font-medium text-white">
          Sent
        </TextBody1>
      );
    case 'SEEN':
      return (
        <TextBody1 className="bg-main-purple flex w-fit items-center gap-1 rounded-[6px] px-2 py-1 text-center text-xs text-white">
          Seen
        </TextBody1>
      );
    case 'REPLIED':
      return (
        <TextBody1 className="bg-main-green flex w-fit items-center gap-1 rounded-[6px] px-2 py-1 text-center text-xs text-white">
          Replied
        </TextBody1>
      );
    case 'UNREACHED':
      return (
        <TextBody1 className="flex w-fit items-center gap-1 rounded-[6px] bg-[#BCC1CA] px-2 py-1 text-center text-xs text-white">
          Unreached
        </TextBody1>
      );
    case 'Upcoming':
      return (
        <TextBody1 className="flex w-fit items-center gap-1 rounded-[6px] bg-[#00C7BE] px-2 py-1 text-center text-xs text-white">
          Upcoming
        </TextBody1>
      );
    case 'Overdue':
      return (
        <TextBody1 className="flex w-fit items-center gap-1 rounded-[6px] bg-[#FF3B30] px-2 py-1 text-center text-xs text-white">
          Overdue
        </TextBody1>
      );
    case 'Focused':
      return (
        <TextBody1 className="flex w-fit items-center gap-1 rounded-[6px] bg-[#FFCC00] px-2 py-1 text-center text-xs text-white">
          Focused
        </TextBody1>
      );
    default:
      return <TextBody1>TBD</TextBody1>;
  }
};
