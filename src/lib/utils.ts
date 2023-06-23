import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = (text: string) => {
  try {
    navigator.clipboard.writeText(text);
  } catch (error) {
    console.log("Cannot copy text");
  }
};

export function getCurrentURL() {
  if (typeof window !== undefined) {
    return window.location.origin;
  } else {
    return null;
  }
}
