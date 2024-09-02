import http from "http";
import { app } from "./app.js";
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
const onlineUsersMap = {};
export const checkIsOnline = (receiverId) => {
    return onlineUsersMap[receiverId];
};
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
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
const PORT = parseInt(process.env.PORT || "8000", 10);
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
process.on("SIGTERM", () => {
    server.close(() => {
        console.log("Server shutting down...");
    });
});
