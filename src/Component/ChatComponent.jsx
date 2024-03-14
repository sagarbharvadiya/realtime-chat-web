import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneAlt,
  faVideo,
  faSmile,
  faPlus,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import {
  db,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "./firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SimplePeer from "simple-peer";
import EmojiPicker from "./EmojiPicker";
import Options from "./Options";

const ChatComponent = ({ currentUser, selectedUser }) => {
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to manage EmojiPicker visibility
  const [messages, setMessages] = useState([]);
  const [videoStream, setVideoStream] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [peer, setPeer] = useState(null);
  const [files, setFiles] = useState([]);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return; // Add a check to prevent fetching messages if selectedUser is undefined
    const messagesCollection = collection(db, "messages");
    const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
      const messageList = snapshot.docs.map((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp ? data.timestamp.toDate() : null;
        return { ...data, timestamp };
      });
      setMessages(messageList);
    });
    return () => {
      unsubscribe();
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoStream, selectedUser]); // Include selectedUser in the dependency array

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

      // console.log("Selected User:", selectedUser);
      const messagesCollection = collection(db, "messages");

      await addDoc(messagesCollection, {
        content: trimmedMessage,
        imageURL: null,
        fileURL: null,
        timestamp: serverTimestamp(),
        sender: currentUser.uid,
        receiver: selectedUser.id, // Use 'id' instead of 'uid'
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
        sender: currentUser,
        receiver: selectedUser.name, // Assuming selectedUser is an object with a 'name' property
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  // Filter messages based on selected user and current user
  const filteredMessages = messages.filter((msg) => {
    return (
      (msg.sender === currentUser.uid && msg.receiver === selectedUser.id) ||
      (msg.sender === selectedUser.id && msg.receiver === currentUser.uid)
    );
  });

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
        {filteredMessages.map((msg, index) => (
          <div key={index} className="message">
            <div className="message-content">
              {msg.content}
              {msg.imageURL && <img src={msg.imageURL} alt="Uploaded" />}
              {msg.fileURL && (
                <a href={msg.fileURL} target="_blank" rel="noopener noreferrer">
                  {msg.fileName || "Document"}
                </a>
              )}
            </div>
            <div className="message-timestamp">
              {formatTimestamp(msg.timestamp)}
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-3">
          <FontAwesomeIcon
            icon={faSmile}
            className="emoji-icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          />
          {showEmojiPicker && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
          <FontAwesomeIcon
            icon={faPlus}
            className="plus-icon"
            onClick={toggleOptions}
          />
          {showOptions && (
            <Options
              handleCameraClick={handleCameraClick}
              handleImageClick={handleImageClick}
              handleStickyNoteClick={handleStickyNoteClick}
              handleFileClick={handleFileClick}
            />
          )}
        </div>
        <div className="col-md-6">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
        </div>
        <div className="col-md-3">
          <FontAwesomeIcon
            icon={faPaperPlane}
            className="send-icon"
            onClick={handleSend}
          />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {showCamera && (
        <video id="local-video" autoPlay muted ref={localVideoRef} />
      )}
      {peer && <video id="remote-video" autoPlay ref={remoteVideoRef} />}
    </div>
  );
};

export default ChatComponent;
