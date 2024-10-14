import { cn } from '@/lib/utils';
import React from 'react';
import ImageWithFallback from './ui/image-with-fallback';

type AvatarProps = {
  fallback: string;
  fill?: boolean;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const Avatar = ({ fallback, fill, ...props }: AvatarProps) => {
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0);
    }
    return `${names[0].charAt(0)}${names[1].charAt(0)}`;
  };

  // console.log('Avatar Props:', { fill, ...props });

  return (
    <div className="relative h-full w-full overflow-hidden rounded-full">
      {props.src ? (
        <ImageWithFallback
          src={props.src || ''}
          fill={fill}
          alt={props.alt || 'avatar'}
          className={cn(props.className)}
          fallbackSrc={'https://i.sstatic.net/7W5Wq.png?s=64'}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-violet-500 uppercase flex items-center justify-center">
          <span>{getInitials(fallback)}</span>
        </div>
      )}
    </div>
  );
};

export default Avatar;
