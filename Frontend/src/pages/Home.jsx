import React, { useState, useEffect } from 'react';
import { FiMenu, FiPlus, FiSend } from 'react-icons/fi';
import '../styles/theme.css';
import '../styles/Home.css';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [previousChats, setPreviousChats] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.setAttribute('data-theme', 'dark');
    // TODO: Fetch previous chats from the backend API
    setPreviousChats(['Edushala website search', 'App aur website integration', 'Resume formatting update']);
    // TODO: Fetch initial messages for the current chat or a welcome message
    setMessages([{ text: "Hey! How's it going?", sender: 'ai' }]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (userInput.trim() === '') return;

    const userMessage = { text: userInput, sender: 'user' };
    setMessages([...messages, userMessage]);

    // TODO: Send user input to the backend API and get the AI response
    setTimeout(() => {
      const aiMessage = { text: `Echo: ${userInput}`, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    }, 500);

    setUserInput('');
  };

  const handleNewChat = () => {
    // TODO: Call an API to create a new chat session
    // Reset messages and set a new chat ID if applicable
    setMessages([{ text: "Hey! How's it going?", sender: 'ai' }]);
    setUserInput('');
  };

  return (
    <div className="home-container">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3>ChatGPT</h3>
          <div className="sidebar-new-chat" onClick={handleNewChat}>
            <FiPlus />
            <span>New Chat</span>
          </div>
        </div>
        <FiMenu className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <h2>Chats</h2>
        <ul>
          {/* TODO: When a previous chat is clicked, fetch its messages from the API */}
          {previousChats.map((chat, index) => (
            <li key={index}>{chat}</li>
          ))}
        </ul>
      </aside>
      <main className={`chat-container ${!isSidebarOpen ? 'full-width' : ''}`}>
        <header className="chat-header">
          <FiMenu className="menu-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          <h3>ChatGPT</h3>
        </header>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              <div className="message-avatar">{message.sender === 'ai' ? 'AI' : 'U'}</div>
              <div className="text">{message.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask anything..."
            />
            <button type="submit">
              <FiSend />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Home;
