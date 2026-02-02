import { Download } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

type DownloadCSVButtonProps = {
  handleDownloadCSV: (params?: any) => void;
  className?: string;
  iconClassName?: string;
};
const DownloadCSVButton = ({ handleDownloadCSV, className, iconClassName }: DownloadCSVButtonProps) => {
  const [isLoadingExported, setIsLoadingExported] = useState<boolean>(false);

  const handleExportCsv = async () => {
    setIsLoadingExported(true);
    try {
      await handleDownloadCSV();
    } catch (error: any) {
      toast.error(`Download CSV fail: ${error.message}`);
    } finally {
      setIsLoadingExported(false);
    }
  };

  return (
    <>
      <Button
        variant={'outline'}
        className={cn('group', 'border-neutral-30 text-neutral-40 h-8 rounded-md border-2 text-xs font-medium')}
        onClick={handleExportCsv}
        loading={isLoadingExported}
      >
        {!isLoadingExported && (
          <Download
            className={cn(
              'group-hover:[&_path:first-child]:stroke-grey-600 group-hover:[&_path:last-child]:fill-grey-600 mr-2.5 w-5',
              iconClassName
            )}
          />
        )}
        Download
      </Button>
    </>
  );
};

export default DownloadCSVButton;
