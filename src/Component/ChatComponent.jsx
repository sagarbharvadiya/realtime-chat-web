import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneAlt, faVideo } from "@fortawesome/free-solid-svg-icons";
import {
  db,
  getDoc,
  doc,
  getStorage,
  uploadBytes,
  addDoc,
  getDownloadURL,
  collection,
  serverTimestamp,
} from "./firebase"; // Import your Firebase configuration
import { ref } from "firebase/database"; // Import Realtime Database methods
import SimplePeer from "simple-peer";
import Message from "./Message";
import Input from "./Input";
import Video from "./Video";
import FileUpload from "./FileUpload";
import { onSnapshot } from "firebase/firestore";

const ChatComponent = ({ currentUser, selectedUser, userMessages }) => {
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState([]);
  const [videoStream, setVideoStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [peer, setPeer] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Fetch current user's name from Firestore when component mounts
    const fetchUserName = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setCurrentUserName(userDoc.data().name);
        }
      } catch (error) {
        console.error("Error fetching current user's name:", error.message);
      }
    };

    fetchUserName(); // Call fetchUserName function when component mounts
  }, [videoStream, currentUser]); // Run effect only when currentUser changes
  
  useEffect(() => {
    if (!selectedUser) return;
  
    const messagesCollection = collection(db, `messages`);
    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setMessages(data);
    });
  
    return () => {
      // Unsubscribe from Firestore Realtime updates
      unsubscribe();
    };
  }, [selectedUser]);
  
  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      alert("Message cannot be blank.");
      return;
    }

    try {
      if (!selectedUser || !selectedUser.id) {
        console.error(
          "Error sending message: Selected user is not defined or missing UID."
        );
        console.log("Selected User:", selectedUser);
        return;
      }

      // Add the new message to the 'messages' collection in Firestore
      const messagesCollection = collection(db, "messages");
      await addDoc(messagesCollection, {
        content: trimmedMessage,
        senderName: currentUserName,
        timestamp: serverTimestamp(),
        sender: currentUser.uid,
        receiver: selectedUser.id,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error.message);
    }
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);

    if (!showOptions && showCamera) {
      setVideoStream(null);
      setShowCamera(false);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  const handleCameraClick = async () => {
    console.log("Camera icon clicked");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing camera: ", error.message);
    }
  };

  const handleImageClick = () => {
    console.log("Image icon clicked");
    fileInputRef.current.accept = ".png, .jpeg, .jpg, .webp";
    fileInputRef.current.click();
  };

  const handleFileClick = () => {
    console.log("File icon clicked");
    fileInputRef.current.accept = "";
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `files/${selectedFile.name}`);
      await uploadBytes(storageRef, selectedFile);

      const fileURL = await getDownloadURL(storageRef);
      const isImage = selectedFile.type.startsWith("image/");

      const messagesCollection = collection(db, "messages");
      await addDoc(messagesCollection, {
        content: "",
        sender: currentUser.uid, // Use UID of the current user
        receiver: selectedUser.id,
        imageURL: isImage ? fileURL : null,
        fileURL: isImage ? null : fileURL,
        fileName: selectedFile.name,
        timestamp: serverTimestamp(),
      });

      console.log("File uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file: ", error.message);
    }
  };

  const handleStickyNoteClick = () => {
    console.log("Sticky note icon clicked");
    // Open the sticker library or UI (add your logic)
  };

  const handleCallClick = () => {
    // Your existing code for making an audio call with SimplePeer
  };

  const handleVideoCallClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);

      const peerInstance = new SimplePeer({
        initiator: true,
        config: {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        },
        trickle: false,
        stream: stream,
      });

      setPeer(peerInstance);

      peerInstance.on("signal", (data) => {
        console.log("Signal sent:", data);
      });

      peerInstance.on("stream", (remoteStream) => {
        const remoteVideo = remoteVideoRef.current;
        if (remoteVideo) {
          remoteVideo.srcObject = remoteStream;
        }
      });

      peerInstance.on("error", (error) => {
        console.error("Peer connection error:", error);
      });
    } catch (error) {
      console.error(
        "Error accessing camera or creating peer connection:",
        error.message
      );
    }
  };
  return (
    <div className="container chat-container">
      <div className="row">
        <div className="col-md-6">
          <div className="user-name">{selectedUser.name}</div>
        </div>
        <div className="col-md-6">
          <FontAwesomeIcon
            icon={faPhoneAlt}
            className="option-icon"
            onClick={handleCallClick}
          />
          <FontAwesomeIcon
            icon={faVideo}
            className="option-icon"
            onClick={handleVideoCallClick}
          />
        </div>
      </div>

      <div className="messages-container">
        {userMessages[selectedUser.id]?.map((msg, index) => (
          <Message key={index} msg={msg} currentUser={currentUser} />
        ))}
      </div>

      <Input
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        toggleOptions={toggleOptions}
        showOptions={showOptions}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiSelect={handleEmojiSelect}
        handleCameraClick={handleCameraClick}
        handleImageClick={handleImageClick}
        handleStickyNoteClick={handleStickyNoteClick}
        handleFileClick={handleFileClick}
      />

      <FileUpload
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
      />

      <Video
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        showCamera={showCamera}
        peer={peer}
      />
    </div>
  );
};

export default ChatComponent;
