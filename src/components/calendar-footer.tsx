import { Button, ButtonProps } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { cn, getRandomRgbColor } from '@/lib/utils';
import { motion } from 'framer-motion';
import { BottomSheet } from './bottom-sheet';
import { Cycle, Subscription } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeSubscription } from 'src/db/queries';
import MotionNumber from 'motion-number';
import { AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Avatar } from './ui/avatar';

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
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [selectedSubscription, setSelectedSubscription] = React.useState<
    Subscription[] | null
  >([]);

  const getDaysInMonth = (selectedDate: Date) => {
    return eachDayOfInterval({
      start: startOfMonth(selectedDate),
      end: endOfMonth(selectedDate),
    });
  };

  const daysInMonth = getDaysInMonth(selectedDate);

  const getSubscriptionsForDay = (day: Date) => {
    if (!subscriptions || subscriptions.length < 1) return;

    const currentDay = format(day, 'yyyy-MM-dd');
    console.log('Current Day:', currentDay);

    const filteredSubs = subscriptions.filter((sub) => {
      const formattedDueDate = format(new Date(sub.dueDate), 'yyyy-MM-dd');
      const isMatch = formattedDueDate === currentDay;
      console.log(`Matching ${formattedDueDate} === ${currentDay}:`, isMatch); // Log comparison result
      return isMatch;
    });

    console.log({ filteredSubs });
    return filteredSubs;
  };

  console.log({ subscriptions });

  function getFirstDayOfMonth(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

    return firstDay.getDay(); // 0 for Sunday, 6 for Saturday
  }

  function getLastDayOfMonth(date: Date) {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay.getDay(); // 0 for Sunday, 6 for Saturday
  }

  const handleSelectSubscriptionDate = (selected: Subscription[]) => {
    console.log(selected);
    setSelectedSubscription(selected);
    setOpen(true);
  };

  const mutation = useMutation({
    mutationFn: removeSubscription,
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      if (!('error' in id)) {
        setSelectedSubscription((e) => {
          return e ? e.filter((sub) => sub.id !== id.id) : e;
        });
      }
    },
  });

  const handleNextMonth = () => {
    setIsFromLeft(true);
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
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

  const totalMonthlyCost = subscriptions?.reduce((total, sub) => {
    return total + (sub.cycle === Cycle.MONTHLY ? sub.cost : sub.cost / 12);
  }, 0);

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
            initial={isFromLeft ? 'fromAbove' : 'fromBelow'}
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
              <span className="inline">{format(selectedDate, 'MMMM')}</span>

              <span className="text-gray-400 mx-4 font">
                {format(selectedDate, 'yyyy')}
              </span>
            </h1>
          </motion.div>
        </div>
        <div className="flex items-center gap-x-8">
          <div className="flex flex-col">
            <span className="text-zinc-500 md:whitespace-nowrap">
              Monthly Spend
            </span>
            <div className="w-full text-right text-secondary">
              <MotionNumber
                value={Math.floor(totalMonthlyCost || 0)}
                format={{
                  style: 'currency',
                  currency: 'PHP',
                  compactDisplay: 'short',
                  notation: 'standard',
                  roundingMode: 'floor',
                }}
                className="text-foreground text-lg w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-7 gap-1 md:gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
        initial={isFromLeft ? 'fromLeft' : 'fromRight'}
        className="w-full"
        animate="visible"
        transition={{
          duration: 0.5,
          type: 'spring',
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
            const hasSubsriptions = subscriptionsForDay?.length > 0;

            const bgColor = getRandomRgbColor();

            return (
              <div key={day.toISOString()}>
                <Popover>
                  <PopoverTrigger asChild>
                    <CalendarButton
                      className={`relative flex items-center bg-[#1e1e1e]`}
                      onClick={() => {
                        if (hasSubsriptions) {
                          setSelectedSubscription(subscriptions || []);
                          setOpen(true);
                          // handleSelectSubscriptionDate(subscriptionsForDay);
                        }
                      }}
                    >
                      <motion.div
                        key={index}
                        whileHover="hover"
                        className="group min-w-full h-full w-full flex flex-col justify-end md:justify-center items-center"
                      >
                        {subscriptionsForDay?.length > 0 ? (
                          <div
                            className={cn(
                              'w-full flex items-end justify-center py-1 cursor-pointer'
                            )}
                          >
                            {subscriptionsForDay
                              ?.splice(
                                0,
                                subscriptionsForDay.length > 2 ? 2 : 1
                              )
                              .map((sub, index) => {
                                return (
                                  <div
                                    key={sub.id}
                                    className={cn(' rounded-full -mr-1')}
                                  >
                                    <Avatar className="size-4 min-w-4 min-h-4 md:min-h-6 md:min-w-6 md:size-6">
                                      <AvatarImage
                                        src={sub?.icon || ''}
                                        alt={sub.name}
                                      />
                                      <AvatarFallback></AvatarFallback>
                                      <AvatarFallback
                                        style={{
                                          background: `linear-gradient(135deg, ${bgColor}, rgb(140, 160, 250))`,
                                        }}
                                        className="w-full text-[10px] flex justify-center items-center pt-0.5"
                                      >
                                        {sub.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                );
                              })}
                            {subscriptionsForDay.length > 2 && (
                              <div className="mt-1 flex justify-center items-center size-4 min-w-4 min-h-4 md:min-h-6 md:min-w-6 md:size-6 rounded-full -mr-1 bg-zinc-950 z-10 text text-[10px]">
                                <span>+{subscriptionsForDay.length - 2}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="size-5"></div>
                        )}
                        {subscriptionsForDay?.length > 0 ? (
                          <div
                            className="md:block absolute top-2 right-1 size-2 rounded-full"
                            style={{
                              background:
                                'linear-gradient(135deg, rgb(94, 106, 210), rgb(140, 160, 250))',
                            }}
                          ></div>
                        ) : null}

                        <span className="flex flex-col items-center justify-center text-[10px] md:text-base">
                          {format(day, 'd')}
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
          {/* <div className="row-start-6 h-1  outline"></div> */}
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
          console.log(sub);
          const isLast = selectedSubscription?.length === index + 1;
          return (
            <div
              key={sub.id}
              className={cn('w-full flex gap-2', {
                'border-b pb-2 p-1':
                  selectedSubscription &&
                  !isLast &&
                  selectedSubscription?.length > 1,
              })}
            >
              <dl className="w-full space-y-1 p-2">
                <div className="flex gap-x-2 items-center justify-between w-full">
                  <div className="flex gap-x-2 items-center">
                    <dt key={sub.id} className={cn('rounded-full -mr-1')}>
                      <Avatar className="size-6 min-w-6 min-h-6 md:min-h-6 md:min-w-6 md:size-6 ">
                        <AvatarImage src={sub?.icon || ''} alt={sub.name} />
                        <AvatarFallback></AvatarFallback>
                        <AvatarFallback
                          style={{ backgroundColor: getRandomRgbColor() }}
                          className="rounded-full w-full flex justify-center items-center"
                        >
                          {sub.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </dt>
                    <dd className="ml-2 font-bold text-lg">{sub.name}</dd>
                  </div>
                  <Button
                    variant="destructive"
                    className="size-8 p-0 md:size-8"
                    onClick={() => mutation.mutate(sub.id)}
                  >
                    <Trash className="size-4 md:size-4" />
                  </Button>
                </div>
                <div className="flex w-full justify-between">
                  <dd>cost</dd>
                  <dd className="font-bold text-lg tabular-nums">
                    ${sub.cost.toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between w-full">
                  <dd>Every &nbsp;{format(sub.dueDate, 'io')}</dd>
                  <dd className="text-foreground/70">Nexth payment</dd>
                </div>
                <div className="flex justify-between w-full">
                  <dd>Total since {format(sub.createdAt, 'dd MMM yyyy')} </dd>
                  <dd className="text-foreground/70">{sub.cost}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </BottomSheet>
    </>
  );
};

CalendarFooter.displayName = 'CalendarFooter';

export default CalendarFooter;

const CalendarButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        variant={variant}
        className={cn(
          'relative !py-0 aspect-square rounded-2xl border-none shadow-sm w-full h-full md:max-h-24 md:max-w-28 max-h-[80px] max-w-[90px]',
          className
        )}
      >
        {children}
      </Button>
    );
  }
);

CalendarButton.displayName = 'CalendarButton';
