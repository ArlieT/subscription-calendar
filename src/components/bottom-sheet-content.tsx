import { cn, getRandomRgbColor } from "@/lib/utils";
import { Subscription } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Trash } from "lucide-react";
import { format } from "date-fns";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  sub: Subscription;
  selectedSubscription: Subscription[];
  isLast: boolean;
  handleDelete: (id: number) => void;
};

const BottomSheetContent = ({
  sub,
  selectedSubscription,
  isLast,
  handleDelete,
}: Props) => {
  const [totalCost, setTotalCost] = useState(0);
  return (
    <div
      key={sub.id}
      className={cn("w-full flex gap-2", {
        "border-b pb-2 p-1":
          selectedSubscription && !isLast && selectedSubscription?.length > 1,
      })}
    >
      <dl className="w-full space-y-1 p-2">
        <div className="flex gap-x-2 items-center justify-between w-full">
          <div className="flex gap-x-2 items-center">
            <dt key={sub.id} className={cn("")}>
              <Avatar className="outline h-6 w-6 rounded-full relative bg- overflow-hidden">
                <AvatarImage
                  src={sub?.icon || ""}
                  alt={sub.name}
                  className="h-6 w-6 rounded-full"
                />
                <AvatarFallback
                  style={{ backgroundColor: getRandomRgbColor() }}
                  className="h-6 w-6 rounded-full flex justify-center items-center text-xs"
                >
                  {sub.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </dt>
            <dd className="ml-2 font-bold text-lg">{sub.name}</dd>
          </div>
          <Button
            variant="destructive"
            className="w-auto px-4 md:size-12 md:max-h-10"
            onClick={() => handleDelete(sub.id)}
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
          {sub.cycle === "MONTHLY" ? (
            <>
              <dd>Every &nbsp;{format(sub.dueDate, "io")}</dd>
              <dd className="text-foreground/70">Nexth payment</dd>
            </>
          ) : (
            <>
              <dd>
                {format(
                  new Date(
                    new Date(sub.dueDate).setFullYear(
                      new Date(sub.dueDate).getFullYear() + 1
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
          <dd>Total since {format(sub.createdAt, "dd MMM yyyy")} </dd>
          <dd className="text-foreground/70">{totalCost}</dd>
        </div>
      </dl>
    </div>
  );
};

export default BottomSheetContent;
