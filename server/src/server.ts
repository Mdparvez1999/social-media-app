import http from "http";
import { app } from "./app";
import { Server } from "socket.io";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
  },
});

interface OnlineUsersState {
  [key: string]: string;
}

const onlineUsersMap: OnlineUsersState = {};

console.log("Initial onlineUsersMap:", onlineUsersMap);

export const checkIsOnline = (receiverId: string) => {
  return onlineUsersMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("Client connected with socket id:", socket.id);

  const userId = socket.handshake.query.userId as string;

  console.log("User ID from handshake query:", userId);

  if (!userId) {
    console.log("No userId provided in handshake query");
    return;
  }

  onlineUsersMap[userId] = socket.id;
  console.log("Updated onlineUsersMap:", onlineUsersMap);

  socket.on("disconnect", () => {
    delete onlineUsersMap[userId];
    console.log(`Client disconnected. Updated onlineUsersMap:`, onlineUsersMap);
  });
});

const PORT: number = parseInt(process.env.PORT || "8000", 10);

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
