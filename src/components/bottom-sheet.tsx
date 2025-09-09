"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { cn } from "src/lib/utils";

type Props = {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const BottomSheet = ({
  children,
  open,
  setOpen,
  title,
  className,
  ...props
}: Props) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          // Base styles
          "h-full overflow-y-auto",
          "p-0 gap-0 border-0 max-w-none w-auto h-auto",
          // Mobile: Bottom sheet behavior
          "fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0",
          "rounded-t-3xl rounded-b-none",
          "min-h-[30vh] max-h-[80vh]",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "data-[state=open]:duration-300 data-[state=closed]:duration-300",
          // Desktop: Modal behavior
          "md:fixed md:left-[50%] md:top-[50%] md:translate-x-[-50%] md:translate-y-[-50%]",
          "md:rounded-3xl md:w-3/5 md:h-fit md:max-h-[80vh]",
          "md:min-h-0",
          "md:data-[state=open]:slide-in-from-left-1/2 md:data-[state=open]:slide-in-from-top-[48%]",
          "md:data-[state=closed]:slide-out-to-left-1/2 md:data-[state=closed]:slide-out-to-top-[48%]",
          className,
        )}
        {...props}
      >
        <div className="w-full h-full pt-[46px] md:pt-6 relative ">
          {/* Mobile drag indicator */}
          <div className="block md:hidden absolute h-[6px] w-10 top-2 left-1/2 transform -translate-x-1/2 rounded-full bg-white/60" />

          {/* Header with title if provided */}
          {/*{title && (
            <DialogHeader className="px-6 pb-4">
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
          )}*/}

          {/* Content */}
          <div className="overflow-x-hidden">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

BottomSheet.displayName = "BottomSheet";
export { BottomSheet };
