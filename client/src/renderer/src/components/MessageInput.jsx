import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';

const MessageInput = () => {
  const [text, setText] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const fileInputRef = React.useRef(null);
  const typingTimeoutRef = React.useRef(null);

  const { sendMessage, setTyping } = useChatStore();

  // Handle typing indicator
  const handleInputChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    // Only send typing indicator if we have text
    if (newText.trim().length > 0) {
      // Signal that the user is typing
      setTyping(true);
      
      // Reset the typing timeout each time the user types
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 1000);
    } else {
      // If there's no text, signal that the user stopped typing
      setTyping(false);
    }
  };

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        setTyping(false);
      }
    };
  }, [setTyping]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImage(file);

    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Don't send if no text and no image
    if (!text.trim() && !image) return;

    try {
      // Create FormData if we have an image
      let formData = null;
      let imageUrl = null;
      
      if (image) {
        formData = new FormData();
        formData.append('image', image);
        
        // In real implementation, you'd upload the image and get a URL back
        // For now, we'll use the preview URL as a placeholder
        imageUrl = imagePreview;
      }

      await sendMessage({
        text: text,
        image: imageUrl,
      });

      // Clear form after sending
      setText('');
      removeImage();
      
    } catch (err) {
      toast.error("Error sending message: " + (err.message || err));
    }
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-32 rounded-md"
          />
          <button 
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:bg-error-focus transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={handleInputChange}
          />
        </div>
        
        <label htmlFor="image-upload" className="btn btn-sm btn-circle btn-ghost cursor-pointer">
          <Image size={22} />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </label>
        
        <button
          type="submit"
          className="btn btn-sm btn-circle btn-primary"
          disabled={!text.trim() && !image}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput