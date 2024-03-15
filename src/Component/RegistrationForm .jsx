import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, createUserWithEmailAndPassword } from "./firebase.js"; // Import the method
import { collection, addDoc } from "firebase/firestore";
import { NavLink, useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    file: null,
  });
  const [FormSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate(); // Get the history object

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === "file" ? files[0] : value,
    });

    if (name === "confirmPassword") {
      setPasswordsMatch(formData.password === value);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const generateUniqueNumber = () => {
    // Generate a unique number based on the current timestamp
    return Date.now().toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (passwordsMatch && formData.file) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        // Generate a unique number for the user
        const uniqueNumber = generateUniqueNumber();

        // Store additional user data in Firestore
        const storage = getStorage();
        const storageRef = ref(storage, `files/${formData.file.name}`);

        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, formData.file);

        // Get the download URL of the uploaded file
        const fileURL = await getDownloadURL(storageRef);

        // Prepare user data with the file URL, username, email, and unique number
        const userData = {
          username: formData.username,
          email: formData.email,
          file: fileURL,
          uniqueNumber: uniqueNumber,
        };

        // Add the form data along with the file URL to the Firestore database
        const userDocRef = await addDoc(collection(db, "users"), userData);

        // Reset the form data after successful submission
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          file: "",
        });
        // Redirect to the dashboard
        navigate("/dashboard");
        alert(
          "User registered and data stored in Firestore with ID: ",
          userDocRef.id
        );
      } catch (error) {
        console.error("Error registering user and storing data: ", error);
      }
    } else {
      console.error("Passwords don't match or no file selected");
    }
  };
  return (
    <div className="fromContainer">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="fromWrapper">
              <h2 className="text-center">Create Account</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3 col-lg-6 col-md-3">
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      required
                    />
                  </div>
                  <div className="mb-3 col-lg-6 col-md-3">
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
                  <div className="mb-3 col-lg-6 col-md-3">
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
                  </div>
                  <div className="mb-3 col-lg-6 col-md-3">
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control ${
                          !passwordsMatch ? "is-invalid" : ""
                        }`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleToggleConfirmPassword}
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEye : faEyeSlash}
                        />
                      </button>
                    </div>
                    {!passwordsMatch && (
                      <div className="invalid-feedback">
                        Passwords do not match
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    id="file"
                    name="file"
                    onChange={handleChange}
                    placeholder="File"
                    required
                  />
                </div>
                <div className="btn_d-flex">
                  <input
                    type="submit"
                    value="Create Account"
                    className="btn btn-primary"
                  />
                  <p>
                    Do you have an Account?
                    <NavLink to="/Login" className="btn-link">
                      Login
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

export default RegistrationForm;
