import type { ImageProps } from 'next/image';
import Image from 'next/image';
import React from 'react';

interface Props extends Omit<ImageProps, 'alt' | 'src'> {}

const LogoSmall = (props: Props) => {
  return <Image width={42} height={42} {...props} priority alt="logo" src="/images/logo.svg" />;
};

export default LogoSmall;
