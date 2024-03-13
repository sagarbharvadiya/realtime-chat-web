import React, { useEffect, useState } from "react";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";
import ChatComponent from "./ChatComponent";
import Profile from "./Profile";
import UserList from "./UserList";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSendMessage = (user) => {
    if (user && user.id) {
      setSelectedUser(user);
    } else {
      console.error("Invalid user selected:", user);
      // Optionally, display a message to the user indicating an issue with user selection
    }
  };
  
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

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          user
            .updateProfile({
              displayName: userData.username || "Anonymous",
              photoURL: userData.file || "default_image_url",
            })
            .then(() => {
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

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        // Redirect to the login form
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };


  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="row">
        <div className="col-md-12">
          {currentUser && <Profile user={currentUser} />}
          {users.length > 0 && (
            <UserList
              users={users.filter((user) => user.email !== currentUser?.email)}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
      <div className="col-md-12">
          {selectedUser && (
            <ChatComponent currentUser={currentUser} selectedUser={selectedUser} />
          )}
        </div>
    </div>
  );
};

export default Dashboard;
