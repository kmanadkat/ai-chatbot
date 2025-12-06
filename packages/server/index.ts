import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.json({ message: 'API Running' });
});

const conversations = new Map<string, string>();
const chatSchema = z.strictObject({
   prompt: z.string().trim().min(1, 'prompt is required').max(1000, 'prompt is too long (max 1000 characters)'),
   conversationId: z.string().uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const { success, error } = chatSchema.safeParse(req.body);

   if (!success) {
      res.status(400).json({ error: z.treeifyError(error) });
      return;
   }

   const { prompt, conversationId } = req.body;
   console.log('Before: ', conversations);

   const response = await client.responses.create({
      model: 'gpt-4.1-nano-2025-04-14',
      input: prompt,
      temperature: 0.2,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
   });
   conversations.set(conversationId, response.id);
   console.log('After: ', conversations);

   res.json({ message: response.output_text });
   return;
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Server started on port http://localhost:${port}`);
});
