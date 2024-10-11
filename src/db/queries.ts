'use server';
import db from './index';
import type { Cycle, Subscription } from '@prisma/client';

export const addSubscription = async (
  userId: number,
  name: string,
  cost: number,
  billingCycle: Cycle,
  dueDate: Date,
  icon?: string
) => {
  try {
    const subscription = await db.subscription.create({
      data: {
        userId,
        name,
        cost,
        cycle: billingCycle,
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

export const getSubscriptions = async (userId: number) => {
  try {
    const subscriptions = await db.subscription.findMany({
      where: { userId },
    });

    if (!subscriptions) return [];

    const data = subscriptions;

    console.log({ data });
    return data;
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    throw error;
  }
};

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
