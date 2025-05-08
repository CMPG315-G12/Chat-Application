// filepath: c:\DEV\Chat-App\Chat-Application\client\src\renderer\src\pages\ManagementPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useManagementStore } from '../store/useManagementStore';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { Search, UserPlus, Users, Plus, X, UserX, LogOut, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const ManagementPage = () => {
  // Tabs for different management sections
  const [activeTab, setActiveTab] = useState('friends');
  
  // States for the modals and forms
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [friendSearch, setFriendSearch] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [groupCode, setGroupCode] = useState('');
  
  // Get data from stores
  const { addFriend, removeFriend, joinGroup, leaveGroup, createGroup, isUserLoading, isGroupsLoading } = useManagementStore();
  const { contacts, getContacts } = useChatStore();
  const { authUser } = useAuthStore();
  
  // Filter states
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  
  // Fetch contacts on mount
  useEffect(() => {
    getContacts();
  }, [getContacts]);
  
  // Update filtered lists when contacts or search terms change
  useEffect(() => {
    if (contacts?.friends) {
      setFilteredFriends(contacts.friends.filter(friend => 
        friend.displayName?.toLowerCase().includes(friendSearch.toLowerCase()) ||
        friend.email?.toLowerCase().includes(friendSearch.toLowerCase())
      ));
    }
    
    if (contacts?.groups) {
      setFilteredGroups(contacts.groups.filter(group => 
        group.name?.toLowerCase().includes(groupSearch.toLowerCase()) ||
        group.description?.toLowerCase().includes(groupSearch.toLowerCase())
      ));
    }
  }, [contacts, friendSearch, groupSearch]);
  
  // Handle adding a friend by email
  const handleAddFriend = async (e) => {
    e.preventDefault();
    
    if (!friendEmail) {
      toast.error("Please enter a valid email");
      return;
    }
    
    try {
      // You would need to extend the API to search by email and get ID
      const result = await addFriend(friendEmail);
      if (result) {
        // Refresh contacts
        getContacts();
        setFriendEmail('');
        setIsFriendModalOpen(false);
      }
    } catch (error) {
      toast.error("Failed to add friend. Please try again.");
    }
  };
  
  // Handle removing a friend
  const handleRemoveFriend = async (friendId) => {
    if (window.confirm("Are you sure you want to remove this friend?")) {
      await removeFriend(friendId);
      getContacts(); // Refresh the contacts list
    }
  };
  
  // Handle joining a group
  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!groupCode) {
      toast.error("Please enter a group code");
      return;
    }
    
    try {
      await joinGroup(groupCode);
      getContacts(); // Refresh contacts
      setGroupCode('');
      setIsGroupModalOpen(false);
    } catch (error) {
      toast.error("Failed to join group. Please check the group code.");
    }
  };
  
  // Handle leaving a group
  const handleLeaveGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to leave this group?")) {
      await leaveGroup(groupId);
      getContacts(); // Refresh the contacts list
    }
  };
  
  // Handle creating a new group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!newGroup.name) {
      toast.error("Please enter a group name");
      return;
    }
    
    try {
      await createGroup(newGroup.name, newGroup.description);
      getContacts(); // Refresh contacts
      setNewGroup({ name: '', description: '' });
      setIsGroupModalOpen(false);
    } catch (error) {
      toast.error("Failed to create group. Please try again.");
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Manage Contacts & Groups</h1>
        
        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === 'friends' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Friends
          </button>
          <button
            className={`tab ${activeTab === 'groups' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            <Users className="mr-2 h-5 w-5" />
            Groups
          </button>
        </div>
        
        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title">My Friends</h2>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsFriendModalOpen(true)}
                >
                  <UserPlus className="h-5 w-5 mr-1" />
                  Add Friend
                </button>
              </div>
              
              {/* Search bar */}
              <div className="form-control mb-4">
                <div className="input-group">
                  <span className="btn btn-square btn-ghost">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search friends..."
                    className="input input-bordered w-full"
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Friends list */}
              {filteredFriends?.length > 0 ? (
                <div className="overflow-auto max-h-96 divide-y divide-base-300">
                  {filteredFriends.map((friend) => (
                    <div key={friend._id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full">
                            <img src={friend.profilePic || "https://cdn.discordapp.com/embed/avatars/0.png"} alt={friend.displayName} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{friend.displayName}</div>
                          <div className="text-sm opacity-70">{friend.email}</div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-error btn-sm" 
                        onClick={() => handleRemoveFriend(friend._id)}
                        disabled={isUserLoading}
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-base-content/60">
                  {contacts?.friends?.length === 0 
                    ? "You haven't added any friends yet." 
                    : "No friends match your search."}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">My Groups</h2>
                <div className="flex gap-2">
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => setIsGroupModalOpen(true)}
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Join Group
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setNewGroup({ name: '', description: '' });
                      setIsGroupModalOpen(true);
                    }}
                  >
                    <Users className="h-5 w-5 mr-1" />
                    Create Group
                  </button>
                </div>
              </div>
              
              {/* Search bar */}
              <div className="form-control mb-4">
                <div className="input-group">
                  <span className="btn btn-square btn-ghost">
                    <Search className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search groups..."
                    className="input input-bordered w-full"
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Groups list */}
              {filteredGroups?.length > 0 ? (
                <div className="overflow-auto max-h-96 divide-y divide-base-300">
                  {filteredGroups.map((group) => (
                    <div key={group._id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="avatar placeholder">
                          <div className="w-12 h-12 rounded-full bg-primary text-primary-content">
                            <span className="text-xl">{group.name[0]}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{group.name}</div>
                          <div className="text-sm opacity-70 line-clamp-1">{group.description || "No description"}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="badge badge-outline">{group.groupCode}</div>
                        <button 
                          className="btn btn-error btn-sm" 
                          onClick={() => handleLeaveGroup(group.groupCode)}
                          disabled={isGroupsLoading}
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-base-content/60">
                  {contacts?.groups?.length === 0 
                    ? "You haven't joined any groups yet." 
                    : "No groups match your search."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Add Friend Modal */}
      <dialog className={`modal ${isFriendModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Add Friend</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsFriendModalOpen(false)}
          >
            <X />
          </button>
          <form onSubmit={handleAddFriend}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <div className="input-group">
                <span className="btn btn-square btn-ghost">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  placeholder="friend@example.com"
                  className="input input-bordered w-full"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs opacity-70 mt-1">
                Enter your friend's email address to add them to your contacts.
              </p>
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={() => setIsFriendModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isUserLoading}>
                {isUserLoading ? <span className="loading loading-spinner"></span> : "Add Friend"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
      
      {/* Group Modal (Join or Create) */}
      <dialog className={`modal ${isGroupModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => setIsGroupModalOpen(false)}
          >
            <X />
          </button>
          
          <div className="tabs tabs-boxed my-4 w-full">
            <a 
              className={`tab ${!newGroup.name ? 'tab-active' : ''}`}
              onClick={() => setNewGroup({ name: '', description: '' })}
            >
              Join Group
            </a>
            <a 
              className={`tab ${newGroup.name ? 'tab-active' : ''}`}
              onClick={() => setNewGroup({ name: 'New Group', description: '' })}
            >
              Create Group
            </a>
          </div>
          
          {!newGroup.name ? (
            // Join Group Form
            <form onSubmit={handleJoinGroup}>
              <h3 className="font-bold text-lg mb-4">Join a Group</h3>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Group Code</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter group code"
                  className="input input-bordered w-full"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value)}
                  required
                />
                <p className="text-xs opacity-70 mt-1">
                  Ask your friends for their group code to join an existing group.
                </p>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsGroupModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isGroupsLoading}>
                  {isGroupsLoading ? <span className="loading loading-spinner"></span> : "Join Group"}
                </button>
              </div>
            </form>
          ) : (
            // Create Group Form
            <form onSubmit={handleCreateGroup}>
              <h3 className="font-bold text-lg mb-4">Create New Group</h3>
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Group Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  className="input input-bordered w-full"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Description (Optional)</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder="Enter group description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setIsGroupModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isGroupsLoading}>
                  {isGroupsLoading ? <span className="loading loading-spinner"></span> : "Create Group"}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
};

export default ManagementPage;