import { createContext, FunctionComponent, useEffect, useReducer } from 'react';
import { IMessage } from '../types/chat';
import { chatReducer, ChatState } from '../reducers/chatReducer';
import { addHistoryAction, addMessageAction } from '../reducers/chatActions';
import { ws } from '../lib/ws';
import { UserDetails } from '@/types/typings';

interface ChatValue {
  chat: ChatState;
  sendMessage: (message: string, roomId: string, author: UserDetails) => void;
}

interface Props {
  children: React.ReactNode;
}

export const ChatContext = createContext<ChatValue>({
  chat: {
    messages: [],
  },
  sendMessage: (message: string, roomId: string, author: UserDetails) => {},
});

export const ChatProvider: FunctionComponent<Props> = ({ children }) => {
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
  });

  const sendMessage = (
    message: string,
    roomId: string,
    author: UserDetails
  ) => {
    const messageData: IMessage = {
      content: message,
      timestamp: new Date().getTime(),
      author,
    };
    chatDispatch(addMessageAction(messageData));

    ws.emit('send-message', roomId, messageData);
  };

  const addMessage = (message: IMessage) => {
    chatDispatch(addMessageAction(message));
  };

  const addHistory = (messages: IMessage[]) => {
    chatDispatch(addHistoryAction(messages));
  };

  useEffect(() => {
    ws.on('add-message', addMessage);
    ws.on('get-messages', addHistory);
    return () => {
      ws.off('add-message', addMessage);
      ws.off('get-messages', addHistory);
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chat,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
