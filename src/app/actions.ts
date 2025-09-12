"use server";

import { intelligentTextCleaning } from "@/ai/flows/intelligent-text-cleaning";

export async function cleanTextWithAI(text: string) {
  try {
    const result = await intelligentTextCleaning({
      text: text,
      userConsent: true,
    });
    return result;
  } catch (error: any) {
    console.error("Error in cleanTextWithAI action:", error);
    throw new Error(error.message || "Failed to clean text with AI.");
  }
}
