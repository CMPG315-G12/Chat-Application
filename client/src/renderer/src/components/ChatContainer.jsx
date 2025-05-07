import React, { use, useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { Loader } from 'lucide-react';

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedContact, selectedContactType } = useChatStore();

  useEffect(() => {
    console.log("Selected Contact: ", selectedContact);
    console.log("Selected Contact Type: ", selectedContactType);
    
    getMessages(selectedContact._id)
  }, [selectedContact._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <Loader className='w-10 h-10 text-blue-500 animate-spin' />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <p>message</p>
      <MessageInput />
    </div>
  )
}
export default ChatContainer