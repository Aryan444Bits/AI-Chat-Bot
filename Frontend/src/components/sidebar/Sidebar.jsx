import React from 'react';
import { FiPlus } from 'react-icons/fi';

const Sidebar = ({ previousChats, onNewChat, isSidebarOpen, onSelectChat, selectedIndex }) => {
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
                {/* When a previous chat is clicked, call onSelectChat to load it */}
                {/* NOTE: When you switch to a backend API you should store chats as objects
                (e.g. {id, title, lastMessage}) instead of plain strings.
                Example integration when mapping:
                    previousChats.map(chat => (
                <li key={chat.id} onClick={() => onSelectChat(chat.id)}>
                    {chat.title}
                </li>
                ))
                Keep selectedIndex or selectedId in parent to show active state. */}

                {previousChats.map((chat, index) => (
                    <li
                        key={index}
                        className={selectedIndex === index ? 'active' : ''}
                        onClick={() => onSelectChat && onSelectChat(index)}
                    >
                        {chat}
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;
