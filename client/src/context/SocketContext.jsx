import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { io } from "socket.io-client";
import { createContext, useRef, useContext, useEffect } from "react";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect", () => {
        console.log("Connected to Socket Server");
      });

      const handleRecieveMessage = (message) => {
        
        const store = useAppStore.getState(); 
        const { selectedChatData, selectedChatType, addMessage , addContactsInDMContacts} = store;

        if (
          selectedChatType !== undefined &&
            (selectedChatData._id === message.sender._id ||
          selectedChatData._id === message.recipient._id)
        ) {
            console.log("messageRecieved",message);
            addMessage(message);
        }
        addContactsInDMContacts(message);
      };


      const handleRecieveChannelMessage = (message) => {
        const store = useAppStore.getState(); 
        const { selectedChatData, selectedChatType, addMessage,  addChannelInChannelList} = store;

        if (selectedChatType !== undefined && selectedChatData._id === message.channelId){
          console.log(message); 
          addMessage(message);
        }
        addChannelInChannelList(message);
      };


      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("recieve-channel-message",handleRecieveChannelMessage)
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
