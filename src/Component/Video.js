import React from "react";

const Video = ({ localVideoRef, remoteVideoRef, showCamera, peer }) => {
  return (
    <>
      {showCamera && <video id="local-video" autoPlay muted ref={localVideoRef} />}
      {peer && <video id="remote-video" autoPlay ref={remoteVideoRef} />}
    </>
  );
};

export default Video;
