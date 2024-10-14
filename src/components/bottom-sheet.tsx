'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useClickOutside from '@/lib/hooks/useClickoutSide';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './ui/button';

type Props = {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & React.HTMLAttributes<HTMLDivElement>;

const BottomSheet = ({ children, open, setOpen, ...props }: Props) => {
  const ref = useClickOutside<HTMLDivElement>(() => {
    if (open) {
      setOpen(false);
    }
  });

  const variants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100, duration: 0.1 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      ttransition: {
        y: { stiffness: 1000 },
      },
      ransition: {
        y: { stiffness: 1000, velocity: -100, duration: 0.1 },
      },
    },
  };

  // const modalStyles = 'md:inset-0 md:m-auto md:w-4/5 md:h-auto';
  const modalStyles = '';
  const bottomSheetStyles = 'rounded-b-none inset-x-0 c/-bottom-[1%] w-[98%]';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className={cn(
            'absolute bottom-0 rounded-3xl overflow-hidden',
            modalStyles,
            bottomSheetStyles,
            props.className
          )}
          variants={variants}
          initial="closed"
          animate={open ? 'open' : 'closed'}
        >
          <div className="w-full pt-[46px] relative overflow-y-auto">
            <div className="block md:hidden absolute h-[6px] w-10 top-2 inset-x-0 rounded-full mx-auto bg-white" />
            <button
              onClick={() => setOpen(false)}
              type="button"
              className=" absolute right-2 top-2 hidden md:block"
            >
              <X className="size-5" />
            </button>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

BottomSheet.displayName = 'BottomSheet';
export { BottomSheet };
