import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

// Implementation Detail
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatResponse {
   id: string;
   message: string;
}

// Public Interface
export const chatService = {
   sendMessage: async (prompt: string, conversationId: string): Promise<ChatResponse> => {
      const response = await client.responses.create({
         model: 'gpt-4.1-nano-2025-04-14',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 200,
         previous_response_id: conversationRepository.getLastResponseId(conversationId),
      });
      conversationRepository.setLastResponseId(conversationId, response.id);
      return { id: response.id, message: response.output_text };
   },
};
