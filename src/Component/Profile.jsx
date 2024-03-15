import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Profile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            // console.log("User data:", userData);
            setUserData(userData);
          });
        } else {
          console.log("No user found with the provided email.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h2>Your Profile</h2>
      {userData ? (
        <div className="row">
          <div className="col-md-6">
            <div>
            User ID: {user.uid}
            <br />
              Name: {userData.username || "Anonymous"}
              <br />
              Email: {user.email}
            </div>
          </div>
          <div className="col-md-6">
            <img
              src={userData.file || "default_image_url"}
              alt={user.email || "User"}
              className="img-fluid"
              width={100}
            />
          </div>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default Profile;
