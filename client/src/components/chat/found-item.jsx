import { setSelectedId } from "@/store/test/testSlice";

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function FoundItem({ item, setOpenCreateDialog }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    dispatch(setSelectedId({ type: "add", data: item, chatType: "contact" }));
    setOpenCreateDialog(false);
    navigate(`messages/${item._id}`);
  };
  return (
    <div
      className={`flex items-center gap-3 cursor-pointer hover:bg-accent-foreground/10 p-1 rounded`}
      onClick={handleClick}
    >
      <Avatar>
        <AvatarImage
          src={item?.image}
          alt={item?.username}
          className="w-10 h-10 rounded-full"
        />
        <AvatarFallback>{item?.username?.[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="font-semibold text-xs">{item?.username}</span>
    </div>
  );
}

export default FoundItem;
