// FriendList.js
import React, { useState } from "react";
import { ChatWindow } from "./ChatWindow"; // Assuming you have a ChatWindow component
import { sendFriendRequest, acceptFriendRequest } from "./friendUtils"; // Import your utility functions

const FriendList = ({ users }) => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSendRequest = (userId) => {
    // Implement logic to send a friend request
    sendFriendRequest(userId)
      .then(() => {
        // Update the state or perform any other action after sending the request
        // For example, you might want to update the UI to indicate the request was sent
      })
      .catch((error) => {
        console.error("Error sending friend request: ", error.message);
      });
  };

  const handleAcceptRequest = (requestId) => {
    // Implement logic to accept the friend request
    acceptFriendRequest(requestId)
      .then(() => {
        // Update the state or perform any other action after accepting the request
        // For example, you might want to update the UI to indicate the request was accepted
      })
      .catch((error) => {
        console.error("Error accepting friend request: ", error.message);
      });
  };

  const handleSelectUser = (userId) => {
    setSelectedUser(userId);
  };

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
            <button onClick={() => handleSendRequest(user.id)}>
              Send Friend Request
            </button>
            <button onClick={() => handleSelectUser(user.id)}>
              Start Chat
            </button>
          </li>
        ))}
      </ul>

      <h2>Friend Requests</h2>
      <ul>
        {friendRequests.map((request) => (
          <li key={request.id}>
            {request.senderName} sent you a friend request.
            <button onClick={() => handleAcceptRequest(request.id)}>
              Accept
            </button>
            {/* Add a button for declining the request if needed */}
          </li>
        ))}
      </ul>

      {selectedUser && <ChatWindow userId={selectedUser} />}
    </div>
  );
};

export default FriendList;
