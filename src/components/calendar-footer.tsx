import { Button, ButtonProps } from "@/components/ui/button";
import { cn, getRandomRgbColor } from "@/lib/utils";
import { Subscription } from "@prisma/client";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MotionNumber from "motion-number";
import React, { useEffect, useState } from "react";
import { removeSubscription } from "src/db/subscriptions";
import { BottomSheet } from "./bottom-sheet";
import { Avatar } from "./ui/avatar";
import BottomSheetContent from "./bottom-sheet-content";
import { MOCK_SUBSCRIPTIONS } from "@/lib/constants";
import { useUser } from "@clerk/nextjs";
import AvatarFallbackColored from "./Avatar";

type CalendarProps = {
  subscriptions?: Subscription[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

const CalendarFooter = ({
  subscriptions,
  selectedDate,
  setSelectedDate,
}: CalendarProps) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    React.useState<Subscription[]>();
  const getDaysInMonth = (selectedDate: Date) => {
    return eachDayOfInterval({
      start: startOfMonth(selectedDate),
      end: endOfMonth(selectedDate),
    });
  };

  const daysInMonth = getDaysInMonth(selectedDate);

  const getSubscriptionsForDay = (day: Date) => {
    // if (!subscriptions || subscriptions.length < 1) return;

    const currentDay = format(day, "yyyy-MM-dd");

    let filteredSubs: Subscription[] = [];
    if (!user?.id) {
      filteredSubs = MOCK_SUBSCRIPTIONS?.filter((sub) => {
        const formattedDueDate = format(new Date(sub.dueDate), "yyyy-MM-dd");
        const isMatch = formattedDueDate === currentDay;

        return isMatch;
      });
      return filteredSubs;
    }

    filteredSubs = (subscriptions || [])?.filter((sub) => {
      const formattedDueDate = format(new Date(sub.dueDate), "yyyy-MM-dd");
      const isMatch = formattedDueDate === currentDay;

      return isMatch;
    });

    return filteredSubs;
  };

  function getFirstDayOfMonth(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    return firstDay.getDay(); // 0 for Sunday, 6 for Saturday
  }

  function getLastDayOfMonth(date: Date) {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay.getDay(); // 0 for Sunday, 6 for Saturday
  }

  const handleSelectSubscriptionDate = (selected: Subscription[]) => {
    setSelectedSubscription(selected);
    setOpen(true);
  };

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
        setSelectedSubscription((e) => {
          return e ? e.filter((sub) => sub.id !== id.id) : e;
        });
      }
    },
  });

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscription?"
    );
    if (confirmed) {
      mutation.mutate(id);
    }
  };

  const [isFromLeft, setIsFromLeft] = React.useState<boolean>(true);

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

  const totalMonthlyCost = user?.id
    ? subscriptions?.reduce((total, sub) => {
        const subscriptionMonth = new Date(sub.dueDate).getMonth();
        const subscriptionYear = new Date(sub.dueDate).getFullYear();
        if (
          selectedDate.getMonth() === subscriptionMonth &&
          selectedDate.getFullYear() === subscriptionYear
        ) {
          return total + sub.cost;
        } else {
          return total;
        }
      }, 0)
    : MOCK_SUBSCRIPTIONS?.reduce((total, sub) => {
        const subscriptionMonth = new Date(sub.dueDate).getMonth();
        const subscriptionYear = new Date(sub.dueDate).getFullYear();
        if (
          selectedDate.getMonth() === subscriptionMonth &&
          selectedDate.getFullYear() === subscriptionYear
        ) {
          return total + sub.cost;
        } else {
          return total;
        }
      }, 0);

  const [bgColor, setBgColor] = useState("");
  useEffect(() => {
    setBgColor(getRandomRgbColor());
  }, []);

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
              <span className="inline">{format(selectedDate, "MMMM")}</span>

              <span className="text-gray-400 mx-4 font">
                {format(selectedDate, "yyyy")}
              </span>
            </h1>
          </motion.div>
        </div>
        <div className="flex items-center gap-x-8">
          <div className="flex flex-col">
            <span className="text-zinc-500 md:whitespace-nowrap">
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
                  roundingMode: "floor",
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
          {/* Calculate the first day of the month */}
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

          {daysInMonth.map((day, index) => {
            const subscriptionsForDay = getSubscriptionsForDay(day) || [];

            // const bgColor = getRandomRgbColor();

            return (
              <div key={day.toISOString()}>
                <Popover>
                  <PopoverTrigger asChild>
                    <CalendarButton
                      className={`relative bg-[#1e1e1e] p-0`}
                      onClick={() => {
                        if (!subscriptionsForDay.length) return;
                        setSelectedSubscription(subscriptionsForDay);
                        setOpen(true);
                      }}
                    >
                      <motion.div
                        key={index}
                        whileHover="hover"
                        className="group min-w-full w-max h-full flex items-center justify-center"
                      >
                        {subscriptionsForDay?.length > 0 ? (
                          <div
                            className={cn(
                              "w-full flex flex-1 justify-center md:mb-3 py-1 cursor-pointer"
                            )}
                          >
                            {/* only show the first three subscriptions */}
                            {[...subscriptionsForDay]
                              ?.splice(0, 2)
                              .map((subcription, index) => {
                                return (
                                  <div
                                    key={subcription.id}
                                    className={cn("rounded-full -mr-1")}
                                  >
                                    <Avatar className="size-4 min-w-4 min-h-4 md:min-h-6 md:min-w-6 md:size-6">
                                      <AvatarImage
                                        src={subcription?.icon || ""}
                                        alt={subcription.name}
                                      />
                                      <AvatarFallbackColored>
                                        {subcription.name.charAt(0)}
                                      </AvatarFallbackColored>
                                      {/* <AvatarFallback
                                        key={index}
                                        style={{
                                          background: `linear-gradient(135deg, ${bgColor}, rgb(140, 160, 250))`,
                                        }}
                                        className="w-full text-[10px] flex justify-center items-center pt-0.5"
                                      >
                                        {subcription.name.charAt(0)}
                                      </AvatarFallback> */}
                                    </Avatar>
                                  </div>
                                );
                              })}
                            {subscriptionsForDay.length > 2 && (
                              <div className=" flex justify-center items-center size-4 min-w-4 min-h-4 md:min-h-7 md:min-w-7 md:size-7 rounded-full -mr-1 bg-zinc-950 z-10 text text-[10px]">
                                <span>+{subscriptionsForDay.length - 2}</span>
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
      >
        {selectedSubscription && selectedSubscription?.length <= 0 && (
          <div className="h-full w-full text-center">no items.</div>
        )}
        {selectedSubscription?.map((sub, index) => {
          const isLast = selectedSubscription?.length === index + 1;
          return (
            <BottomSheetContent
              subscription={sub}
              key={sub.id}
              isLast={isLast}
              selectedDate={selectedDate}
              selectedSubscription={selectedSubscription}
              handleDelete={handleDelete}
            />
          );
        })}
      </BottomSheet>
    </>
  );
};

CalendarFooter.displayName = "CalendarFooter";

export default CalendarFooter;

const CalendarButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        variant={variant}
        className={cn(
          "relative !py-0 aspect-square rounded-2xl border-none shadow-sm w-full h-full md:max-h-24 md:max-w-28 max-h-[80px] max-w-[90px]",
          className
        )}
      >
        {children}
      </Button>
    );
  }
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
