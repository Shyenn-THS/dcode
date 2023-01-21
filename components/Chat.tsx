import { UserDetails } from '@/types/typings';
import React, { useContext, useRef } from 'react';
import { ChatContext } from '../contexts/ChatContext';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';

type Props = {
  roomId: string;
};

const Chat = (props: Props) => {
  const { chat, sendMessage } = useContext(ChatContext);
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement | null | undefined>();
  const { roomId } = props;

  const handleSendMessage = (e: HTMLFormElement) => {
    e.preventDefault();
    sendMessage(inputRef!.current!.value, roomId, session!.user);
    inputRef!.current!.value = '';
  };

  return (
    <div className="flex h-full relative flex-col p-6 space-y-2">
      {chat.messages.map((message, idx) => {
        const { fname, lname, username, image } = message.author as UserDetails;
        const currUser = session?.user.username;
        return (
          <div
            key={idx}
            className={classNames(
              'px-4 py-1 relative flex items-center space-x-2 rounded-full',
              currUser === username ? 'bg-blue-800' : 'bg-gray-800'
            )}
          >
            <Image
              src={image}
              height={1080}
              width={1080}
              className="rounded-full h-10 w-10"
              alt={username}
            />
            <div className="">
              <Link
                href={`/profile/${username}`}
                target="_blank"
                rel="noreffer"
                className="text-gray-100 font-medium"
              >
                {fname + ' ' + lname}:
              </Link>
              <p className="text-gray-700">{message.content}</p>
            </div>
            <time className="absolute text-gray-100 top-1 right-5">
              {moment(message.timestamp).fromNow()}
            </time>
          </div>
        );
      })}

      <form className="absolute bottom-4 w-full" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="w-11/12 px-4 py-2 rounded-full"
          placeholder="Chat with others..."
          ref={inputRef}
        />
      </form>
    </div>
  );
};

export default Chat;
