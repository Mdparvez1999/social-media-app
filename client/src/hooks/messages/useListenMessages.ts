import { useEffect } from "react";
import { useSocketContext } from "../../context/socketContext";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setMessages } from "../../redux-store/features/messages/messagesSlice";

const useListenMessages = () => {
  const dispatch = useAppDispatch();
  const { socket } = useSocketContext();

  const messages = useAppSelector((state) => state.messages.messages);

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      dispatch(setMessages([...messages, message]));
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, dispatch, messages]);
};

export default useListenMessages;
