import React from 'react'
import Navbar from '../components/Navbar'
import { useManagementStore } from '../store/useManagementStore'
import toast from 'react-hot-toast';

const ProfilePage = () => {
    const [id, setId] = React.useState({
        id: ""
    });

    const { addFriend, removeFriend, joinGroup, leaveGroup, createGroup } = useManagementStore();


    /*
        John Doe: 6818bd9bf3bfa2084b1e73da
        Jane Doe: 6818bdb8f3bfa2084b1e73dd
        Group: ob38xons
    */
    const handleAddFriend = async () => {
        // Logic to add a friend
        const res = await addFriend(id); // Replace with actual userId
        if (res) {
            toast.success("Friend added successfully!");
        } else {
            toast.error("Error adding friend");
        }
    }

    const handleRemoveFriend = async () => {
        // Logic to Removo a friend
        console.log(id);

        const res = await removeFriend(id); // Replace with actual userId
    }

    const handleJoinGroup = async () => {
        // Logic to add a friend
        const res = await joinGroup(id); // Replace with actual userId
    }

    const handleLeaveGroup = async () => {
        // Logic to add a friend
        const res = await leaveGroup(id); // Replace with actual userId
    }

    const handleCreateGroup = async () => {
        // Logic to add a friend
        const res = await createGroup(id); // Replace with actual userId
    }

    return (
        <>
            <Navbar />
            <div className='flex flex-col items-center justify-center h-screen'>
                <h1 className='text-4xl font-bold'>Profile Page</h1>
                <div className='flex flex-col items-center justify-center mt-4'>
                    <button onClick={() => handleAddFriend()} className='btn btn-primary mt-4'>
                        Add Friend
                    </button>
                    <select defaultValue="Pick a Member" className="select" onChange={(e) => setId(e.target.value)}>
                        <option disabled={true}>Pick a Member</option>
                        <option value={"6818bd9bf3bfa2084b1e73da"}>John Doe</option>
                        <option value={"6818bdb8f3bfa2084b1e73dd"}>Jane Doe</option>
                    </select>
                </div>

                <div className='flex flex-col items-center justify-center mt-4'>
                    <button onClick={() => handleRemoveFriend()} className='btn btn-primary mt-4'>
                        Remove Friend
                    </button>
                    <select defaultValue="Pick a Member" className="select" onChange={(e) => setId(e.target.value)}>
                        <option disabled={true}>Pick a Member</option>
                        <option value={"6818bd9bf3bfa2084b1e73da"}>John Doe</option>
                        <option value={"6818bdb8f3bfa2084b1e73dd"}>Jane Doe</option>
                    </select>
                </div>
                <div className='flex flex-col items-center justify-center mt-4'>
                    <button onClick={() => handleJoinGroup()} className='btn btn-primary mt-4'>
                        Join Group
                    </button>
                    <select defaultValue="Pick a Group" className="select" onChange={(e) => setId(e.target.value)}>
                        <option disabled={true}>Pick a Group</option>
                        <option value={"ob38xons"}>ob38xons</option>
                    </select>
                </div>
                <div className='flex flex-col items-center justify-center mt-4'>
                    <button onClick={() => handleLeaveGroup()} className='btn btn-primary mt-4'>
                        Remove Group
                    </button>
                    <select defaultValue="Pick a Group" className="select" onChange={(e) => setId(e.target.value)}>
                        <option disabled={true}>Pick a Group</option>
                        <option value={"ob38xons"}>ob38xons</option>
                    </select>
                </div>
            </div>
        </>
    )
}

export default ProfilePage