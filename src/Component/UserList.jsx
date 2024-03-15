import React from "react";

const UserList = ({ users, onSendMessage }) => {
  // console.log(users);
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            User ID: {user.id}
            <br />
            user :{user.uniqueNumber}
            <br />
            Email: {user.email}
            <br />
            Name: {user.name}
            <br />
            <img
              src={user.imageUrl || "default_image_url"}
              alt={user.name || "User"}
              className="img-fluid"
              width={100}
            />
            <br />
            <br />
            {/* Email: {user.email} */}
            <button onClick={() => onSendMessage(user)}>Send Message</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
