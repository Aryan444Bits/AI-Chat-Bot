import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatScreen from '../components/ChatScreen';
import '../styles/Home.css';
import { chatAPI, socketService } from '../services/api';

const Home = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);

  const handleNewChat = async() => {
    const chatName = prompt('Enter a name for the new chat:');
    if (!chatName) return;

    try{
      const response = await chatAPI.createChat(chatName);
      console.log('Chat created:', response);
      
      const createdChat = response.chat;
      setChats([...chats, createdChat]);
      setActiveChat(createdChat);
    }catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat. Please try again.");  
    }
  };

  const handleSelectChat = (chatId) => {
    const chat = chats.find((c) => c._id === chatId);
    setActiveChat(chat);
    if (window.innerWidth <= 768) {
      setIsSidebarVisible(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarVisible(true);
      } else {
        setIsSidebarVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch existing chats when component mounts
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await chatAPI.getChats();
        console.log('Fetched chats:', response);
        setChats(response.chats || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    
    fetchChats();
  }, []);

  // Initialize socket connection
  useEffect(() => {
    socketService.connect();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="home">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={toggleSidebar}
      />
      <div className="main-content">
        <button className="sidebar-toggle-btn-main" onClick={toggleSidebar}>
          {isSidebarVisible ? '‹' : '›'}
        </button>
        <ChatScreen chat={activeChat} />
      </div>
    </div>
  );
};

export default Home;
