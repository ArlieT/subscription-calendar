import type { Cycle } from '@prisma/client';
export type Subscription = {
  id: number;
  name: string;
  cost: number;
  billingCycle: Cycle;
  dueDate: Date;
  icon?: string;
};
