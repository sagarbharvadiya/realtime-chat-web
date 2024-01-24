// Dashboard.js
import React, { useEffect, useState } from "react";
import { getDocs, collection, addDoc, getDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { sendFriendRequest } from "./friendUtils";
import ChatWindow from "./ChatWindow"; // Import your chat component/page
import emailjs from "@emailjs/browser";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [requestSent, setRequestSent] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().username,
          imageUrl: doc.data().file || "default_image_url",
          email: doc.data().email,
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
  
        // Retrieve additional user information from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
  
          // Update displayName and photoURL properties
          user.updateProfile({
            displayName: userData.username || "Anonymous",
            photoURL: userData.file || "default_image_url",
          }).then(() => {
            // After the update, console log the updated user information
            console.log("Updated User:", auth.currentUser);
          });
        }
      } else {
        setCurrentUser(null);
      }
    });
  
    fetchUsers();
  
    return () => unsubscribe();
  }, []);
  
  const handleSendRequest = async (friendId, friendEmail) => {
    if (currentUser) {
      try {
        // Send friend request to the selected user
        sendFriendRequest(friendId, currentUser.uid);

        // Save the friend request to Firestore
        const friendRequestsCollection = collection(db, "friendRequests");
        await addDoc(friendRequestsCollection, {
          senderId: currentUser.uid,
          receiverId: friendId,
          status: "pending",
        });

        // Notify the friend via email using EmailJS
        const emailJsServiceId = "service_nm0gdfj";
        const emailJsTemplateId = "template_vc5cgki";
        const emailJsUserId = "c_aUCFVITQtpqyIlf";

        const templateParams = {
          to_email: friendEmail, // Correctly pass the friend's email
          from_name: currentUser.displayName || "Anonymous", // Replace with the sender's name
          message: `You have received a new friend request from ${currentUser.email}. 
          Please log in to your account and accept the request on our website. 
          Click the following link to go to the website: ${window.location.href}`,
        };

        await emailjs.send(
          emailJsServiceId,
          emailJsTemplateId,
          templateParams,
          emailJsUserId
        );

        console.log("Friend request email sent using EmailJS");
        setRequestSent((prevRequests) => [...prevRequests, friendId]);
      } catch (error) {
        console.error("Error sending friend request email:", error);
      }
    } else {
      alert("User not authenticated. Please log in.");
    }
  };

  const handleOpenChat = (user) => {
    setChatOpen(true);
    setSelectedChatUser(user);
  };

  return (
    <div className="container">
      {currentUser && (
        <div>
          <h2>Your Profile</h2>
          <div className="row">
            <div className="col-md-6">
              <div>
                User ID: {currentUser.uid}
                <br />
                Name: {currentUser.displayName || "Anonymous"}
                <br />
                Email: {currentUser.email}
              </div>
            </div>
            <div className="col-md-6">
              <img
                src={currentUser.photoURL || "default_image_url"}
                alt={currentUser.displayName || "User"}
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      )}

      <h2>User List</h2>
      <ul className="list-group">
        {users.map(
          (user) =>
            // Check if the user is not the current user
            user.id !== currentUser?.uid && (
              <li key={user.id} className="list-group-item">
                <div className="row">
                  <div className="col-md-6">
                    <div>
                      User ID: {user.id}
                      <br />
                      Name: {user.name}
                      <br />
                      Email: {user.email}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="img-fluid"
                    />
                    <button
                      onClick={() => handleSendRequest(user.id, user.email)}
                      className="btn btn-primary mt-2"
                      disabled={requestSent.includes(user.id)}
                    >
                      {requestSent.includes(user.id)
                        ? "Request Sent"
                        : "Send Friend Request"}
                    </button>
                    <button
                      onClick={() => handleOpenChat(user)}
                      className="btn btn-success mt-2 ml-2"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </li>
            )
        )}
      </ul>
      {chatOpen && selectedChatUser && (
        <ChatWindow
          currentUser={currentUser}
          selectedChatUser={selectedChatUser}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
