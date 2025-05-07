import React from 'react'
import toast from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';
import { Send } from 'lucide-react';

const MessageInput = () => {

  const [text, setText] = React.useState('');
  const [image, setImage] = React.useState(null); // TODO: Handle image upload
  const fileInputRef = React.useRef(null); // Reference to the file input element

  const { sendMessage } = useChatStore();

  const handleImageChange = async (e) => {} // TODO: Handle image upload
  const removeImage = () => {} //TODO: Handle image removal

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // Don't send empty messages

    console.log("Sending message: ", text);
    
    try {
      await sendMessage({
        text: text,
        image: null, // TODO: Handle image upload
      });

      setText(''); // Clear the input field after sending the message
      
      if(fileInputRef.current) {
        fileInputRef.current.value = null; // Clear the file input field
      }

    } catch (err) {
      toast.error("Error in sending message: ", err);
      
    }
  }

  return (
    <div className="p-4 w-full">
       <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput