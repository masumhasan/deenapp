'use server';
/**
 * @fileOverview An AI agent that answers questions about Fiqh.
 *
 * - answerFiqhQuery - A function that answers Fiqh questions.
 * - AnswerFiqhQueryInput - The input type for the answerFiqhQuery function.
 * - AnswerFiqhQueryOutput - The return type for the answerFiqhQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFiqhQueryInputSchema = z.object({
  query: z.string().describe('The question about Fiqh.'),
});
export type AnswerFiqhQueryInput = z.infer<typeof AnswerFiqhQueryInputSchema>;

const AnswerFiqhQueryOutputSchema = z.object({
  answer: z.string().describe('The answer to the Fiqh question.'),
});
export type AnswerFiqhQueryOutput = z.infer<typeof AnswerFiqhQueryOutputSchema>;

export async function answerFiqhQuery(input: AnswerFiqhQueryInput): Promise<AnswerFiqhQueryOutput> {
  return answerFiqhQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFiqhQueryPrompt',
  input: {schema: AnswerFiqhQueryInputSchema},
  output: {schema: AnswerFiqhQueryOutputSchema},
  prompt: `You are an expert in Fiqh (Islamic jurisprudence). Answer the following question about Fiqh to the best of your ability.\n\nQuestion: {{{query}}}`,
});

const answerFiqhQueryFlow = ai.defineFlow(
  {
    name: 'answerFiqhQueryFlow',
    inputSchema: AnswerFiqhQueryInputSchema,
    outputSchema: AnswerFiqhQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
