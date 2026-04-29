import Image from 'next/image';
import type { FC } from 'react';

interface Props {
  message?: string;
  src?: string;
  gradient?: boolean;
}

const Empty: FC<Props> = ({ message, src, gradient }) => {
  return (
    <div className="bg-baseBg flex flex-col items-center gap-3 p-10">
      <div className="relative aspect-square w-[80px]">
        <Image unoptimized fill src={src ?? '/images/no-data.png'} alt="" className="object-cover" />
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Empty;
