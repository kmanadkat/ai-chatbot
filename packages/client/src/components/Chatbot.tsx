import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

interface FormData {
   prompt: string;
}

interface ChatResponse {
   message: string;
}

const Chatbot = () => {
   const [messages, setMessages] = useState<string[]>([]);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, prompt]);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', { prompt, conversationId: conversationId.current });
      setMessages((prev) => [...prev, data.message]);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div>
            {messages.map((message, index) => (
               <div key={index}>{message}</div>
            ))}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-4 items-end border-2 rounded-xl p-4"
         >
            <textarea
               {...register('prompt', { required: true, validate: (data) => data.trim().length > 0 })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask anything..."
               maxLength={1000}
            ></textarea>
            <Button disabled={!formState.isValid} type="submit" className="rounded-full w-9 h-9">
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default Chatbot;
