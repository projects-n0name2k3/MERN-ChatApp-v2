import ChatTtem from "@/components/chat/chat-item";
import ChatContainer from "@/components/home/container";
import HomeHeader from "@/components/home/header";
import HomeSearch from "@/components/home/search";
import Sidebar from "@/components/home/sidebar";
import { useSocket } from "@/context/SocketContext";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

function Home({ isAuthenticated }) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [value, setValue] = useState("");

  const { selectedChatData } = useSelector((state) => state.test);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/sign-in");
    }
  }, [isAuthenticated]);
  const { contacts } = useSelector((state) => state.test);
  return (
    <div className=" w-full flex h-screen overflow-hidden">
      <Sidebar />
      <div
        className={`w-full lg:max-w-xs md:max-w-[90px] lg:border lg:border-y-0 md:border md:border-y-0 ${
          selectedChatData !== null ? "hidden lg:block md:block" : "block"
        }`}
      >
        <div className="mb-4 px-4">
          <HomeHeader
            openCreateDialog={openCreateDialog}
            setOpenCreateDialog={setOpenCreateDialog}
          />
          <HomeSearch value={value} setValue={setValue} />
        </div>
        {value === "" ? (
          <ChatContainer contacts={contacts} />
        ) : (
          contacts
            .filter((item) =>
              item.username.toLowerCase().includes(value.toLowerCase())
            )
            .map((item) => (
              <div className="px-2">
                <ChatTtem item={item} />
              </div>
            ))
        )}
      </div>
      <div
        className={`w-full lg:block  ${selectedChatData === null && "hidden"}`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Home;
