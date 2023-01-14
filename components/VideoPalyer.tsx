import React, { useEffect, useRef } from 'react';

type Props = {
  stream: MediaStream;
};

const VideoPlayer = (props: Props) => {
  const { stream } = props;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      height={1080}
      width={1920}
      className="h-[420px] bg-black"
      ref={videoRef}
      autoPlay
      muted
    ></video>
  );
};

export default VideoPlayer;
