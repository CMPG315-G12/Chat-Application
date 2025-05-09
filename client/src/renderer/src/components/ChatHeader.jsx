import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

import defaultUser from "../assets/default-user.png";

const ChatHeader = () => {
  const { selectedContact, setSelectedContact, selectedContactType, unsubscribeFromMessages } = useChatStore();
  const { onlineUsers } = useAuthStore();


  const handleClose = () => { 
    if(selectedContactType === "G") {
      unsubscribeFromMessages(selectedContact._id);
    }
    // Reset selected contact and type
    setSelectedContact(null);
  }
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedContact.profilePic || defaultUser} alt={selectedContact.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedContact.displayName || selectedContact.name}</h3>
            <p className="text-sm text-base-content/70">
              {selectedContactType === "U" ? (onlineUsers.includes(selectedContact._id) ? "Online" : "Offline") : "Group"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => handleClose(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;