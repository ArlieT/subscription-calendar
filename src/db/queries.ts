"use server";
import type { Cycle, Subscription } from "@prisma/client";
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
    const createdSubscriptions: Subscription[] = [];

    if (cycle === "MONTHLY") {
      // Loop through the months starting from the current month to nextyear of the same month and date
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth + i) % 12; // Wrap around to stay within 0-11
        const yearOffset = Math.floor((currentMonth + i) / 12); // Increment year after December

        // Create a new date for the next due date
        const nextDueDate = new Date(currentYear + yearOffset, monthIndex, exactDay);

        // Check if the nextDueDate is valid for the month
        if (nextDueDate.getDate() !== exactDay) {
          // If not valid, adjust to the last day of the month
          nextDueDate.setMonth(monthIndex + 1, 0); // Set to the last day of the month
        }

        // Create the subscription in the database
        const result = await db.subscription.create({
          data: {
            user_id,
            name,
            cost,
            cycle,
            dueDate: nextDueDate,
            icon,
          },
        });
        createdSubscriptions.push(result);
      }
    } else {
      // For yearly subscriptions
      for (let i = 0; i <= 1; i++) {
        const nextDueDate = new Date(dueDate); // Create a new instance of dueDate
        nextDueDate.setFullYear(nextDueDate.getFullYear() + i);

        // Create the subscription in the database
        const result = await db.subscription.create({
          data: {
            user_id,
            name,
            cost,
            cycle,
            dueDate: nextDueDate,
            icon,
          },
        });
        createdSubscriptions.push(result);
      }
    }

    return {
      success: true,
      message: "Subscriptions added successfully",
      data: createdSubscriptions,
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
