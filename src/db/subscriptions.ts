"use server";
import type { Cycle } from "@prisma/client";
import db from "./prisma";
import { Subscription } from "src/types";

export const addSubscription = async (
  subscription: Omit<Subscription, "id" | "createdAt" | "updatedAt">,
) => {
  try {
    const { name, description, cost, cycle, tags, icon, dueDate, user_id } =
      subscription;

    if (!subscription.user_id) {
      throw new Error("User ID is required");
    }

    // Check if user_id exists in the User table
    const userExists = await db.user.findUnique({
      where: { user_id },
    });

    if (!userExists) {
      return {
        success: false,
        message: "User not found. Please provide a valid user_id.",
      };
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const exactDay = dueDate.getDate();

    //TODO dont create multiple
    // create just one then just check the day to render in the calendar

    const result = await db.subscription.create({
      data: {
        name,
        cost,
        cycle,
        startDate: new Date(currentYear, currentMonth, exactDay), //todo reomove
        dueDate,
        icon,
        tags,
        description,
        user_id,
      },
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

export const editSubscription = async (
  newSubscription: Omit<Subscription, "createdAt" | "updatedAt">,
) => {
  try {
    if (!newSubscription.id) {
      throw new Error("Invalid subscription ID");
    }

    const result = await db.subscription.update({
      where: { id: +newSubscription.id },
      data: {
        name: newSubscription.name,
        cost: newSubscription.cost,
        cycle: newSubscription.cycle,
        startDate: new Date(),
        dueDate: new Date(newSubscription.dueDate),
        icon: newSubscription.icon,
        tags: newSubscription.tags,
        description: newSubscription.description,
      },
    });

    return {
      success: true,
      message: "Subscription updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error editing subscription:", error);
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
    return subscription;
  } catch (error) {
    console.error("Error removing subscription:", error);
    return {
      error,
    };
  }
}
