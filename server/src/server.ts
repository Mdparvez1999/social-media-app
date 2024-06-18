import http from "http";
import { app } from "./app";

const server = http.createServer(app);

const PORT: number = parseInt(process.env.PORT || "3000", 10);

server.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
