import { cn, getRandomRgbColor } from "@/lib/utils";
import { Subscription } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Trash } from "lucide-react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  subscription: Subscription;
  selectedSubscription: Subscription[];
  isLast: boolean;
  selectedDate: Date;
  handleDelete: (id: number) => void;
};

const BottomSheetContent = ({
  subscription: subscription,
  selectedSubscription,
  selectedDate,
  isLast,
  handleDelete,
}: Props) => {
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    function calculateMonthsPassed(startDate: Date, currentDate: Date) {
      const start = new Date(startDate);
      const current = new Date(currentDate);

      const yearsDifference = current.getFullYear() - start.getFullYear();
      const monthsDifference = current.getMonth() - start.getMonth();

      const includedFirstMonth = 1;
      return yearsDifference * 12 + monthsDifference + includedFirstMonth;
    }

    console.log(calculateMonthsPassed(subscription.createdAt, selectedDate));

    setTotalCost(
      subscription.cost *
        calculateMonthsPassed(subscription.createdAt, selectedDate)
    );
  }, [selectedSubscription]);
  return (
    <div
      key={subscription.id}
      className={cn("w-full flex gap-2", {
        "border-b pb-2 p-1":
          selectedSubscription && !isLast && selectedSubscription?.length > 1,
      })}
    >
      <dl className="w-full space-y-1 p-2">
        <div className="flex gap-x-2 items-center justify-between w-full">
          <div className="flex gap-x-2 items-center">
            <dt key={subscription.id} className={cn("")}>
              <Avatar className="outline h-6 w-6 rounded-full relative bg- overflow-hidden">
                <AvatarImage
                  src={subscription?.icon || ""}
                  alt={subscription.name}
                  className="h-6 w-6 rounded-full"
                />
                <AvatarFallback
                  style={{ backgroundColor: getRandomRgbColor() }}
                  className="h-6 w-6 rounded-full flex justify-center items-center text-xs"
                >
                  {subscription.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </dt>
            <dd className="ml-2 font-bold text-lg">{subscription.name}</dd>
          </div>
          <Button
            variant="destructive"
            className="w-auto px-4 md:size-12 md:max-h-10"
            onClick={() => handleDelete(subscription.id)}
          >
            <Trash className="size-4 md:size-4" />
          </Button>
        </div>
        <div className="flex w-full justify-between">
          <dd>cost</dd>
          <dd className="font-bold text-lg tabular-nums">
            ${subscription.cost.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between w-full">
          {subscription.cycle === "MONTHLY" ? (
            <>
              <dd>Every &nbsp;{format(subscription.dueDate, "io")}</dd>
              <dd className="text-foreground/70">Nexth payment</dd>
            </>
          ) : (
            <>
              <dd>
                {format(
                  new Date(
                    new Date(subscription.dueDate).setFullYear(
                      new Date(subscription.dueDate).getFullYear() + 1
                    )
                  ),
                  "dd MMM yyyy"
                )}
              </dd>
              <dd className="text-foreground/70">Nexth payment</dd>
            </>
          )}
        </div>
        <div className="flex justify-between w-full">
          <dd>Total since {format(subscription.createdAt, "dd MMM yyyy")} </dd>
          <dd className="text-foreground/70">{totalCost}</dd>
        </div>
      </dl>
    </div>
  );
};

export default BottomSheetContent;
