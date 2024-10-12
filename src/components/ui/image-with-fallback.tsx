import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const ImageWithFallback = (props: any) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      className={cn('object-cover object-center', rest.className)}
      fill
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
