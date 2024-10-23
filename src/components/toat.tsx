import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { CircleCheckBig, TriangleAlert } from "lucide-react";
import React, { useEffect } from "react";

interface ToastProps {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
  status: "success" | "error";
  duration?: number;
  closeToast: () => void;
}

const ToastRoot = ({
  children,
  isOpen,
  className = "",
  status,
  duration = 3000,
  closeToast,
}: ToastProps) => {
  const variants: Variants = {
    initial: {
      y: -100,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", duration: 0.4, ease: "easeIn" },
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  useEffect(() => {
    setTimeout(() => {
      closeToast();
    }, duration);
    return () => {};
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="toast"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`fixed top-5 mx-auto p-4 bg-zinc-900 flex gap-x-2 rounded w-[300px] border ${className}`}
          role="alert"
        >
          <span className="flex gap-x-2 items-center">
            {status === "success" ? (
              <CircleCheckBig size={24} className="text-green-500" />
            ) : (
              <TriangleAlert className="text-red-500" />
            )}
          </span>
          <div>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ToastHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="toast-header font-bold">{children}</div>
);

const ToastBody = ({ children }: { children: React.ReactNode }) => (
  <div className={cn("", { "mt-2": children })}>{children}</div>
);

const Toast = {
  Root: ToastRoot,
  Header: ToastHeader,
  Body: ToastBody,
};

export default Toast;
