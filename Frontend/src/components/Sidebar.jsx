import React from 'react';
import ChatItem from './ChatItem';
import '../styles/Sidebar.css';

const Sidebar = ({ chats, onNewChat, onSelectChat, toggleSidebar, isSidebarVisible }) => {
  return (
    <div className={`sidebar ${isSidebarVisible ? 'visible' : 'hidden'}`}>
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          + New Chat
        </button>
      </div>
      <div className="chat-history">
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} onSelectChat={onSelectChat} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
