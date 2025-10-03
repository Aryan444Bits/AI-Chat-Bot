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
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', 'dark');
    // TODO: Fetch previous chats from the backend API
    // Example integration point (add here):
    // - GET /api/chats -> returns [{ id, title, lastMessage, createdAt }, ...]
    // - On success: setPreviousChats(response.data)
    // Note: switch from storing plain strings to storing objects like { id, title }
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
    // Example integration point (add here):
    // - POST /api/chats/:chatId/messages with body { text }
    //   or POST /api/messages with { chatId, text }
    // - Backend returns the AI reply and/or stores the message
    // - On success: append AI message to state and setIsTyping(false)
    // For now we simulate network/processing delay
    setTimeout(() => {
      const aiMessage = { text: `Echo: ${userInput}`, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsTyping(false);
    }, 800);

    setUserInput('');
  };

  const handleNewChat = () => {
    // Ask the user for a chat name, then create it locally (or call API)
    // Example integration point (add here):
    // - POST /api/chats with body { title }
    // - Backend returns created chat { id, title }
    // - On success: prepend returned chat to previousChats and set selected chat id/index
    const name = window.prompt('Enter a name for the new chat');
    if (name === null) return; // user cancelled
    const title = name.trim() === '' ? `New Chat ${new Date().toLocaleTimeString()}` : name.trim();
    setPreviousChats((prev) => [title, ...prev]);
    setSelectedChatIndex(0);
    setMessages([]);
    setUserInput('');
  };

  const handleSelectChat = (index) => {
    setSelectedChatIndex(index);
    // In a real app: fetch messages for the chat id. For now clear messages to show intro
    setMessages([]);
    // Example integration point (add here):
    // - If you store chats as objects with id: GET /api/chats/:chatId/messages
    // - On success: setMessages(response.data.messages)
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
        onSelectChat={handleSelectChat}
        selectedIndex={selectedChatIndex}
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
