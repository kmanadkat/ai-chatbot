import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

interface FormData {
   prompt: string;
}

interface ChatResponse {
   message: string;
}

interface Message {
   content: string;
   role: 'user' | 'bot';
}

const Chatbot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const formRef = useRef<HTMLFormElement | null>(null);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', { prompt, conversationId: conversationId.current });
      setIsBotTyping(false);
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   // Auto Scroll to Bottom
   useEffect(() => {
      if (formRef.current) {
         formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   return (
      <div>
         <div>
            <div className="flex flex-col gap-2">
               {messages.map((message, index) => (
                  <p
                     key={index}
                     className={`px-3 py-1 rounded-xl ${
                        message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'
                     }`}
                  >
                     <ReactMarkdown>{message.content}</ReactMarkdown>
                  </p>
               ))}
               {isBotTyping && (
                  <div className="flex gap-1 p-3 bg-gray-200 rounded-xl self-start">
                     <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
                     <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
                     <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
                  </div>
               )}
            </div>
         </div>
         <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-4 items-end border-2 rounded-xl p-4 mt-4"
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
