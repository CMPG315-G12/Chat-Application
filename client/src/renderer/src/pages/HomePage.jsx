import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Settings, Plus, ArrowLeft, Trash2 } from 'lucide-react';

const HomePage = () => {
  const { authUser } = useAuthStore();
  
  // Mock data - in a real app this would come from the database
  const [contacts, setContacts] = React.useState([
    { id: 1, name: 'John Doe', phone: '0123456789', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 2, name: 'Jane Smith', phone: '0987654321', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 3, name: 'Group Chat', isGroup: true, members: [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]}
  ]);
  
  const [selectedContact, setSelectedContact] = React.useState(null);
  const [selectedGroupMember, setSelectedGroupMember] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const message = {
      id: Date.now(),
      sender: authUser.username,
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-16 bg-[var(--sidebar-bg)] flex flex-col items-center py-3">
        {/* Settings button */}
        <button className="w-12 h-12 rounded-full bg-[var(--info-bar-bg)] flex items-center justify-center mb-4">
          <Settings className="text-[var(--text-primary)]" size={24} />
        </button>
        
        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <button
              key={contact.id}
              className="w-12 h-12 rounded-full bg-[var(--info-bar-bg)] flex items-center justify-center mb-3 relative"
              onClick={() => {
                setSelectedContact(contact);
                setSelectedGroupMember(null);
              }}
            >
              {contact.isGroup ? (
                <span className="text-[var(--text-primary)] font-semibold">GC</span>
              ) : (
                <img 
                  src={contact.avatar} 
                  alt={contact.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Add contact/group button */}
        <button className="w-12 h-12 rounded-full bg-[var(--info-bar-bg)] flex items-center justify-center mt-auto">
          <Plus className="text-[var(--text-primary)]" size={24} />
        </button>
      </div>
      
      {/* Info bar */}
      <div className="w-60 bg-[var(--info-bar-bg)] p-4">
        {selectedContact ? (
          selectedGroupMember ? (
            <div className="h-full flex flex-col">
              <button 
                className="flex items-center text-[var(--text-primary)] mb-6"
                onClick={() => setSelectedGroupMember(null)}
              >
                <ArrowLeft className="mr-2" size={20} />
                Back to group
              </button>
              
              <div className="flex-1 flex flex-col items-center">
                <img 
                  src={selectedGroupMember.avatar || `https://ui-avatars.com/api/?name=${selectedGroupMember.name}`} 
                  alt={selectedGroupMember.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                  {selectedGroupMember.name}
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  {selectedGroupMember.phone}
                </p>
                
                <button className="w-full py-2 bg-[var(--button-danger)] text-white rounded flex items-center justify-center">
                  <Trash2 className="mr-2" size={16} />
                  Remove Member
                </button>
              </div>
            </div>
          ) : selectedContact.isGroup ? (
            <div className="h-full flex flex-col">
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-[var(--sidebar-bg)] flex items-center justify-center mb-3">
                  <span className="text-xl font-semibold">GC</span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {selectedContact.name}
                </h3>
              </div>
              
              <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
                MEMBERS
              </h4>
              
              <div className="flex-1 overflow-y-auto">
                {selectedContact.members.map(member => (
                  <button
                    key={member.id}
                    className="w-full py-2 px-3 rounded hover:bg-[var(--sidebar-bg)] text-left flex items-center"
                    onClick={() => setSelectedGroupMember(member)}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--sidebar-bg)] mr-2 flex items-center justify-center">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-xs">{member.name.charAt(0)}</span>
                      )}
                    </div>
                    <span>{member.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center">
              <img 
                src={selectedContact.avatar} 
                alt={selectedContact.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                {selectedContact.name}
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                {selectedContact.phone}
              </p>
              
              <button className="w-full py-2 bg-[var(--button-danger)] text-white rounded flex items-center justify-center">
                <Trash2 className="mr-2" size={16} />
                Delete Contact
              </button>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
            Select a contact to view details
          </div>
        )}
      </div>
      
      {/* Chat area */}
      <div className="flex-1 bg-[var(--chat-area-bg)] flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-[var(--info-bar-bg)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {selectedContact.name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {selectedContact.isGroup ? 
                  `${selectedContact.members.length} members` : 
                  selectedContact.phone}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length > 0 ? (
                messages.map(message => (
                  <div key={message.id} className="mb-4">
                    <div className="flex items-start mb-1">
                      <span className="font-semibold text-[var(--text-primary)] mr-2">
                        {message.sender}
                      </span>
                      <span className="text-xs text-[var(--message-time)]">
                        {new Date(message.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[var(--text-primary)]">
                      {message.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
                  Start a new conversation
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[var(--info-bar-bg)]">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Send a message..."
                  className="flex-1 bg-[var(--input-bg)] text-[var(--text-primary)] rounded px-4 py-2 outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="ml-2 w-10 h-10 rounded-full bg-[var(--accent-color)] flex items-center justify-center"
                  onClick={handleSendMessage}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;