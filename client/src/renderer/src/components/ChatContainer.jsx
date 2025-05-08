import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { Search, X } from 'lucide-react';

import defaultUser from "../assets/default-user.png";

// Typing indicator animation component
const TypingIndicator = ({ users = [], contacts = [] }) => {
  const getUserName = (userId) => {
    if (!contacts || !contacts.friends) return "Someone";
    const user = contacts.friends.find(friend => friend._id === userId);
    return user ? user.displayName || "User" : "Someone";
  };

  const getTypingText = () => {
    if (!users || users.length === 0) return null;
    
    if (users.length === 1) {
      return `${getUserName(users[0])} is typing...`;
    } else if (users.length === 2) {
      return `${getUserName(users[0])} and ${getUserName(users[1])} are typing...`;
    } else {
      return `${users.length} people are typing...`;
    }
  };

  const typingText = getTypingText();
  if (!typingText) return null;

  return (
    <div className="flex items-center ml-4 mb-2 text-sm text-base-content/60">
      <div className="typing-indicator mr-2">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      {typingText}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
        }
        .dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: currentColor;
          margin: 0 1px;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Message component to handle individual message rendering and refs
const Message = React.memo(({ message, isHighlighted, highlightedMessageRef, authUser, selectedContact }) => {
  const messageRef = useRef(null);
  const isSentByCurrentUser = message.senderId === authUser._id;
  const { readObserver } = useChatStore();

  useEffect(() => {
    // Only set up observer for incoming messages that need tracking
    if (!isSentByCurrentUser && readObserver && messageRef.current) {
      // Set data attributes for the observer
      messageRef.current.dataset.messageId = message._id;
      messageRef.current.dataset.message = JSON.stringify({
        senderId: message.senderId
      });
      readObserver.observe(messageRef.current);
      
      return () => {
        if (readObserver && messageRef.current) {
          readObserver.unobserve(messageRef.current);
        }
      };
    }
  }, [message._id, isSentByCurrentUser, readObserver]);

  return (
    <div
      key={message._id}
      ref={isHighlighted ? highlightedMessageRef : messageRef}
      className={`chat ${isSentByCurrentUser ? "chat-end" : "chat-start"} 
        ${isHighlighted ? "animate-pulse bg-primary/10 p-2 rounded-lg" : ""}`}
    >
      <div className="chat-image avatar">
        <div className="size-10 rounded-full border">
          <img
            src={
              isSentByCurrentUser
                ? authUser.profilePic || defaultUser
                : selectedContact.profilePic || defaultUser
            }
            alt="profile pic"
          />
        </div>
      </div>
      <div className="chat-header mb-1">
        <time className="text-xs opacity-50 ml-1">
          {formatMessageTime(message.createdAt)}
        </time>
      </div>
      <div className="chat-bubble flex flex-col">
        {message.image && (
          <img
            src={message.image}
            alt="Attachment"
            className="sm:max-w-[200px] rounded-md mb-2"
          />
        )}
        {message.text && <p>{message.text}</p>}
      </div>
      
      {/* Read Receipt indicators - only show for messages sent by current user */}
      {isSentByCurrentUser && (
        <div className="chat-footer opacity-70 flex items-center gap-1 mt-1">
          {message.status === 'sent' && (
            <span className="text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 10 4 15 9 20"></polyline>
              </svg>
            </span>
          )}
          {message.status === 'delivered' && (
            <span className="text-xs flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 10 4 15 9 20"></polyline>
                <polyline points="20 4 15 9 20 14"></polyline>
              </svg>
            </span>
          )}
          {message.status === 'read' && (
            <span className="text-xs text-blue-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L7 17l-5-5"></path>
                <path d="M22 10L13 19l-3-3"></path>
              </svg>
            </span>
          )}
          <span className="text-[10px]">
            {message.status === 'read' ? 'Read' : message.status === 'delivered' ? 'Delivered' : 'Sent'}
          </span>
        </div>
      )}
    </div>
  );
});

const ChatContainer = () => {
  const { 
    messages, 
    getMessages, 
    isMessagesLoading, 
    selectedContact, 
    selectedContactType, 
    subscribeToMessages, 
    unsubscribeFromMessages,
    typingUsers,
    contacts,
    setReadObserver
  } = useChatStore();
  
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const highlightedMessageRef = useRef(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);

  const createReadObserver = useCallback(() => {
    const readObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const messageId = entry.target.dataset.messageId;
          const messageData = JSON.parse(entry.target.dataset.message || '{}');
          
          if (messageData && messageData.senderId && selectedContact?._id) {
            useChatStore.getState().markMessagesAsRead?.(messageData.senderId);
            readObserver.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.5 });
    
    return readObserver;
  }, []);
  
  useEffect(() => {
    const observer = createReadObserver();
    setReadObserver?.(observer);
    
    return () => {
      observer.disconnect();
      setReadObserver?.(null);
    };
  }, [createReadObserver, setReadObserver]);
  
  useEffect(() => {
    if (!selectedContact?._id) return;
    getMessages(selectedContact._id);
    subscribeToMessages();

    setSearchQuery('');
    setIsSearchActive(false);
    setSearchResults([]);
    setHighlightedMessageId(null);

    return () => unsubscribeFromMessages();
  }, [selectedContact?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages && !isSearchActive && !highlightedMessageId) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSearchActive, highlightedMessageId]);
  
  useEffect(() => {
    if (highlightedMessageId && highlightedMessageRef.current) {
      highlightedMessageRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "center" 
      });
    }
  }, [highlightedMessageId]);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = messages.filter(message => 
      message.text && message.text.toLowerCase().includes(query)
    );
    
    setSearchResults(results);
    setIsSearchActive(true);
    
    if (results.length > 0) {
      setHighlightedMessageId(results[0]._id);
    } else {
      setHighlightedMessageId(null);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
    setSearchResults([]);
    setHighlightedMessageId(null);
  };
  
  const navigateSearchResult = (direction) => {
    if (searchResults.length === 0) return;
    
    const currentIndex = searchResults.findIndex(msg => msg._id === highlightedMessageId);
    let nextIndex;
    
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % searchResults.length;
    } else {
      nextIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
    }
    
    setHighlightedMessageId(searchResults[nextIndex]._id);
  };

  if (isMessagesLoading) {
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  const messagesToDisplay = isSearchActive ? searchResults : messages;

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      
      <div className="p-2 border-b border-base-300 flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-base-content/50" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search messages..."
            className="w-full py-1.5 pl-10 pr-10 input input-sm input-bordered rounded-md"
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={16} className="text-base-content/50" />
            </button>
          )}
        </div>
        <button 
          onClick={handleSearch}
          className="btn btn-sm btn-primary"
          disabled={!searchQuery.trim()}
        >
          Search
        </button>
        
        {isSearchActive && (
          <>
            <button 
              onClick={() => navigateSearchResult('prev')}
              className="btn btn-sm btn-outline"
              disabled={searchResults.length <= 1}
            >
              ↑
            </button>
            <button 
              onClick={() => navigateSearchResult('next')}
              className="btn btn-sm btn-outline"
              disabled={searchResults.length <= 1}
            >
              ↓
            </button>
            <span className="text-xs text-base-content/70">
              {searchResults.length > 0 
                ? `${searchResults.findIndex(msg => msg._id === highlightedMessageId) + 1}/${searchResults.length}` 
                : 'No results'}
            </span>
          </>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isSearchActive && searchResults.length === 0 && (
          <div className="flex justify-center items-center h-full text-base-content/70">
            No messages found matching "{searchQuery}"
          </div>
        )}
        
        {messagesToDisplay.map((message) => (
          <Message
            key={message._id}
            message={message}
            isHighlighted={message._id === highlightedMessageId}
            highlightedMessageRef={highlightedMessageRef}
            authUser={authUser}
            selectedContact={selectedContact}
          />
        ))}
        
        {typingUsers && typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} contacts={contacts} />
        )}
        
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer