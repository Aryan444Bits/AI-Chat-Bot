import React from 'react';
import { FiMenu } from 'react-icons/fi';

const ChatHeader = ({ onToggleSidebar }) => {
    return (
        <header className="chat-header">
            <FiMenu className="menu-icon" onClick={onToggleSidebar} />
            <h3>ChatGPT</h3>
        </header>
    );
};

export default ChatHeader;
