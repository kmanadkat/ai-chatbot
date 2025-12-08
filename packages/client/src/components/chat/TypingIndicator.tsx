interface DotProps {
   className?: string;
}

const Dot = ({ className }: DotProps) => {
   return <div className={`w-2 h-2 rounded-full bg-gray-400 animate-pulse ${className}`}></div>;
};

const TypingIndicator = () => {
   return (
      <div className="flex gap-1 p-3 bg-neutral-800 rounded-xl self-start">
         <Dot />
         <Dot className="[animation-delay:0.2s]" />
         <Dot className="[animation-delay:0.4s]" />
      </div>
   );
};

export default TypingIndicator;
