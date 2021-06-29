import { useRef } from "react";
import EVENTS from "../config/events";
import { useSocket } from "../context/socket.context";

const Messages = () => {
  const { socket, messages, roomId, username, setMessages } = useSocket();
  const newMessageRef = useRef(null);

  if (!roomId) return <div />;

  const handleSendMessage = () => {
    const message = newMessageRef.current.value;
    if (!String(message).trim) return;

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });

    const date = new Date();

    setMessages([
      ...messages,
      {
        username: "You",
        message,
        time: `${date.getHours()}:${date.getMinutes()}`,
      },
    ]);
  };

  return (
    <div>
      {messages.map((message, idx) => {
        return <p key={idx}>{JSON.stringify(message)}</p>;
      })}

      <div>
        <textarea
          name=""
          cols={1}
          ref={newMessageRef}
          placeholder="Tell us what you are thinking"
        />
        <button onClick={handleSendMessage}>SEND</button>
      </div>
    </div>
  );
};

export default Messages;
