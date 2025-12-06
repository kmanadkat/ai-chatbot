import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export interface Message {
   content: string;
   role: 'user' | 'bot';
}

interface Props {
   messages: Message[];
}

const ChatMessages = ({ messages }: Props) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   const onCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   // Auto Scroll to Bottom
   useEffect(() => {
      if (lastMessageRef.current) {
         lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   return (
      <div className="flex flex-col gap-3">
         {messages.map((message, index) => (
            <div
               onCopy={onCopy}
               key={index}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               className={`px-3 py-1 rounded-xl ${
                  message.role === 'user' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'
               }`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessages;
