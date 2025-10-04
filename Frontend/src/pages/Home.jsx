import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatScreen from '../components/ChatScreen';
import '../styles/Home.css';

const Home = () => {
  const [chats, setChats] = useState([
    { id: 1, name: 'new chat1', messages: [] },
    { id: 2, name: 'new chat2', messages: [] },
    { id: 3, name: 'new chat3', messages: [] },
  ]);
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);

  const handleNewChat = () => {
    const chatName = prompt('Enter a name for the new chat:');
    if (chatName) {
      // TODO: Add your API call here to create a new chat on the server.
      // You can use fetch() or axios to send the 'chatName' to your backend.
      // After a successful response, you can then update the state with the new chat.
      const newChat = {
        id: chats.length + 1,
        name: chatName,
        messages: [],
      };
      setChats([...chats, newChat]);
      setActiveChat(newChat);
    }
  };

  const handleSelectChat = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
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

  return (
    <div className="home">
      <Sidebar
        chats={chats}
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
