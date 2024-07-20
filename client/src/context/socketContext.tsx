import { createContext, useContext, useEffect, useState } from "react";
import { useAppSelector } from "../hooks/hooks";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (currentUser) {
      const newSocket: Socket = io("http://localhost:8000", {
        query: { userId: currentUser.id },
      });

      newSocket.on("connect", () => {
        console.log("Socket connected ");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    } else {
      socket?.disconnect();

      setSocket(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
