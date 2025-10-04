import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatItem from './ChatItem';
import { authAPI, socketService } from '../services/api';
import '../styles/Sidebar.css';

const Sidebar = ({ chats, activeChat, onNewChat, onSelectChat, toggleSidebar, isSidebarVisible }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      socketService.disconnect();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout request fails
      navigate('/login');
    }
  };

  return (
    <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          + New Chat
        </button>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="chat-history">
        {(chats || []).map((chat, index) => (
          <ChatItem 
            key={chat._id || `chat-${index}`} 
            chat={chat} 
            isActive={activeChat && activeChat._id === chat._id}
            onSelectChat={onSelectChat} 
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
