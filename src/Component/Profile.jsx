// Profile.jsx
import React from "react";

const Profile = ({ user }) => {
  return (
    <div>
      <h2>Your Profile</h2>
      <div className="row">
        <div className="col-md-6">
          <div>
            User ID: {user.uid}
            <br />
            Name: {user.displayName || "Anonymous"}
            <br />
            Email: {user.email}
          </div>
        </div>
        <div className="col-md-6">
          <img
            src={user.photoURL || "default_image_url"}
            alt={user.displayName || "User"}
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
