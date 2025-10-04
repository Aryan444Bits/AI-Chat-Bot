import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatScreen.css';

const ChatScreen = ({ chat }) => {
  const [messages, setMessages] = useState(chat ? chat.messages : []);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(chat ? chat.messages : []);
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If there's no initial chat, but we have messages, it means a new chat has started.
  const isNewChat = !chat && messages.length > 0;

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessages = [...messages, { sender: 'user', text: input }];
      setMessages(newMessages);
      
      // TODO: Add your API call here to get the AI response
      // You can use fetch() or axios to send the 'input' to your backend
      // and then update the messages with the response.
      
      // Simulate AI response
      setTimeout(() => {
        setMessages([...newMessages, { sender: 'ai', text: `Echo: ${input}` }]);
      }, 500);
      setInput('');
    }
  };

  if (!chat || messages.length === 0) {
    return (
      <div className="chat-screen">
        <div className="welcome-screen">
          <h1>ChaGpt Clone</h1>
          <p>A lightweight, responsive AI chat experience — clean, fast, and privacy-friendly.</p>
          <p>Start typing below to begin your conversation</p>
        </div>
        <div className="chat-input">
          <form onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
            />
            <button type="submit">➢</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-screen">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-bubble">
              <span className="sender-icon">{message.sender === 'user' ? 'U' : 'AI'}</span>
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <form onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
          />
          <button type="submit">➢</button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
