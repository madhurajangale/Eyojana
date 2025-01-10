import React, { useState, useEffect, useRef, useContext } from 'react';
import io from 'socket.io-client';
import '../styles/Chat.css';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import SendIcon from '@mui/icons-material/Send';

const socket = io('http://localhost:5000'); // Ensure this URL matches your server's

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const { login, user } = useContext(AuthContext);
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    // Prefill the username field as 'admin' if on /adminhome/chat
    if (window.location.pathname === '/adminhome/chat') {
      setUsername('Admin');
    } else {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/profile/${user.email}`);
          if (response.status === 200) {
            setUsername(response.data.data.username);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [user.email]);

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

  const sendMessage = () => {
    if (!username || !input) return;

    // Create a new message object
    const message = { 
      username, 
      text: input, 
      timestamp: new Date().toISOString() 
    };

    // Update the messages state immediately
    setMessages(prevMessages => [...prevMessages, message]);

    // Send the message to the server
    fetch('http://localhost:5000/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    }).catch(error => console.error("Error:", error));

    // Clear the input field
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 style={{ fontSize: '20px', color: '#779307'}}>E-yojana Community Chat</h1>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.username === 'Admin' ? 'admin-message' : msg.username === username ? 'my-message' : 'other-message'
            }`}
            
          >
            <div className="message-box">
              <strong>{msg.username}:</strong> 
              {msg.text}
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> 
      </div>
      <div className='message-input-container'>
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="username-input"
            disabled
          />
          <input
            type="text"
            placeholder="Enter your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="message-input"
          />
          <button onClick={sendMessage} className="send-button"><SendIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
