import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { cleanState, setSelectedId } from "@/store/test/testSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useSocket } from "@/context/SocketContext";
function ChatTtem({ item, active, setActive, type }) {
  const dispatch = useDispatch();
  const { onlineUsers } = useSocket();
  const { user } = useSelector((state) => state.auth);

  const handleClick = () => {
    setActive(item._id);
    dispatch(cleanState());
    dispatch(
      setSelectedId({
        type: "add",
        data: item,
        chatType: type === "channel" ? "channel" : "contact",
      })
    );
    navigate(`messages/${item._id}`);
  };
  const navigate = useNavigate();
  return (
    <div
      className={`flex flex-row items-center justify-between rounded py-2 ${
        active === item._id
          ? "bg-card-foreground/20"
          : "hover:bg-primary-foreground dark:hover:bg-primary-foreground"
      }  px-4 cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={item?.image} alt="@shadcn" />
            <AvatarFallback>
              {type === "channel"
                ? item?.name?.[0].toUpperCase()
                : item?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span
            className={`absolute w-3 h-3 rounded-full ${
              onlineUsers.includes(item._id) ? "bg-green-500" : "bg-gray-500"
            }  ${
              type === "channel" ? "hidden" : "block"
            } right-0 bottom-1 border-2 border-white`}
          ></span>
        </div>
        <div className="flex flex-col justify-center md:hidden lg:flex">
          <span className="text-sm font-semibold">
            {type === "channel" ? item?.name : item?.username}
          </span>
          <span
            className={`text-sm break-words max-w-40 line-clamp-1 ${
              type === "channel" ? "hidden" : "block"
            }`}
          >
            {item?.lastMessageSent === user?.id && "You: "}

            {item?.lastMessageType === "text"
              ? item?.lastMessageContent
              : "[Photo]"}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 md:hidden lg:flex">
        <span className={`text-xs text-gray-500`}>
          {moment(item?.lastMessageTime).format("LT")}
        </span>
      </div>
    </div>
  );
}

export default ChatTtem;
