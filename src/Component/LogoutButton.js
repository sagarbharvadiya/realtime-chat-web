import React from "react";
import { auth } from "./firebase";

const LogoutButton = () => {
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
    <button className="btn btn-danger" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
