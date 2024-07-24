import React, { createContext, useState, useEffect } from 'react';
import { fetchMessages } from '../services/api'; // Adjust the path based on your project structure

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetchMessages();
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages MessageContext:', error);
      }
    };

    getMessages();
  }, []);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageContext;
