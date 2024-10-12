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
  const { src, fallbackSrc, width, height, fill, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      className={cn('object-cover object-center', rest.className)}
      src={imgSrc || ''}
      alt={alt || ''}
      fill={fill} // Conditionally apply fill
      width={!fill ? width : undefined} // Only use width if fill is not set
      height={!fill ? height : undefined} // Only use height if fill is not set
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
