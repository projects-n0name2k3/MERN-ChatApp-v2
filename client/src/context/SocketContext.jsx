import { addMessage, getContacts } from "@/store/test/testSlice";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.test
  );
  const selectedChatTypeRef = useRef(selectedChatType);
  const selectedChatDataRef = useRef(selectedChatData);
  const userRef = useRef(user);
  useEffect(() => {
    selectedChatTypeRef.current = selectedChatType;
  }, [selectedChatType]);

  useEffect(() => {
    selectedChatDataRef.current = selectedChatData;
  }, [selectedChatData]);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (user) {
      socket.current = io("http://localhost:3000", {
        withCredentials: true,
        query: {
          userId: user.id,
        },
      });

      socket.current.on("connect", () => {
        // console.log("Connected to socket server");
      });

      const handleReceiveMessage = (message) => {
        const currentSelectedChatType = selectedChatTypeRef.current;
        const currentSelectedChatData = selectedChatDataRef.current;

        if (currentSelectedChatType !== null) {
          if (
            currentSelectedChatData._id === message.sender._id ||
            currentSelectedChatData._id === message.receiver._id
          )
            dispatch(addMessage({ message }));
          dispatch(getContacts(user?.id));
        } else {
          dispatch(getContacts(user?.id));
        }
      };

      const handleReceiveChannelMessage = (message) => {
        const currentSelectedChatType = selectedChatTypeRef.current;
        const currentSelectedChatData = selectedChatDataRef.current;
        console.log(message);
        if (
          currentSelectedChatType !== null &&
          currentSelectedChatData._id === message.channelId
        ) {
          dispatch(addMessage({ message }));
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receiveChannelMessage", handleReceiveChannelMessage);
      socket.current.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
      return () => {
        socket.current.disconnect();
      };
    }
  }, [user]);
  return (
    <SocketContext.Provider value={{ socket: socket.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
