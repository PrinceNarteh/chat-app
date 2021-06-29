import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/defaults";
import EVENTS from "../config/events";

interface IContext {
  socket: Socket;
  username?: string;
  setUsername: Function;
  messages?: { username: string; message: string; time: string }[];
  setMessages: Function;
  roomId?: string;
  rooms: object;
}

const socket = io(SOCKET_URL);

const SocketContext = createContext<IContext>({
  socket,
  rooms: {},
  messages: [],
  setUsername: () => false,
  setMessages: () => false,
});

function SocketProvider(props: any) {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    window.onfocus = function () {
      document.title = "Chat app";
    };
  }, []);

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value);
    setMessages([]);
  });

  socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ message, username, time }) => {
    if (!document.hasFocus()) {
      document.title = "New message...";
    }
    setMessages([...messages, { message, username, time }]);
  });

  return (
    <SocketContext.Provider
      value={{
        rooms,
        socket,
        roomId,
        messages,
        username,
        setMessages,
        setUsername,
      }}
      {...props}
    />
  );
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
