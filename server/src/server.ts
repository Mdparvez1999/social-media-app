import http from "http";
import { app } from "./app";
import { Server } from "socket.io";

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://social-media-app-xi-henna.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["content-type", "Authorization", "X-Requested-With"],
  },
});

interface OnlineUsersState {
  [key: string]: string;
}

const onlineUsersMap: OnlineUsersState = {};

export const checkIsOnline = (receiverId: string) => {
  return onlineUsersMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (!userId) {
    console.error("User ID not provided in the handshake query.");
    socket.disconnect();
    return;
  }

  onlineUsersMap[userId] = socket.id;

  socket.on("disconnect", () => {
    delete onlineUsersMap[userId];
  });
});

const PORT: number = parseInt(process.env.PORT || "8000", 10);

server.listen(PORT, () => {
  console.log(`Server is running...`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server shutting down...");
  });
});
