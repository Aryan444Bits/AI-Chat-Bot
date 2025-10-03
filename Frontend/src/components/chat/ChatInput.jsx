import React from 'react';
import { FiSend } from 'react-icons/fi';

const ChatInput = ({ userInput, onUserInput, onSendMessage }) => {
    return (
        <div className="chat-input-container">
            <form className="chat-input" onSubmit={onSendMessage}>
                <textarea
                    value={userInput}
                    onChange={onUserInput}
                    placeholder="Ask anything..."
                    rows={1}
                />
                <button type="submit" aria-label="Send message">
                    <FiSend />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
