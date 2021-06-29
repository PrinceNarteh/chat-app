import { useRef } from "react";
import EVENTS from "../config/events";
import { useSocket } from "../context/socket.context";

const Rooms = () => {
  const { socket, rooms, roomId } = useSocket();
  const newRoomRef = useRef(null);

  const handleCreateRoom = () => {
    // get the room name
    const roomName = newRoomRef.current.value || "";
    if (!String(roomName).trim()) return;

    // emit room created event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

    // set room name input to empty string
    newRoomRef.current.value = "";
  };

  return (
    <div>
      <nav>
        <div>
          <input type="text" placeholder="Room name" ref={newRoomRef} />
          <button onClick={handleCreateRoom}>CREATE ROOM</button>
        </div>

        {Object.keys(rooms).map((key) => (
          <div key={key}>{rooms[key].name}</div>
        ))}
      </nav>
    </div>
  );
};

export default Rooms;
