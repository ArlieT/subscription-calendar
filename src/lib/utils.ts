import { clsx, type ClassValue } from "clsx";
import { Subscription } from "src/types";
import { twMerge } from "tailwind-merge";
import { MOCK_SUBSCRIPTIONS } from "./constants";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  getDaysInMonth,
  startOfMonth,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomRgbColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

export const getInitials = (name: string) => {
  const names = name.trim().split(" ");
  if (names.length === 1) {
    return names[0].charAt(0);
  }
  return `${names[0].charAt(0)}${names[1].charAt(0)}`;
};

export function getFirstDayOfMonth(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  return firstDay.getDay(); // 0 for Sunday, 6 for Saturday
}

export function getLastDayOfMonth(date: Date) {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDay.getDay(); // 0 for Sunday, 6 for Saturday
}

export const getSubscriptionOfTheDay = (
  day: Date,
  subscriptions: Subscription[] | undefined,
  userId: string | undefined,
) => {
  if (!subscriptions && !MOCK_SUBSCRIPTIONS) return [];

  const source = userId ? subscriptions || [] : MOCK_SUBSCRIPTIONS;

  return source.filter((sub) => {
    const dueDate = new Date(sub.dueDate);

    switch (sub.cycle) {
      case "DAILY":
        // always due, every day
        return true;

      case "WEEKLY": {
        const dueDayOfWeek = getDay(dueDate); // 0 = Sunday, 1 = Monday, ...
        const currentDayOfWeek = getDay(day);

        return dueDayOfWeek === currentDayOfWeek;
      }

      case "MONTHLY": {
        const dueDay = Number(format(dueDate, "dd"));
        const currentDay = Number(format(day, "dd"));
        const daysInMonth = getDaysInMonth(day);

        if (dueDay > daysInMonth && currentDay === daysInMonth) {
          return true;
        }

        return dueDay === currentDay;
      }

      case "YEARLY": {
        // match month + day
        const dueMonthDay = format(dueDate, "MM-dd");
        const currentMonthDay = format(day, "MM-dd");
        return dueMonthDay === currentMonthDay;
      }

      default:
        // one-off (exact date match)
        return format(dueDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    }
  });
};

export function getAllDaysInMonth(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date),
  });
}

export function calculateMonthlyCost(
  subscriptions: Subscription[] | undefined,
): number {
  if (!subscriptions) return 0;

  return subscriptions.reduce((total, sub) => {
    switch (sub.cycle) {
      case "DAILY":
        return total + sub.cost * 30; // rough monthly
      case "MONTHLY":
        return total + sub.cost;
      case "YEARLY":
        return total + sub.cost / 12;
      default:
        return total;
    }
  }, 0);
}
