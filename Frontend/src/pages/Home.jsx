import React, { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import Sidebar from '../components/sidebar/Sidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import '../styles/theme.css';
import '../styles/Home.css';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [previousChats, setPreviousChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    document.body.setAttribute('data-theme', 'dark');
    // TODO: Fetch previous chats from the backend API
    setPreviousChats(['Edushala website search', 'App aur website integration', 'Resume formatting update']);
    // start with no messages so the intro screen is visible
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (userInput.trim() === '') return;

    const userMessage = { text: userInput, sender: 'user' };
    // append the user message reliably
    setMessages((prev) => [...prev, userMessage]);

    // show typing indicator while waiting for AI reply
    setIsTyping(true);

    // TODO: Send user input to the backend API and get the AI response
    // simulate network/processing delay
    setTimeout(() => {
      const aiMessage = { text: `Echo: ${userInput}`, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 800);

    setUserInput('');
  };

  const handleNewChat = () => {
    // TODO: Call an API to create a new chat session
    // Reset messages and set a new chat ID if applicable
    setMessages([]);
    setUserInput('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="home-container">
      <Sidebar
        previousChats={previousChats}
        onNewChat={handleNewChat}
        isSidebarOpen={isSidebarOpen}
      />
      <FiMenu className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar" />
      <main className={`chat-container ${!isSidebarOpen ? 'full-width' : ''}`}>
        <ChatHeader onToggleSidebar={toggleSidebar} />
          {/* Intro overlay: visible when there are no messages and input is empty */}
          {(messages.length === 0 && userInput.trim() === '') && (
            <div className="intro-overlay" role="region" aria-label="Welcome">
              <div className="intro-card">
                <h1 className="intro-title">ChaGpt Clone</h1>
                <p className="intro-subtitle">A lightweight, responsive AI chat experience — clean, fast, and privacy-friendly.</p>
                <p className="intro-hint">Start typing below to begin your conversation</p>
              </div>
            </div>
          )}
        <ChatMessages messages={messages} typing={isTyping} />
        <ChatInput
          userInput={userInput}
          onUserInput={(e) => setUserInput(e.target.value)}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
};

export default Home;
