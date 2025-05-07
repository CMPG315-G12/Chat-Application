import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { User } from 'lucide-react';
import groupIcon from '../assets/group-icon.png';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
  const { getContacts, contacts, selectedContact, setSelectedContact, isConstactsListLoading, setSelectedContactType } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  if (isConstactsListLoading) {
    return (<SidebarSkeleton />)
  }

  const setSelectUser = (user) => {
    setSelectedContact(user);
    setSelectedContactType("U");
    console.log("Selected User: ", user);
  }

  const setSelectGroup = (group) => {
    setSelectedContact(group);
    setSelectedContactType("G");
    console.log("Selected Group: ", group);
  }

  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='border-b border-base-300 w-full p-5'>
        <div className='flex items-center gap-2'>
          <User className='size-6' />
          <span className='font-medium hidden lg:block'>Contacts</span>
        </div>
        {/* todo: Online Filetr toggle */}
      </div>

      <div className='overflow-y-auto w-full py-3'>
        {contacts?.friends?.map((friend) => (
          <button
            key={friend._id}
            onClick={() => setSelectUser(friend)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedContact?._id === friend._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={friend.profilePic || "/avatar.png"}
                alt={friend.displayName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(friend._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            <span>{friend.displayName}</span>
          </button>
        ))}

        <hr className="my-4 border-t border-zinc-700" />

        {contacts?.groups?.map((group) => (
          <button
            key={group._id}
            onClick={() => setSelectGroup(group)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedContact?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={groupIcon} // You can set a default group icon here 
                alt={group.name}
                className="size-12 object-cover rounded-full"
              />
            </div>
            <span>{group.name}</span>
          </button>
        ))}

      </div>

    </aside >
  )
}

export default Sidebar