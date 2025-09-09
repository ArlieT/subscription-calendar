import { cn } from "src/lib/utils";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Check, Loader, PlusCircle, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import AvatarFallbackColored from "./Avatar";
import { Subscription } from "src/types";
import MotionNumber from "motion-number";
import DropdownOptions from "./dropdown-menu";
import { DatePicker } from "src/components/ui/date-picker";
import { Cycle, Status } from "@prisma/client";
import { ComboboxDemo } from "./ui/combo-box";

type EditFormData = {
  name: string;
  description: string;
  cost: number;
  cycle: string;
  dueDate: Date;
  icon: string;
};

type Props = {
  selectedSubscription: Subscription[] | undefined;
  selectedDate: Date;
  handleDelete: (id: number | undefined) => void;
  handleEdit: (
    subscription: Subscription,
    formData: EditFormData,
  ) => Promise<void>;
};

const BottomSheetContent = ({
  selectedSubscription,
  selectedDate,
  handleDelete,
  handleEdit,
}: Props) => {
  const [totalCost, setTotalCost] = useState(0);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [billingCycle, setBillingCycle] = useState<Cycle>(Cycle.MONTHLY);
  const [platform, setPlatformIcon] = useState({
    name: "",
    icon: "",
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    cost: 0,
    cycle: "",
  });

  // Calculate total cost effect
  useEffect(() => {
    const calculateMonthsPassed = (startDate: Date, currentDate: Date) => {
      const start = new Date(startDate);
      const current = new Date(currentDate);
      const yearsDifference = current.getFullYear() - start.getFullYear();
      const monthsDifference = current.getMonth() - start.getMonth();
      const includedFirstMonth = 1;
      return yearsDifference * 12 + monthsDifference + includedFirstMonth;
    };

    setTotalCost(
      selectedSubscription?.reduce((acc, subscription) => {
        return (
          acc +
          subscription.cost *
            calculateMonthsPassed(subscription.createdAt, selectedDate)
        );
      }, 0) || 0,
    );
  }, [selectedSubscription, selectedDate]);

  const startEditing = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setEditFormData({
      name: subscription.name,
      description: subscription.description || "",
      cost: subscription.cost,
      cycle: subscription.cycle,
    });
    setPlatformIcon({
      name: subscription.name,
      icon: subscription.icon || "",
    });
    setBillingCycle(subscription.cycle);
    setDueDate(new Date(subscription.dueDate));
  };

  const cancelEditing = () => {
    setEditingSubscription(null);
    setEditFormData({
      name: "",
      description: "",
      cost: 0,
      cycle: "",
    });
    setPlatformIcon({ name: "", icon: "" });
    setBillingCycle(Cycle.MONTHLY);
    setDueDate(new Date());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingSubscription || !dueDate) return;

    const formData = new FormData(e.currentTarget);
    setIsLoading(true);

    try {
      const editData: EditFormData = {
        name: platform.name,
        description: formData.get("description") as string,
        cost: parseFloat(formData.get("cost") as string),
        cycle: billingCycle,
        dueDate: new Date(dueDate),
        icon: platform.icon,
      };

      await handleEdit(editingSubscription, editData);
      cancelEditing();
    } catch (error) {
      console.error("Error editing subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full h-full flex flex-col overscroll-y-auto gap-2")}>
      {selectedSubscription?.map((subscription) => (
        <div key={subscription.id} className="flex flex-col w-full p-2">
          {/* Action buttons */}
          <div className="flex w-fit self-end">
            {editingSubscription?.id !== subscription.id && (
              <DropdownOptions
                onEdit={() => startEditing(subscription)}
                onDelete={() => handleDelete(subscription.id)}
              />
            )}
          </div>

          {/* Edit form or display view */}
          {editingSubscription?.id === subscription.id ? (
            <form
              id={`edit-form-${subscription.id}`}
              onSubmit={handleSubmit}
              className="flex flex-col w-full gap-4"
            >
              {/* Platform and Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Platform</Label>
                  <ComboboxDemo
                    setPlatform={setPlatformIcon}
                    defaultValue={editingSubscription?.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    inputMode="numeric"
                    step="0.01"
                    defaultValue={editFormData.cost}
                    required
                  />
                </div>
              </div>

              {/* Billing Cycle and Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingCycle">Billing Cycle</Label>
                  <Select
                    required
                    value={billingCycle}
                    onValueChange={(value) => setBillingCycle(value as Cycle)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="DAILY">Daily</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <DatePicker
                    className="w-full max-w-full"
                    name="dueDate"
                    id="dueDate"
                    date={dueDate}
                    setDate={setDueDate}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  className="w-full max-w-full bg-transparent"
                  name="description"
                  id="description"
                  type="text"
                  defaultValue={editFormData.description}
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={cancelEditing}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Display view */
            <div className="flex items-center w-full justify-between">
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
                  Every {format(subscription.dueDate, "dd")}th
                </span>
                <span className="text-sm text-foreground/70">
                  Since {format(subscription.createdAt, "MMMM dd, yyyy")}
                </span>
                {subscription.description && (
                  <span className="text-sm text-foreground/70">
                    {subscription.description}
                  </span>
                )}
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
                  className="text-foreground text-lg md:text-xl"
                />
                <span className="text-foreground text-center bg-gray-500/20 py-1 px-3 rounded-lg capitalize text-sm">
                  {subscription.cycle.toLowerCase()}
                </span>
                <MotionNumber
                  value={totalCost}
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
          )}

          {/* Divider */}
          <div className="w-full h-[1px] my-8 bg-gray-500/10 rounded-full" />
        </div>
      ))}
    </div>
  );
};

export default BottomSheetContent;
