import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

// Implementation Detail
const chatSchema = z.strictObject({
   prompt: z.string().trim().min(1, 'prompt is required').max(1000, 'prompt is too long (max 1000 characters)'),
   conversationId: z.string().uuid(),
});

// Public Interface
export const chatController = {
   sendMessage: async (req: Request, res: Response) => {
      // Validate Input
      const { success, error } = chatSchema.safeParse(req.body);
      if (!success) {
         res.status(400).json({ error: z.treeifyError(error) });
         return;
      }

      // Business Logic
      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);
         res.json({ message: response.message });
         return;
      } catch (error) {
         console.log(error);
         res.status(500).json({ error: 'Failed to generate response' });
         return;
      }
   },
};
