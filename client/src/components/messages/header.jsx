import { ChevronLeft } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedId } from "@/store/test/testSlice";
import { useSocket } from "@/context/SocketContext";

function MessageHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedChatData, selectedChatType } = useSelector(
    (state) => state.test
  );
  const { onlineUsers } = useSocket();
  const handleClick = () => {
    dispatch(setSelectedId({ type: "remove" }));
    navigate("/");
  };
  return (
    <header className="flex items-center justify-between px-4 border-b pb-4 lg:p-4 h-16 ">
      <div className="flex gap-2 items-center">
        <ChevronLeft
          className="text-muted-foreground lg:hidden"
          size={18}
          onClick={handleClick}
        />
        <div className="relative">
          <Avatar>
            <AvatarImage
              src={selectedChatData?.image}
              alt={selectedChatData?.username}
              className="border"
            />
            <AvatarFallback className="border">
              {selectedChatType === "channel"
                ? selectedChatData?.name?.[0]?.toUpperCase()
                : selectedChatData?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold">
            {selectedChatType === "channel"
              ? selectedChatData?.name
              : selectedChatData?.username}
          </span>
          <span
            className={`text-xs  ${
              onlineUsers.includes(selectedChatData?._id)
                ? "text-green-600 font-semibold"
                : "text-gray-500 font-normal"
            } ${selectedChatType === "channel" ? "hidden" : "block"}`}
          >
            {onlineUsers.includes(selectedChatData?._id)
              ? "Active now"
              : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default MessageHeader;
