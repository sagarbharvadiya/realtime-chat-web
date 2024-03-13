import React from "react";

const UserList = ({ users, onSendMessage }) => {
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            Name: {user.name}
            <br />
            <img
              src={user.photoURL || "default_image_url"}
              alt={user.displayName || "User"}
              className="img-fluid"
            />
            {/* Email: {user.email} */}
            <button onClick={() => onSendMessage(user)}>Send Message</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
