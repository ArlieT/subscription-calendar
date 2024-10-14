import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Props = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'width' | 'height'
> & {
  fallbackSrc: string;
  src: string;
  width?: number;
  height?: number;
  fill?: boolean;
};

const ImageWithFallback = (props: Props) => {
  const { src, fallbackSrc, width = 0, height = 0, fill, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      className={cn('object-cover object-center', rest.className)}
      src={imgSrc || ''}
      alt={alt || ''}
      fill={fill || false} // Conditionally apply fill, fallback to false if undefined
      width={!fill ? width : undefined} // Only use width if fill is false
      height={!fill ? height : undefined} // Only use height if fill is false
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
