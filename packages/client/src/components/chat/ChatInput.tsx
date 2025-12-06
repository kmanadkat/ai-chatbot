import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

export interface ChatFormData {
   prompt: string;
}

interface Props {
   onSubmit: (data: ChatFormData) => void;
}

const ChatInput = ({ onSubmit }: Props) => {
   const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

   const handleFormSubmit = handleSubmit((data) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleFormSubmit();
      }
   };

   return (
      <form
         onSubmit={handleFormSubmit}
         onKeyDown={handleKeyDown}
         className="flex flex-col gap-4 items-end shadow-md rounded-2xl px-6 py-4 mt-4 bg-neutral-800"
      >
         <textarea
            {...register('prompt', { required: true, validate: (data) => data.trim().length > 0 })}
            className="w-full border-0 focus:outline-0 resize-none text-white"
            placeholder="Ask anything..."
            maxLength={1000}
            autoFocus
         ></textarea>
         <Button disabled={!formState.isValid} type="submit" className="rounded-full w-9 h-9">
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
