import { cn, getRandomRgbColor } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Badge, Calendar, Edit3, Trash, Trash2 } from "lucide-react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import AvatarFallbackColored from "./Avatar";
import { Subscription } from "src/types";
import MotionNumber from "motion-number";
import { Popover } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import DropdownOptions from "./dropdown-menu";

type Props = {
  selectedSubscription: Subscription[] | undefined;
  isEditMode: boolean;
  isLast: boolean;
  selectedDate: Date;
  handleDelete: (id: number | undefined) => void;
  handleEdit: (id: number | undefined) => void;
};

const BottomSheetContent = ({
  selectedSubscription,
  isEditMode,
  selectedDate,
  isLast,
  handleDelete,
}: Props) => {
  const [totalCost, setTotalCost] = useState(0);

  // useEffect(() => {
  //   function calculateMonthsPassed(startDate: Date, currentDate: Date) {
  //     const start = new Date(startDate);
  //     const current = new Date(currentDate);

  //     const yearsDifference = current.getFullYear() - start.getFullYear();
  //     const monthsDifference = current.getMonth() - start.getMonth();

  //     const includedFirstMonth = 1;
  //     return yearsDifference * 12 + monthsDifference + includedFirstMonth;
  //   }

  //   setTotalCost(
  //     subscription.cost *
  //       calculateMonthsPassed(subscription.createdAt, selectedDate),
  //   );
  // }, [selectedSubscription]);

  return (
    <div
      className={cn("w-full flex flex-col gap-2", {
        // "border-b  pb-2 p-1":
        //   selectedSubscription && !isLast && selectedSubscription?.length > 1,
      })}
    >
      {selectedSubscription?.map((subscription) => {
        return (
          <div
            key={subscription.id}
            className="flex flex-col w-full c/space-y-1 p-2"
          >
            <div className="flex w-fit self-end">
              <DropdownOptions
                onEdit={() => {}}
                onDelete={() => handleDelete(subscription.id)}
              />
            </div>

            <div className="flex  items-center w-full justify-between">
              <div className="flex flex-col gap-2">
                <Avatar className="flex items-center gap-2">
                  <AvatarImage
                    src={subscription?.icon || ""}
                    alt={subscription.name}
                    className="rounded-full size-8 md:size-10"
                  />
                  <span className="">{subscription.name}</span>
                  <AvatarFallbackColored className="rounded-full w-6 h-6 md:size-10">
                    {subscription.name[0]}
                  </AvatarFallbackColored>
                </Avatar>
                <span className="text-sm text-foreground/70">
                  Every &nbsp;{format(subscription.dueDate, "dd")}th
                </span>
                <span className="text-sm text-foreground/70">
                  Since {format(subscription.createdAt, "MMMM dd, yyyy")}
                </span>
                <span className="text-sm text-foreground/70">
                  {subscription.description}
                </span>
              </div>
              <div className="flex flex-col justify-end items-end gap-2">
                <MotionNumber
                  value={subscription.cost.toFixed(2)}
                  format={{
                    style: "currency",
                    currency: "PHP",
                    compactDisplay: "short",
                    notation: "standard",
                  }}
                  className="text-foreground text-lg md:text-xl "
                />
                <span className="text-foreground text-center bg-gray-500/20 py-1 p-3 rounded-lg capitalize text-sm">
                  {subscription.cycle.toLowerCase()}
                </span>
                {/*//todo calculate total expenses since first payment*/}
                <MotionNumber
                  value={subscription.cost.toFixed(2)}
                  format={{
                    style: "currency",
                    currency: "PHP",
                    compactDisplay: "short",
                    notation: "standard",
                  }}
                  className="text-sm text-foreground/70 w-fit"
                />
              </div>
            </div>

            <div className="w-full h-[1px] my-8 bg-gray-500/10 rounded-full" />
          </div>
        );
      })}
    </div>
  );
};

export default BottomSheetContent;
