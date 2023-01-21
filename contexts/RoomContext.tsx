import {
  createContext,
  FunctionComponent,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import Peer from 'peerjs';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ws } from '../lib/ws';

interface Props {
  children: ReactNode;
}

export const RoomContext = createContext<null | any>(null);

export const RoomProvider: FunctionComponent<Props> = ({ children }) => {
  const router = useRouter();
  const [me, setMe] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>();
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>();
  const [participants, setParticipants] = useState<string[]>();

  useEffect(() => {
    const getUsers = ({ participants }: { participants: string[] }) => {
      setParticipants(participants);
    };

    const removePeer = (peerId: string) => {
      setParticipants(participants?.filter((id) => id !== peerId));
      console.log(`${peerId} left`);
    };

    const sessionEnded = () => {
      toast.success(
        'Session is ended by the Host! Thank you for Joining! Redirectiong you to homepage.'
      );
      setTimeout(() => {
        router.push('/');
      }, 5000);
    };

    ws.on('get-users', getUsers);
    ws.on('user-disconnected', removePeer);
    ws.on('session-ended', sessionEnded);

    return () => {
      ws.off('get-users');
      ws.off('user-disconnected');
      ws.off('session-ended');
    };
  }, [router]);

  useEffect(() => {
    me?.on('call', (call) => {
      call.answer();
      call?.on('stream', (peerStream) => {
        setStream(peerStream);
      });
    });

    if (!me || !stream) return;

    ws.on('user-joined', ({ peerId }) => {
      const call = me.call(peerId, stream);
    });

    return () => {
      ws.off('user-joined');
    };
  }, [me, stream]);

  return (
    <RoomContext.Provider
      value={{
        ws,
        me,
        stream,
        audioTrack,
        videoTrack,
        participants,
        setStream,
        setAudioTrack,
        setVideoTrack,
        setMe,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
