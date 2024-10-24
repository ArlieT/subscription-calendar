"use server";
import type { Cycle } from "@prisma/client";
import db from "./index";

export const addSubscription = async (
  user_id: string,
  name: string,
  cost: number,
  cycle: Cycle,
  dueDate: Date,
  icon?: string
) => {
  try {
    const currentMonth = new Date().getMonth(); // 0-11 for Jan-Dec
    const currentYear = new Date().getFullYear();
    const exactDay = dueDate.getDate(); // Get the day of the month
    const subscriptionsToCreate = [];

    if (cycle === "MONTHLY") {
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth + i) % 12;
        const yearOffset = Math.floor((currentMonth + i) / 12);
        const nextDueDate = new Date(
          currentYear + yearOffset,
          monthIndex,
          exactDay
        );

        if (nextDueDate.getDate() !== exactDay) {
          nextDueDate.setMonth(monthIndex + 1, 0);
        }

        subscriptionsToCreate.push({
          user_id,
          name,
          cost,
          cycle,
          dueDate: nextDueDate,
          icon,
        });
      }
    } else {
      for (let i = 0; i <= 1; i++) {
        const nextDueDate = new Date(dueDate);
        nextDueDate.setFullYear(nextDueDate.getFullYear() + i);

        subscriptionsToCreate.push({
          user_id,
          name,
          cost,
          cycle,
          dueDate: nextDueDate,
          icon,
        });
      }
    }

    const result = await db.subscription.createMany({
      data: subscriptionsToCreate,
    });

    return {
      success: true,
      message: "Subscriptions added successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error adding subscription:", error);
    return {
      success: false,
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

    const data = await sanitizeData(subscriptions);

    return data;
  } catch (error) {
    console.error("Error getting subscriptions:", error);
    return [];
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
    console.error("Error removing subscription:", error);
    return {
      error,
    };
  }
}
