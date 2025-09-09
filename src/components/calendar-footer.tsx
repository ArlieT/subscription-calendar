import { Button, ButtonProps } from "src/components/ui/button";
import {
  calculateMonthlyCost,
  cn,
  getAllDaysInMonth,
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getSubscriptionOfTheDay,
} from "src/lib/utils";
import { useUser, useClerk } from "@clerk/nextjs";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MotionNumber from "motion-number";
import React from "react";
import { removeSubscription, editSubscription } from "src/db/subscriptions";
import { Subscription } from "src/types";
import { Status } from "@prisma/client";
import AvatarFallbackColored from "./Avatar";
import { BottomSheet } from "./bottom-sheet";
import BottomSheetContent from "./bottom-sheet-content";
import { Avatar } from "./ui/avatar";
import { toast } from "sonner";

type CalendarProps = {
  subscriptions?: Subscription[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

type EditFormData = {
  name: string;
  description: string;
  cost: number;
  cycle: string;
  dueDate: Date;
  icon: string;
};

const CalendarMain = ({
  subscriptions,
  selectedDate,
  setSelectedDate,
}: CalendarProps) => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [isFromLeft, setIsFromLeft] = React.useState<boolean>(true);
  const [selectedDateToView, setSelectedDateToView] =
    React.useState<Subscription[]>();

  const handleNextMonth = () => {
    setIsFromLeft(true);
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const mutation = useMutation({
    mutationFn: removeSubscription,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });

      if (!("error" in id)) {
        setSelectedDateToView((e) => {
          return e ? e.filter((sub) => sub.id !== id.id) : e;
        });
      }
    },
  });

  const handleDelete = (id: number | undefined) => {
    if (!id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscription?",
    );
    if (confirmed) {
      mutation.mutate(id);
    }
  };

  const editMutation = useMutation({
    mutationFn: editSubscription,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });

      if (result.success) {
        // Update the selectedDateToView state with the edited subscription
        setSelectedDateToView((prev) => {
          if (!prev) return prev;
          return prev.map((sub) =>
            sub.id === result.data?.id ? { ...sub, ...result.data } : sub,
          );
        });

        toast("Subscription updated!", {
          description: "Your subscription has been updated successfully.",
        });
      } else {
        toast.error("Something went wrong! Please try again.");
      }
    },
    onError: () => {
      toast.error("Failed to update subscription. Please try again.");
    },
  });

  const handleEdit = async (
    subscription: Subscription,
    formData: EditFormData,
  ) => {
    if (!user?.id) {
      openSignIn();
      return;
    }

    const updatedSubscription: Omit<Subscription, "createdAt" | "updatedAt"> = {
      id: subscription.id,
      user_id: user.id,
      name: formData.name,
      description: formData.description,
      cost: formData.cost,
      cycle: formData.cycle as any,
      dueDate: formData.dueDate,
      tags: subscription.tags || [],
      icon: formData.icon,
      status: Status.ACTIVE,
    };

    editMutation.mutate(updatedSubscription);
  };

  const handlePrevMonth = () => {
    setIsFromLeft(false);

    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const variants = {
    fromLeft: { opacity: 0, x: -20 }, // Slide from the left
    fromRight: { opacity: 0, x: 20 }, // Slide from the right
    visible: {
      opacity: 1,
      x: 0,
    }, // Centered
  };

  const totalMonthlyCost = calculateMonthlyCost(subscriptions);

  return (
    <>
      <div className="flex flex-row-reverse md:flex-row justify-between items-center w-full my-2 md:my-4">
        <div className="flex gap-x-2">
          <Button
            onClick={handlePrevMonth}
            className="rounded-full size-12 max-w-12 max-h-12 min-h-12 min-w-12 top-0 bg-[#323232] left-0 w-auto"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={handleNextMonth}
            className="rounded-full size-12 max-w-12 max-h-12 min-h-12 min-w-12 top-0 bg-[#323232] left-0 w-auto"
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex w-full items-center mx-auto justify-center ">
          <motion.div
            key={selectedDate.toDateString()} // Add the key prop to trigger re-render on date change
            initial={isFromLeft ? "fromAbove" : "fromBelow"}
            animate="visible"
            variants={{
              visible: {
                opacity: 1,
                y: 0,
              },
              fromAbove: {
                opacity: 0,
                y: 20,
              },
              fromBelow: {
                opacity: 0,
                y: -20,
              },
            }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl text-center text-zinc-300 md:text-3xl tracking-wider font-bold">
              <div className="flex flex-col">
                <span className="inline whitespace-nowrap">
                  {format(selectedDate, "MMMM")}
                </span>
              </div>
              <span className="text-gray-400 mx-4 font">
                {format(selectedDate, "yyyy")}
              </span>
            </h1>
          </motion.div>
        </div>
        <div className="flex items-center gap-x-8">
          <div className="flex flex-col">
            <span className="text-xs md:text-base text-zinc-500 whitespace-nowrap md:whitespace-nowrap">
              Monthly Expenses
            </span>
            <div className="w-full text-right text-secondary">
              <MotionNumber
                value={Math.floor(totalMonthlyCost || 0)}
                format={{
                  style: "currency",
                  currency: "PHP",
                  compactDisplay: "short",
                  notation: "standard",
                }}
                className="text-foreground text-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-7 gap-1 md:gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-xs uppercase w-full text-white text-center bg-[#323232] py-2 px-0/5 rounded-full"
          >
            {day}
          </div>
        ))}
      </div>

      <motion.div
        key={selectedDate.toDateString()}
        variants={variants}
        initial={isFromLeft ? "fromLeft" : "fromRight"}
        className="w-full"
        animate="visible"
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      >
        <div className="grid grid-cols-7 h-fit grid-rows-6 gap-1 md:gap-2">
          {/* Render empty days before the first day of the month */}
          {Array.from({
            length: getFirstDayOfMonth(selectedDate || new Date()),
          }).map((_, index) => (
            <CalendarButton
              variant="secondary"
              disabled
              key={index}
              className="relative bg-zinc-700/20 rounded-2xl border-none shadow-sm w-full h-full"
            ></CalendarButton>
          ))}

          {getAllDaysInMonth(selectedDate || new Date()).map((day, index) => {
            const subscriptionsForDay =
              getSubscriptionOfTheDay(day, subscriptions, user?.id) || [];

            return (
              <div key={day.toISOString()}>
                <Popover>
                  <PopoverTrigger asChild>
                    <CalendarButton
                      className={`relative hover:bg-[#1e1e1e]/80 bg-[#1e1e1e] p-0`}
                      onClick={() => {
                        if (!subscriptionsForDay.length) return;
                        setSelectedDateToView(subscriptionsForDay);
                        setOpen(true);
                      }}
                    >
                      <motion.div
                        key={index}
                        whileHover="hover"
                        className="group text-primary min-w-full w-max h-full flex items-center justify-center"
                      >
                        {subscriptionsForDay?.length > 0 ? (
                          <div
                            className={cn(
                              "w-full flex flex-1 justify-center md:mb-3 py-1 cursor-pointer",
                            )}
                          >
                            {[...subscriptionsForDay]
                              .slice(0, 2)
                              .map((subscription, index) => (
                                <div
                                  key={subscription.id}
                                  className={cn("rounded-full", {
                                    "-ml-2": index !== 0,
                                  })}
                                >
                                  <Avatar className="size-5 md:size-6">
                                    <AvatarImage
                                      src={subscription?.icon || ""}
                                      alt={subscription.name}
                                    />
                                    <AvatarFallbackColored>
                                      {subscription.name.charAt(0)}
                                    </AvatarFallbackColored>
                                  </Avatar>
                                </div>
                              ))}

                            {subscriptionsForDay.length > 2 && (
                              <div
                                className={cn(
                                  "flex justify-center items-center rounded-full bg-zinc-800 text-white text-[10px] font-medium",
                                  "size-5 md:size-6 -ml-2",
                                )}
                              >
                                +{subscriptionsForDay.length - 2}
                              </div>
                            )}
                          </div>
                        ) : null}
                        <SubscriptionIndicator
                          subscriptionForDayCount={subscriptionsForDay.length}
                        />
                        <span className="flex flex-col flex-1 absolute bottom-0 md:bottom-2 items-center justify-center text-[10px] md:text-base">
                          {format(day, "d")}
                        </span>
                      </motion.div>
                    </CalendarButton>
                  </PopoverTrigger>
                </Popover>
              </div>
            );
          })}
          {Array.from({
            length: getLastDayOfMonth(selectedDate || new Date()) + 1,
          }).map((_, index) => (
            <CalendarButton
              variant="secondary"
              disabled
              key={index}
              className="relative bg-zinc-700/20 rounded-2xl border-none shadow-sm w-full h-full"
            >
              {index + 1}
            </CalendarButton>
          ))}
        </div>
      </motion.div>
      <BottomSheet
        open={open}
        setOpen={setOpen}
        className="flex flex-col bg-zinc-900 md:p-4"
        title="Subscription Details"
      >
        {selectedDateToView && selectedDateToView?.length <= 0 && (
          <div className="h-full w-full text-center">no items.</div>
        )}
        <BottomSheetContent
          selectedDate={selectedDate}
          selectedSubscription={selectedDateToView}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </BottomSheet>
    </>
  );
};

CalendarMain.displayName = "CalendarFooter";

export default CalendarMain;

const CalendarButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        variant={variant}
        className={cn(
          "relative !py-0 aspect-square hover:bg rounded-2xl border-none shadow-sm w-full h-full md:max-h-24 md:max-w-28 max-h-[80px] max-w-[90px]",
          className,
        )}
      >
        {children}
      </Button>
    );
  },
);

CalendarButton.displayName = "CalendarButton";

const SubscriptionIndicator = ({
  subscriptionForDayCount,
}: {
  subscriptionForDayCount: number;
}) => {
  return subscriptionForDayCount > 0 ? (
    <div
      className="md:block absolute top-2 right-2 size-2 rounded-full"
      style={{
        background:
          "linear-gradient(135deg, rgb(94, 106, 210), rgb(140, 160, 250))",
      }}
    ></div>
  ) : null;
};
