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

  const handleJoinRoom = (key) => {
    if (key === roomId) return;

    socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
  };

  return (
    <div>
      <nav>
        <div>
          <input type="text" placeholder="Room name" ref={newRoomRef} />
          <button onClick={handleCreateRoom}>CREATE ROOM</button>
        </div>

        {Object.keys(rooms).map((key) => (
          <div key={key}>
            <button
              disabled={key === roomId}
              title={`Join ${rooms[key].name}`}
              onClick={() => handleJoinRoom(key)}
            >
              {rooms[key].name}
            </button>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Rooms;
