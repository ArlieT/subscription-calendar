'use client';

import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComboboxDemo } from '@/components/ui/combo-box';

import { Subscription } from 'src/types';
import { DatePicker } from './ui/date-picker';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import CalendarFooter from './calendar-footer';
import {
  addSubscription as addsubscriptionDB,
  getSubscriptions,
} from 'src/db/queries';
import { Cycle } from '@prisma/client';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useUser, useSession } from '@clerk/nextjs';
import useSupabaseClient from '@/lib/hooks/useSupabaseClient';

export default function SubscriptionCalendar() {
  // Access the client
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [billingCycle, setBillingCycle] = useState<Cycle>(Cycle.MONTHLY);
  const [platform, setPlatformIcon] = useState({
    name: '',
    icon: '',
  });

  const client = useSupabaseClient();

  const addSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!dueDate) return;

    const newSubscription: Subscription = {
      name: platform.name,
      cost: parseFloat(formData.get('cost') as string),
      cycle: billingCycle,
      dueDate: new Date(dueDate),
      icon: platform.icon,
    };

    // const result = await addsubscriptionDB(
    //   1,
    //   newSubscription.name,
    //   newSubscription.cost,
    //   newSubscription.billingCycle,
    //   newSubscription.dueDate,
    //   newSubscription.icon
    // );

    // console.log(result);
    const test = await client.from('subscriptions').insert({
      ...newSubscription,
    });

    console.log({ test });
  };

  // Queries
  const { data } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => {
      return getSubscriptions(1);
    },
  });

  const { user } = useUser();
  // The `useSession()` hook will be used to get the Clerk `session` object
  const { session } = useSession();

  return (
    <Card className="relative md:max-w-2xl mx-auto bg-background border-none w-full h-full flex-col flex justify-center items-center gap-4 p-2 py-4 overflow-y-auto rounded-none">
      <div className="w-full">
        <CardTitle className="p-0">Subscription Manager</CardTitle>
        <CardDescription>
          Manage your subscriptions and view them on a calendar.
        </CardDescription>
      </div>
      <div className="grid gap-6 border w-full">
        <div>
          <h3 className="text-lg font-semibold mb-4">Add New Subscription</h3>
          <form onSubmit={addSubscription} className="space-y-4">
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
              className="bg-primary-foreground text-background w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Subscription
            </Button>
          </form>
        </div>
      </div>
      <CalendarFooter
        subscriptions={data || []}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </Card>
  );
}
