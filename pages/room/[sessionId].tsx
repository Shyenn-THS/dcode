import React, { useContext, useEffect, useState } from 'react';
import { UserDetails, SessionDetails, ModalContent } from '../../typings';
import { doc, getDoc } from 'firebase/firestore';
import db from '../../lib/firebase';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTime } from 'react-timer-hook';
import { SocialIcon } from 'react-social-icons';
import { AiFillEdit } from 'react-icons/ai';
import { MdError, MdScreenShare, MdStopScreenShare } from 'react-icons/md';
import { useSession } from 'next-auth/react';
import Page404 from '../../components/404';
import VideoPlayer from '../../components/VideoPalyer';
import { RoomContext } from '../../contexts/RoomContext';
import { useRouter } from 'next/router';
import {
  BsCameraVideoFill,
  BsCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
} from 'react-icons/bs';
import { UIContext } from '../../contexts/UIContext';
import { Chat } from '../../components/chat/Chat';

type Props = {
  data: SessionDetails;
};

const Room = (props: Props) => {
  const { data } = props;
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState<string | undefined>();
  const [screenShare, setScreenShare] = useState(false);
  const [startedSession, setStartedSession] = useState(false);
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const { dispatch } = useContext(UIContext);

  const {
    ws,
    me,
    stream,
    audioTrack,
    videoTrack,
    setAudioTrack,
    setVideoTrack,
    setStream,
    setMe,
  } = useContext(RoomContext);

  useEffect(() => {
    if (session) {
      setUsername(session.user.username);
    }
  }, [session]);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const Peer = require('peerjs').default;
      const peer = new Peer(username, {
        host: 'localhost',
        port: 9000,
        path: '/myapp',
      });
      setMe(peer);
    }
  }, [username, setMe]);

  useEffect(() => {
    const roomId = router.query.sessionId;

    if (roomId && username && ws) {
      ws.emit('join-room', { roomId, peerId: username });
    }

    return () => {
      ws.emit('leave-room', { roomId, peerId: username });
    };
  }, [ws, username, router.query.sessionId]);

  const startScreenSharing = () => {
    setStartedSession(true);
    navigator.mediaDevices.getDisplayMedia().then((stream) => {
      setStream(stream);
      setVideoTrack(stream.getVideoTracks()[0]);
      setAudioTrack(stream.getAudioTracks()[0]);
    });
  };

  const stopScreenSharing = () => {
    stream.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop();
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        setVideoTrack(stream.getVideoTracks()[0]);
        setAudioTrack(stream.getAudioTracks()[0]);
      });
  };

  const startStreaming = () => {
    setStartedSession(true);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        setVideoTrack(stream.getVideoTracks()[0]);
        setAudioTrack(stream.getAudioTracks()[0]);
      });
  };

  const stopStreaming = () => {
    setStartedSession(false);
    stream.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop();
    });

    const roomId = router.query.sessionId;
    ws.emit('session-ended', { roomId });
    setStream(null);
  };

  const switchStream = () => {
    setScreenShare(!screenShare);
    !screenShare ? startScreenSharing() : stopScreenSharing();
    console.log(me?.connections);
    Object.values(me?.connections).forEach((connection: any) => {
      const videoTrack = stream
        ?.getTracks()
        .find((track: MediaStreamTrack) => track.kind === 'video');
      connection[0].peerConnection
        .getSenders()[1]
        .replaceTrack(videoTrack)
        .catch((err: any) => {
          console.error(err);
        });
    });
  };

  // function to toggle audio
  function toggleAudio() {
    setMic(!mic);
    if (audioTrack.enabled) {
      audioTrack.enabled = false;
    } else {
      audioTrack.enabled = true;
    }
  }

  // function to toggle video
  function toggleVideo() {
    setCamera(!camera);
    if (videoTrack.enabled) {
      videoTrack.enabled = false;
    } else {
      videoTrack.enabled = true;
    }
  }

  const confirmStopSessionModal: ModalContent = {
    title: 'End your session?',
    confirmTitle: 'End Now',
    action: stopStreaming,
    description: 'Are you sure you want to stop your session?',
  };

  const {
    title,
    mainImage,
    description,
    startDate,
    startTime,
    duration,
    categories,
    technologies,
    speaker,
    status,
  } = data;

  if (!data) return <Page404 />;
  if (!username) return <div className="">Please Login to continue</div>;

  return (
    <main className="grid grid-cols-8 h-screen overflow-hidden bg-gray-1000">
      <section className="flex col-span-5 px-6 pb-10 pt-16 flex-col space-y-4 overflow-y-scroll scrollbar-thin scrollbar-track-gray-1000 scrollbar-thumb-gray-50">
        <VideoPlayer stream={stream} />
        {session?.user.email === speaker ? (
          <div className="p-4 rounded-xl space-x-4 bg-gray-900 flex justify-center items-center w-full">
            {!stream ? (
              <button className="btn btn-success" onClick={startStreaming}>
                Start Session
              </button>
            ) : (
              <button
                className="btn btn-error"
                onClick={() => {
                  dispatch({
                    type: 'OPEN_MODAL',
                    payload: confirmStopSessionModal,
                  });
                }}
              >
                Stop Session
              </button>
            )}
            <button
              disabled={!startedSession}
              className="btn text-xl disabled:opacity-80 disabled:bg-gray-800"
              onClick={switchStream}
            >
              {screenShare ? (
                <MdStopScreenShare className="" />
              ) : (
                <MdScreenShare className="" />
              )}
            </button>
            <button
              disabled={!startedSession}
              className="btn text-xl disabled:opacity-80 disabled:bg-gray-800"
              onClick={toggleVideo}
            >
              {camera ? (
                <BsCameraVideoOffFill className="" />
              ) : (
                <BsCameraVideoFill className="" />
              )}
            </button>
            <button
              disabled={!startedSession}
              className="btn text-xl disabled:opacity-80 disabled:bg-gray-800"
              onClick={toggleAudio}
            >
              {mic ? <BsFillMicMuteFill /> : <BsFillMicFill />}
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl space-x-4 bg-gray-900 flex justify-center items-center w-full"></div>
        )}
      </section>
      <aside className="h-full w-full col-span-3 px-4 py-10">
        <div className="bg-gray-900 rounded-xl w-full h-full"></div>
      </aside>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // Fetch data from external API
  try {
    const sessionRef = doc(db, 'sessions', params?.sessionId! as string);
    const sessionSnap = await getDoc(sessionRef);
    const data = sessionSnap.data() as SessionDetails;

    if (!data || data.status !== 'started') {
      return { props: { error: 'Room Data not found.' } };
    }
    // Pass data to the page via props
    return { props: { data } };
  } catch (error: any) {
    console.error(error.message);
    return { props: { ...error } };
  }
};

export default Room;
