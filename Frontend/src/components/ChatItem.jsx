import React from 'react';

const ChatItem = ({ chat, onSelectChat }) => {
  return (
    <div className="chat-item" onClick={() => onSelectChat(chat.id)}>
      {chat.name}
    </div>
  );
};

export default ChatItem;
