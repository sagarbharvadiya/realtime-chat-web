import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { app } from "./firebase.js";
import { NavLink, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

const LoginForm = () => {
  const navigate = useNavigate(); // Add this line to get the navigate function
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    try {
      const auth = getAuth(app);
      const { email, password } = formData;
      await signInWithEmailAndPassword(auth, email, password);

      // Reset the form data after successful submission
      setFormData({
        email: "",
        password: "",
      });
      alert("User logged in successfully!");

      // Use the navigate function to redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error signing in: ", error.message);
      // Handle login errors - display an error message or perform necessary actions
    }
  };

  const handleForgotPassword = () => {
    const auth = getAuth(app);
    const emailAddress = formData.email; // Get the user's email from the form

    try {
      sendPasswordResetEmail(auth, emailAddress)
        .then(() => {
          // Password reset email sent successfully
          alert("Password reset email sent. Please check your inbox.");
        })
        .catch((error) => {
          console.error("Error sending password reset email: ", error.message);
          // Handle errors related to sending the password reset email
          alert("Failed to send password reset email. Please try again.");
        });
    } catch (error) {
      console.error("Error initiating password reset: ", error.message);
      // Handle other potential errors here
    }
  };

  return (
    <div className="fromContainer">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="fromWrapper">
              <h2 className="text-center">Login</h2>
              <form onSubmit={handleSubmit} className="row">
                <div className="mb-3 col-lg-6">
                 <label htmlFor="Email">Email :</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-3 col-lg-6">
                    <label htmlFor="Password">Password :</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleTogglePassword}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                      />
                    </button>
                  </div>
                  <button onClick={handleForgotPassword} className="btn-link forgot-link">
                    Forgot password?
                  </button>
                </div>
                <div className="btn_d-flex">
                  <input
                    type="submit"
                    value="Login"
                    className="btn btn-primary"
                  />

                  <p>
                    Don't have an Account?
                    <NavLink to="/" className="btn-link">
                      Create Account
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
