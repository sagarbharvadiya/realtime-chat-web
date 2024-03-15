import React, { useEffect, useState } from "react";
import { getDocs, collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";
import ChatComponent from "./ChatComponent";
import Profile from "./Profile";
import UserList from "./UserList";
import LogoutButton from "./LogoutButton";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState({}); // Define userMessages state

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
          uniqueNumber: doc.data().uniqueNumber,
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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const messagesData = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp ? data.timestamp.toDate() : null;
        const message = { ...data, timestamp };
        if (!messagesData[data.receiver]) {
          messagesData[data.receiver] = [message];
        } else {
          messagesData[data.receiver].push(message);
        }
      });
      setUserMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="container">
      <div className="d-flex justify-content-end mt-3">
       <LogoutButton/>
      </div>
      <div className="row">
        <div className="col-md-12">
          {currentUser && <Profile user={currentUser} />}
        </div>
        <div className="col-md-12">
          {users.length > 0 && (
            <UserList
              users={users.filter(
                (user) => user.email !== currentUser?.email
              )}
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {selectedUser && (
            <ChatComponent
              currentUser={currentUser}
              selectedUser={selectedUser}
              userMessages={userMessages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
