import React from 'react';
import { FiPlus } from 'react-icons/fi';

const Sidebar = ({ previousChats, onNewChat, isSidebarOpen }) => {
    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <h3>ChatGPT</h3>
                <div className="sidebar-new-chat" onClick={onNewChat}>
                    <FiPlus />
                    <span>New Chat</span>
                </div>
            </div>
            <h2>Chats</h2>
            <ul>
                {/* TODO: When a previous chat is clicked, fetch its messages from the API */}
                {previousChats.map((chat, index) => (
                    <li key={index}>{chat}</li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
