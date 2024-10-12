'use client';

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import MotionNumber from 'motion-number';
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
import { CommandDemo } from './ui/combo-box';
import { ComboboxDemo } from './ui/combo-box-1';

export default function EnhancedSubscriptionManagerComponent() {
  // Access the client
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [billingCycle, setBillingCycle] = useState<Cycle>(Cycle.MONTHLY);
  const [platform, setPlatformIcon] = useState({
    name: '',
    icon: '',
  });

  const addSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!dueDate) return;

    const newSubscription: Subscription = {
      id: Date.now(),
      name: platform.name,
      cost: parseFloat(formData.get('cost') as string),
      billingCycle: billingCycle,
      dueDate: new Date(dueDate),
      icon: platform.icon,
    };

    const result = await addsubscriptionDB(
      1,
      newSubscription.name,
      newSubscription.cost,
      newSubscription.billingCycle,
      newSubscription.dueDate,
      newSubscription.icon
    );

    console.log(result);
    if (data) {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    }
  };

  // Queries
  const { data } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => {
      return getSubscriptions(1);
    },
  });

  const totalMonthlyCost = data?.reduce((total, sub) => {
    return total + (sub.cycle === Cycle.MONTHLY ? sub.cost : sub.cost / 12);
  }, 0);

  return (
    <div className="my-10 w-full md:max-w-3xl p-6 md:border rounded-md">
      <div className="w-full flex-col flex gap-4">
        <div>
          <CardTitle>Subscription Manager</CardTitle>
          <CardDescription>
            Manage your subscriptions and view them on a calendar.
          </CardDescription>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
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
                variant="ghost"
                className="w-full bg-foreground text-background"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Subscription
              </Button>
            </form>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="w-full text-right text-secondary">
                <strong>
                  <span className="block text-lg font-bold">
                    Monthly Spend:
                  </span>
                  <MotionNumber
                    value={totalMonthlyCost || 0}
                    format={{ style: 'currency', currency: 'USD' }}
                    className="text-foreground text-lg"
                  />
                </strong>
              </div>
            </div>
          </div>
        </div>
        <CalendarFooter
          subscriptions={data || []}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
    </div>
  );
}
