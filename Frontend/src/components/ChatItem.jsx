import React from 'react';

const ChatItem = ({ chat, isActive, onSelectChat }) => {
  return (
    <div 
      className={`chat-item ${isActive ? 'active' : ''}`} 
      onClick={() => onSelectChat(chat._id)}
    >
      {chat.title || chat.name || 'No Title'}
      {isActive && <span className="active-indicator">•</span>}
    </div>
  );
};

export default ChatItem;
