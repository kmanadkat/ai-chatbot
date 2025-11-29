import { useState, useEffect } from 'react';
import './App.css';
import { Button } from './components/ui/button';

function App() {
   const [message, setMessage] = useState<string>('');

   useEffect(() => {
      fetch('/api/hello')
         .then((response) => response.json())
         .then((data) => setMessage(data.message));
   }, []);

   return (
      <div className="p-4">
         <h1 className="font-bold text-2xl text-purple-400">{message}</h1>
         <Button className="my-4"> Click me!</Button>
      </div>
   );
}

export default App;
