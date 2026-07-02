import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ApiValidationError {
  title?: string;
  errors?: Record<string, string[]>;
  message?: string;
}

/** Extracts a human-readable message from any API error response */
export function extractApiError(error: unknown): string {
  if (!error || typeof error !== "object") return "An unexpected error occurred.";

  const axiosError = error as { response?: { data?: ApiValidationError } };
  const data = axiosError.response?.data;

  if (!data) {
    const msgError = error as { message?: string };
    return msgError.message || "An unexpected error occurred.";
  }

  // .NET validation error format: { errors: { Field: ["msg"] } }
  if (data.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors).flat();
    if (messages.length > 0) return messages.join(" ");
  }

  return data.message || data.title || "An unexpected error occurred.";
}
