import React, { useState, useEffect,useContext } from 'react';
import io from 'socket.io-client';
import '../styles/Chat.css';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
const socket = io('http://localhost:5000'); // Ensure this URL matches your server's

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const { login, user } = useContext
  (AuthContext);
  console.log(login);
  useEffect(() => {
    // Fetch messages from the server
    fetch('http://localhost:5000/messages')
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for new messages
    socket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => socket.disconnect();
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/profile/${user.email}`);
        console.log(response)
        if (response.status === 200) {
          setUsername(response.data.data.username); // Populate userData state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user.email]);
  const sendMessage = () => {
    if (!username || !input) return;
    const message = { username, text: input, timestamp: new Date().toISOString() };
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
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
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
