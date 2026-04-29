/* eslint-disable no-nested-ternary */
import { Plus } from 'lucide-react';
import React, { useRef } from 'react';
import toast from 'react-hot-toast';

import { uploadProfile } from '@/api/auth';
import { type MIME_TYPE } from '@/lib/mime';
import { cn } from '@/lib/utils';

import { Avatar } from './ui/avatar';
import { Button } from './ui/button';

interface Props {
  accept?: MIME_TYPE[];
  setValue: React.Dispatch<
    React.SetStateAction<{
      file_name: string;
      file_path: string;
    }>
  >;
  value: {
    file_name: string;
    file_path: string;
  };
  className?: string;
}

const UploadImg = ({ accept = [], setValue, className, value, ...props }: Props) => {
  const ref = useRef<React.ElementRef<'input'>>(null);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file?.type)) {
      toast.error('The file is not in the required format!');
    } else {
      const formUpload = new FormData();
      formUpload.append('file', file);
      const res = await uploadProfile(formUpload as any);
      setValue(res?.attachments[0]);
    }
    e.target.value = null;
  };

  return (
    <>
      <Avatar src={value.file_path || '/images/no-avatar-user.png'} className={cn('h-20 w-20', className)} />
      <Button type="button" className="flex items-center gap-2 px-3" onClick={() => ref.current?.click()}>
        <Plus size={20} />
        Update Picture
      </Button>
      <input
        hidden
        accept={accept.length === 0 ? undefined : accept.join(', ')}
        type="file"
        onChange={handleUpload}
        {...props}
        ref={ref}
      />
    </>
  );
};

export { UploadImg };
