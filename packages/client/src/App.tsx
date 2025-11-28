import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
  }, [])

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export default App
