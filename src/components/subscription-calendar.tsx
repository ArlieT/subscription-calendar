"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ComboboxDemo } from "@/components/ui/combo-box";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClerk, useUser } from "@clerk/nextjs";
import { Cycle } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import {
  addSubscription as addsubscriptionDB,
  getSubscriptions,
} from "src/db/subscriptions";
import { Subscription } from "src/types";
import CalendarMain from "./calendar-footer";
import Toast from "./toat";
import { DatePicker } from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ToastState = {
  isOpen: boolean;
  text: string;
  header?: string;
  status: "success" | "error";
};

export default function SubscriptionCalendar() {
  // Access the client
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    text: "",
    status: "success",
    header: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [billingCycle, setBillingCycle] = useState<Cycle>(Cycle.MONTHLY);
  const [platform, setPlatformIcon] = useState({
    name: "",
    icon: "",
  });

  const { user } = useUser();
  const { openSignIn } = useClerk();

  const addSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);

      if (!dueDate) return;

      const newSubscription: Subscription = {
        name: platform.name,
        cost: parseFloat(formData.get("cost") as string),
        cycle: billingCycle,
        dueDate: new Date(dueDate),
        icon: platform.icon,
      };

      if (!user?.id) {
        openSignIn();
        return;
      }

      const result = await addsubscriptionDB(
        user?.id,
        newSubscription.name,
        newSubscription.cost,
        newSubscription.cycle,
        newSubscription.dueDate,
        newSubscription.icon,
      );

      if (!result.error) {
        setToast({
          isOpen: true,
          text: "Subscriptions added!",
          status: "success",
        });
      } else {
        setToast({
          isOpen: true,
          text: "Something went wrong! please try again.",
          status: "error",
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
    } catch {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Queries
  const { data } = useQuery({
    queryKey: ["subscriptions", user?.id],
    queryFn: () => {
      return getSubscriptions(user?.id);
    },
    enabled: !!user?.id,
  });

  return (
    <Card className="md:max-w-2xl mx-auto bg-background border-none w-full h-full flex-col flex justify-center items-center gap-4 p-2 py-4 overflow-y-auto rounded-none">
      <div className="w-full">
        <CardTitle className="p-0">Subscription Manager</CardTitle>
        <CardDescription>
          Manage your subscriptions and view them on a calendar.
        </CardDescription>
      </div>
      <div className="grid gap-6 w-full">
        <div>
          <form onSubmit={addSubscription} className="space-y-4 text-zinc-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Platform</Label>
                <div className="space-y-2">
                  <ComboboxDemo setPlatform={setPlatformIcon} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  inputMode="numeric"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select
                  required
                  onValueChange={(value) => setBillingCycle(value as Cycle)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
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

            <Button
              type="submit"
              variant="default"
              className="bg-primary-foreground/90 text-background w-full"
            >
              {isLoading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Subscription
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      <CalendarMain
        subscriptions={data}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <Toast.Root
        isOpen={toast.isOpen}
        closeToast={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        status={toast.status}
      >
        <Toast.Header>{toast.header}</Toast.Header>

        <Toast.Body>{toast.text || ""}</Toast.Body>
      </Toast.Root>
    </Card>
  );
}
