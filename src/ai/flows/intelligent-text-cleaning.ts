'use server';

/**
 * @fileOverview Cleans and normalizes text using generative AI, correcting typographical errors and suggesting readability improvements based on context with explicit user consent.
 *
 * - intelligentTextCleaning - A function that handles the intelligent text cleaning process.
 * - IntelligentTextCleaningInput - The input type for the intelligentTextCleaning function.
 * - IntelligentTextCleaningOutput - The return type for the intelligentTextCleaning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentTextCleaningInputSchema = z.object({
  text: z.string().describe('The text to be cleaned and normalized.'),
  userConsent: z
    .boolean()
    .describe(
      'A boolean value indicating whether the user has given explicit consent to clean the text.'
    ),
});
export type IntelligentTextCleaningInput = z.infer<
  typeof IntelligentTextCleaningInputSchema
>;

const IntelligentTextCleaningOutputSchema = z.object({
  cleanedText: z.string().describe('The cleaned and normalized text.'),
});
export type IntelligentTextCleaningOutput = z.infer<
  typeof IntelligentTextCleaningOutputSchema
>;

export async function intelligentTextCleaning(
  input: IntelligentTextCleaningInput
): Promise<IntelligentTextCleaningOutput> {
  return intelligentTextCleaningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentTextCleaningPrompt',
  input: {schema: IntelligentTextCleaningInputSchema},
  output: {schema: IntelligentTextCleaningOutputSchema},
  prompt: `You are an AI assistant specializing in text cleaning and normalization. You correct typographical errors and improve readability based on context. Only perform the cleaning if the user has explicitly given consent.

Original Text: {{{text}}}
User Consent: {{{userConsent}}}

Instructions:
- If userConsent is true, clean the text by correcting typographical errors and suggesting improvements for readability based on context.
- If userConsent is false, return the original text without any changes.

Cleaned Text:`, // Ensure the prompt returns the original text if no consent.
});

const intelligentTextCleaningFlow = ai.defineFlow(
  {
    name: 'intelligentTextCleaningFlow',
    inputSchema: IntelligentTextCleaningInputSchema,
    outputSchema: IntelligentTextCleaningOutputSchema,
  },
  async input => {
    if (!input.userConsent) {
      return {cleanedText: input.text}; // Return original text if no consent.
    }
    const {output} = await prompt(input);
    return {
      cleanedText: output?.cleanedText ?? input.text, // Ensure a string is returned even if output is undefined.
    };
  }
);
