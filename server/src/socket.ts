import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info("Socket enabled");

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User with ID ${socket.id} connected`);

    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      // create a roomId
      const roomId = nanoid();
      // add a new room to the rooms
      rooms[roomId] = {
        name: roomName,
      };
      // socket.join(roomId)
      socket.join(roomId);
      // broadcast an event saying "There is a new room"
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
      // emit back to the room creator with all the room
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      // emit back to the room creator saying they have join a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });

    /*
     * When a user sends a new message
     */
    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();

        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );
  });
}

export default socket;
