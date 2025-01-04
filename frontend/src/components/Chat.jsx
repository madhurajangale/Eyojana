import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/Chat.css';

const socket = io('http://localhost:5000'); // Ensure this URL matches your server's

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    setMessages(storedMessages);

    fetch('http://localhost:5000/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    socket.on('message', (message) => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, message];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (!username || !input) return;
    const message = { username, text: input };
    fetch('http://localhost:5000/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    }).catch(error => console.error("Error:", error));
    setInput('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>E-yojana Community Chat</h1>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="message-box">
              <strong>{msg.username}:</strong> {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        />
        <input
          type="text"
          placeholder="Enter your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;
