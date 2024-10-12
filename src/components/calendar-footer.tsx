import { Button, ButtonProps } from '@/components/ui/button';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { eachDayOfInterval, endOfMonth, startOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';
import { cn } from '@/lib/utils';
import Avatar from './Avatar';
import { motion, useAnimation } from 'framer-motion';
import { BottomSheet } from './bottom-sheet';
import { Subscription } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeSubscription } from 'src/db/queries';

type CalendarProps = {
  subscriptions: Subscription[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

const CalendarFooter = ({
  subscriptions,
  selectedDate,
  setSelectedDate,
}: CalendarProps) => {
  const queryClient = useQueryClient();

  const getDaysInMonth = () => {
    const date = new Date();
    return eachDayOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date),
    });
  };

  const getSubscriptionsForDay = (day: Date) => {
    return subscriptions?.filter(
      (sub) => format(sub.dueDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );
  };

  function getFirstDayOfMonth(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay.getDay(); // 0 for Sunday, 6 for Saturday
  }

  const controls = useAnimation();

  function handleMouseEnterControls() {
    controls.start('hover');
  }

  function handleMouseLeaveControls() {
    controls.start('initial');
  }

  const [open, setOpen] = React.useState(false);
  const [selectedSubscription, setSelectedSubscription] = React.useState<
    Subscription[] | null
  >([]);

  const handleSelectSubscriptionDate = (selected: Subscription[]) => {
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
    hiddenLeft: { opacity: 0, x: -20 }, // Slide from the left
    hiddenRight: { opacity: 0, x: 20 }, // Slide from the right
    visible: {
      opacity: 1,
      x: 0,
    }, // Centered
  };

  return (
    <>
      <div className="relative flex items-center w-full my-4">
        <div className="flex w-full items-center mx-auto justify-center">
          <motion.div
            key={selectedDate.toDateString()} // Add the key prop to trigger re-render on date change
            initial="initial"
            animate="visible"
            variants={{
              initial: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl md:text-3xl font-bold">
              {format(selectedDate, 'MMMM')}
              <span className="text-gray-400 mx-4 font-normal">
                {format(selectedDate, 'yyyy')}
              </span>
            </h1>
          </motion.div>
        </div>
        <div className="flex gap-x-5">
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
      </div>
      <div className="grid grid-cols-7 gap-2">
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
        initial={isFromLeft ? 'hiddenLeft' : 'hiddenRight'}
        animate="visible"
        transition={{
          duration: 0.5,
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {/* Calculate the first day of the month */}
          {/* Render empty days before the first day of the month */}
          {Array.from({
            length: getFirstDayOfMonth(selectedDate || new Date()),
          }).map((_, index) => (
            <CalendarButton
              variant="secondary"
              disabled
              key={index}
              className="relative c/aspect-square rounded-2xl border-none shadow-sm w-full h-full"
            ></CalendarButton>
          ))}

          {getDaysInMonth().map((day, index) => {
            const subscriptionsForDay = getSubscriptionsForDay(day);

            return (
              <motion.div>
                <Popover key={day.toISOString()}>
                  <PopoverTrigger asChild>
                    <CalendarButton
                      className={`relative bg-neutral-700 rounded-2xl border-none shadow-sm w-full h-full ${
                        subscriptionsForDay?.length > 0 ? '' : ''
                      }`}
                      onClick={() => {
                        if (subscriptionsForDay?.length > 0) {
                          handleSelectSubscriptionDate(subscriptionsForDay);
                        }
                      }}
                    >
                      <motion.div
                        key={index}
                        whileHover="hover"
                        className="group h-full w-full flex flex-col mt-1 justify-center items-center"
                      >
                        {subscriptionsForDay?.length > 0 ? (
                          <div
                            className={cn(
                              'relative flex-grow w-full flex justify-center items-center'
                            )}
                          >
                            {subscriptionsForDay.map((sub, index) => {
                              const iconStyles: string = `-left-[${
                                index * 2
                              }%]`;

                              return (
                                <div
                                  key={sub.id}
                                  className={cn(
                                    'absolute size-5 md:size-6 rounded-full mr-1',
                                    iconStyles,
                                    {
                                      '-right-2':
                                        index === 0 &&
                                        subscriptionsForDay?.length > 1,
                                    }
                                  )}
                                >
                                  <Avatar
                                    fallback={sub.name}
                                    alt="avatar"
                                    src={sub?.icon as string}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : null}
                        <span className="h-[30%] font-semibold md:font-bold text-opacity-60 text-xs md:text-sm text-foreground/80">
                          {format(day, 'd')}
                        </span>
                      </motion.div>
                    </CalendarButton>
                  </PopoverTrigger>
                </Popover>
              </motion.div>
            );
          })}
          <BottomSheet
            open={open}
            setOpen={setOpen}
            className="p-4 pt-6 space-y-2 flex flex-col"
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
                    'border-b pb-2':
                      selectedSubscription &&
                      !isLast &&
                      selectedSubscription?.length > 1,
                  })}
                >
                  <dl className="w-full space-y-1 p-2">
                    <div className="flex gap-x-2 items-center justify-between w-full">
                      <div className="flex gap-x-2 items-center">
                        <dt className="size-5 md:size-8">
                          <Avatar
                            src={sub?.icon as string}
                            alt={sub?.name}
                            fallback={sub?.name}
                            className="size-8 md:size-10"
                          />
                        </dt>
                        <dd className="font-bold text-lg">{sub.name}</dd>
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
                      <dd>Total since createdAt</dd>
                      <dd className="text-foreground/70">
                        {format(sub.createdAt, 'dd MMM yyyy')}
                      </dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </BottomSheet>
        </div>
      </motion.div>
    </>
  );
};

export default CalendarFooter;

const CalendarButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        variant={variant}
        className={cn(
          'relative aspect-square rounded-2xl border-none shadow-sm w-full h-full md:max-h-24 md:max-w-28 max-h-[80px] max-w-[90px]',
          className
        )}
      >
        {children}
      </Button>
    );
  }
);
