"use client";
import useClickOutside from "@/lib/hooks/useClickoutSide";
import { cn } from "@/lib/utils";
import { useEmailLink } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & React.HTMLAttributes<HTMLDivElement>;

const BottomSheet = ({ children, open, setOpen, title, ...props }: Props) => {
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
        y: { stiffness: 1000, velocity: -10, duration: 0.1 },
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const modalStyles =
    "md:m-auto md:inset-0 md:w-3/5 md:h-fit max-h-[80%] md:rounded-3xl";
  const bottomSheetStyles = "rounded-b-none inset-x-0 min-h-[30vh] w-[99.5%]";

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
          <div className="relative">
            <motion.div
              ref={ref}
              className={cn(
                "fixed bottom-0 mx-auto inset-x-0 rounded-3xl overflow-hidden",
                modalStyles,
                bottomSheetStyles,
                props.className,
              )}
              variants={variants}
              initial="closed"
              animate={open ? "open" : "closed"}
            >
              <div className="w-full pt-[46px] relative overflow-y-auto">
                <div className="block md:hidden absolute h-[6px] w-10 top-2 inset-x-0 rounded-full mx-auto bg-white/60" />
                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  type="button"
                  className=" absolute right-6 md:right-0 md:top-0 top-6 hidden md:block"
                >
                  <X className="size-5" />
                </button>
                <div className="overflow-x-hidden">{children}</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

BottomSheet.displayName = "BottomSheet";
export { BottomSheet };
