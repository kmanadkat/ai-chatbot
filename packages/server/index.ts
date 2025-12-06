import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
   res.json({ message: 'API Running' });
});

const conversations = new Map<string, string>();

app.post('/api/chat', async (req: Request, res: Response) => {
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
