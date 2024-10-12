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

  const modalStyles = 'md:inset-0 md:m-auto md:w-4/5 md:h-fit';
  const bottomSheetStyles = 'inset-x-0 -bottom-[2%] w-[98%] h-auto';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className={cn(
            'min-h-[30%] h-auto md:max-w-[60%] max-h-[60%] w-[99%] bg-background fixed rounded-xl border-2 -bottom-[2%] inset-x-0 mx-auto ',
            modalStyles,
            bottomSheetStyles,
            props.className
          )}
          variants={variants}
          initial="closed"
          animate={open ? 'open' : 'closed'}
        >
          <div className="w-full p-1 pt-[56px] relative overflow-y-auto">
            <div className="fixed h-[6px] w-10 top-2 inset-x-0 rounded-full mx-auto bg-white" />
            <div>
              <Button
                onClick={() => setOpen(false)}
                type="button"
                className="absolute right-3 top-3 hidden md:block"
              >
                <X />
              </Button>
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

BottomSheet.displayName = 'BottomSheet';
export { BottomSheet };
