'use server';
import db from './index';
import type { Cycle, Subscription } from '@prisma/client';

export const addSubscription = async (
  user_id: string,
  name: string,
  cost: number,
  cycle: Cycle,
  dueDate: Date,
  icon?: string
) => {
  try {
    const subscription = await db.subscription.create({
      data: {
        user_id,
        name,
        cost,
        cycle,
        dueDate,
        icon,
      },
    });
    console.log({ subscription });
    return subscription;
  } catch (error) {
    console.error('Error adding subscription:', error);
    return {
      error,
    };
  }
};

export async function sanitizeData(data: any) {
  return JSON.parse(JSON.stringify(data));
}
export const getSubscriptions = async (userId?: string) => {
  try {
    if (!userId) {
      return [];
    }

    const subscriptions = await db.subscription.findMany({
      where: { user_id: userId },
    });

    if (!subscriptions) return [];

    console.log({ data: subscriptions });
    const data = await sanitizeData(subscriptions);

    return data;
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
};
type GetSubscriptionRreturnType = ReturnType<Awaited<typeof getSubscriptions>>;

export async function removeSubscription(id: number) {
  try {
    const subscription = await db.subscription.delete({
      where: { id },
    });
    console.log({ subscription });
    return subscription;
  } catch (error) {
    console.error('Error removing subscription:', error);
    return {
      error,
    };
  }
}
