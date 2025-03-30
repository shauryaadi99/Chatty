import { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import "./App.css";

const socket = io.connect("http://localhost:5000");
const userName = nanoid(4);

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendChat = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat", { message, userName });
      setMessage("");
    }
  };

  useEffect(() => {
    const receiveChat = (payload) => {
      setChat((prevChat) => [...prevChat, payload]);
    };

    socket.on("chat", receiveChat);

    return () => {
      socket.off("chat", receiveChat);
    };
  }, []);

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Chatty</h1>
      </header>
      <div className="chat-messages">
        {chat.map((payload, index) => (
          <div key={index} className={`message ${payload.userName === userName ? "user-message" : "bot-message"}`}>
            <p>{payload.message}</p>
            <span>ID: {payload.userName}</span>
          </div>
        ))}
      </div>
      <form className="chat-input" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
