import React, { useEffect, useRef } from 'react';

const Message = ({ message }) => {
    return (
        <div className={`message ${message.sender}`}>
            <div className="message-avatar">{message.sender === 'ai' ? 'AI' : 'U'}</div>
            <div className="text">{message.text}</div>
        </div>
    );
};

const ChatMessages = ({ messages, typing }) => {
    const containerRef = useRef(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        // Scroll the outer chat container (so the scrollbar on the right edge moves)
        const scrollEl = el.closest('.chat-container') || el;
        scrollEl.scrollTop = scrollEl.scrollHeight;
    }, [messages]);

    return (
        <div className="chat-messages" ref={containerRef}>
            {messages.map((message, index) => (
                <Message key={index} message={message} />
            ))}
            {typing && (
                <div className={`message ai typing`}>
                    <div className="message-avatar">AI</div>
                    <div className="text typing-text">
                        <div className="typing-dots" aria-hidden>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatMessages;
