import React, { useState, useEffect, useRef } from 'react';
import { socketService, chatAPI } from '../services/api';
import '../styles/ChatScreen.css';

const ChatScreen = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Reset messages when chat changes
    setMessages([]);
    setIsLoadingMessages(false);
    
    if (chat) {
      // Fetch chat messages from backend
      const fetchMessages = async () => {
        try {
          setIsLoadingMessages(true);
          const response = await chatAPI.getMessages(chat._id);
          if (response.messages) {
            // Transform backend messages to frontend format
            const transformedMessages = response.messages.map(msg => ({
              content: msg.content,
              role: msg.role,
              timestamp: new Date(msg.createdAt),
            }));
            // Reverse to show oldest first (backend returns newest first)
            setMessages(transformedMessages.reverse());
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setIsLoadingMessages(false);
        }
      };
      fetchMessages();
    }
  }, [chat]);

  useEffect(() => {
    // Set up socket listener for AI responses
    const handleAIResponse = (response) => {
      if (response.chat === chat?._id) {
        setMessages(prev => [
          ...prev,
          {
            content: response.content,
            role: 'model',
            timestamp: new Date(),
          }
        ]);
        setIsLoading(false);
      }
    };

    socketService.onMessage(handleAIResponse);

    return () => {
      socketService.offMessage(handleAIResponse);
    };
  }, [chat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && chat) {
      // Add user message to local state
      const userMessage = {
        content: input.trim(),
        role: 'user',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Send message via socket
      socketService.sendMessage(chat._id, input.trim());
      
      setInput('');
    }
  };

  if (!chat || (chat && messages.length === 0 && !isLoadingMessages)) {
    return (
      <div className="chat-screen">
        <div className="welcome-screen">
          <h1>ChaGpt Clone</h1>
          <p>A lightweight, responsive AI chat experience — clean, fast, and privacy-friendly.</p>
          {!chat ? (
            <p>Select a chat or create a new one to start your conversation</p>
          ) : (
            <p>Start typing below to begin your conversation</p>
          )}
        </div>
        {chat && (
          <div className="chat-input">
            <form onSubmit={handleSend}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? '...' : '➢'}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <h3>{chat.title}</h3>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-bubble">
              <span className="sender-icon">
                {message.role === 'user' ? 'U' : 'AI'}
              </span>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-time">
                {message.timestamp && new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message model">
            <div className="message-bubble">
              <span className="sender-icon">AI</span>
              <div className="message-content typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <form onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? '...' : '➢'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
