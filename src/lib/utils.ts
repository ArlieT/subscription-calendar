import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
