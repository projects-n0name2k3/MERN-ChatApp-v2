import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getMessages, getChannelMessages } from "@/store/test/testSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

function MessageContainer() {
  const view = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const dispatch = useDispatch();
  const { selectedChatMessages, selectedChatType, selectedChatData } =
    useSelector((state) => state.test);
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    view.current.scrollIntoView({ behavior: "smooth" });
  }, [selectedChatMessages]);

  useEffect(() => {
    if (user?.id) {
      if (selectedChatType === "contact")
        dispatch(
          getMessages({ user1: user?.id, user2: selectedChatData?._id })
        );
      if (selectedChatType === "channel")
        dispatch(getChannelMessages(selectedChatData?._id));
    }
  }, [selectedChatType, user, selectedChatData?._id]);

  const renderDMMessage = (message) => (
    <div
      key={message._id}
      className={`${
        message.sender === user?.id ? "text-right justify-end" : "text-left"
      } flex gap-2`}
    >
      {message.sender !== user?.id && (
        <div className=" w-8 h-8">
          <Avatar>
            <AvatarImage
              src={selectedChatData?.image}
              alt={selectedChatData?.username}
              className="object-cover scale-75 rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {message.messageType === "text" ? (
              <div
                className={`max-w-[65%] p-2 px-4 rounded-full border shadow break-words inline-block ${
                  message.sender === user?.id && "bg-blue-500 text-white"
                }`}
              >
                {message.content}
              </div>
            ) : message.messageType === "file" && message.content == "" ? (
              message.file && message.file.length >= 2 ? (
                <div
                  className={`relative ${
                    message.sender === user?.id ? "right-4" : "left-0"
                  } cursor-pointer w-40 h-40`}
                >
                  {message.file && message.file.length >= 3 ? (
                    <>
                      {message.file.slice(0, 3).map((file, index) => (
                        <img
                          className={`w-40 h-40 object-cover rounded absolute border bg-background rotate-${
                            index * 6
                          }`}
                          src={file}
                          onClick={() => {
                            setSelectedMessage(message);
                            setOpen(true);
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {message.file.map((file, index) => (
                        <img
                          className={`w-40 h-40 object-cover rounded absolute border bg-background rotate-${
                            index * 6
                          }`}
                          src={file}
                          onClick={() => {
                            setSelectedMessage(message);
                            setOpen(true);
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <>
                  <img
                    className={`w-full max-w-xs max-h-80 object-cover rounded  bg-background cursor-pointer ${
                      isLoadingImage ? "hidden" : "block"
                    }`}
                    src={message.file[0]}
                    onLoad={() => setIsLoadingImage(false)}
                    onClick={() => {
                      setSelectedMessage(message);
                      setOpen(true);
                    }}
                  />
                  <Skeleton
                    className={`w-40 h-40 rounded ${
                      isLoadingImage ? "block" : "hidden"
                    }`}
                  />
                </>
              )
            ) : (
              message.messageType === "file" &&
              message.content !== "" && (
                <div
                  className={`flex flex-col max-w-xs w-full gap-6 mb-1 ${
                    message.sender === user?.id
                      ? "items-end pr-4"
                      : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[65%] p-2 rounded-lg border shadow break-words inline-block ${
                      message.sender === user?.id && "bg-blue-500 text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.file && message.file.length >= 2 ? (
                    <div
                      className={`relative ${
                        message.sender === user?.id ? "right-4" : "left-0"
                      } cursor-pointer w-40 h-40`}
                    >
                      {message.file && message.file.length >= 3 ? (
                        <>
                          {message.file.slice(0, 3).map((file, index) => (
                            <img
                              className={`w-40 h-40 object-cover rounded absolute border bg-background rotate-${
                                index * 6
                              }`}
                              src={file}
                              onClick={() => {
                                setSelectedMessage(message);
                                setOpen(true);
                              }}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          {message.file.map((file, index) => (
                            <img
                              className={`w-40 h-40 object-cover rounded absolute border bg-background rotate-${
                                index * 6
                              }`}
                              src={file}
                              onClick={() => {
                                setSelectedMessage(message);
                                setOpen(true);
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    <img
                      className={`w-full max-w-xs max-h-80 object-cover rounded  bg-background cursor-pointer`}
                      src={message.file[0]}
                      onLoad={() => console.log("loaded")}
                      onClick={() => {
                        setSelectedMessage(message);
                        setOpen(true);
                      }}
                    />
                  )}
                </div>
              )
            )}
          </TooltipTrigger>
          <TooltipContent side={message.sender === user?.id ? "left" : "right"}>
            {moment(message.timestamps).format("LT")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const renderChannelMessage = (message) => (
    <div
      key={message._id}
      className={`${
        message.sender._id === user?.id ? "text-right justify-end" : "text-left"
      } flex gap-2`}
    >
      {message.sender._id !== user?.id && (
        <div className=" w-8 h-8">
          <Avatar>
            <AvatarImage
              src={message.sender.image}
              alt={message.sender.username}
              className="object-cover scale-75 rounded-full"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {message.messageType === "text" ? (
              <div
                className={`max-w-[65%] p-2 px-4 rounded-full border shadow break-words inline-block ${
                  message.sender._id === user?.id && "bg-blue-500 text-white"
                }`}
              >
                {message.content}
              </div>
            ) : message.messageType === "file" && message.content == "" ? (
              message.file && message.file.length >= 2 ? (
                <div
                  className={`relative ${
                    message.sender._id === user?.id ? "right-4" : "left-0"
                  } cursor-pointer w-40 h-40`}
                >
                  {message.file && message.file.length >= 3 ? (
                    <>
                      {message.file.slice(0, 3).map((file, index) => (
                        <img
                          className={`w-40 h-40 object-cover rounded absolute border bg-background rotate-${
                            index * 6
                          }`}
                          src={file}
                          onClick={() => {
                            setSelectedMessage(message);
                            setOpen(true);
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <>
                      {message.file.map((file, index) => (
                        <img
                          className={`w-40 h-40 object-cover rounded absolute border bg-background rotate-${
                            index * 6
                          }`}
                          src={file}
                          onClick={() => {
                            setSelectedMessage(message);
                            setOpen(true);
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              ) : (
                <>
                  <img
                    className={`w-full max-w-xs max-h-80 object-cover rounded  bg-background cursor-pointer ${
                      isLoadingImage ? "hidden" : "block"
                    }`}
                    src={message.file[0]}
                    onLoad={() => setIsLoadingImage(false)}
                    onClick={() => {
                      setSelectedMessage(message);
                      setOpen(true);
                    }}
                  />
                  <Skeleton
                    className={`w-40 h-40 rounded ${
                      isLoadingImage ? "block" : "hidden"
                    }`}
                  />
                </>
              )
            ) : (
              message.messageType === "file" &&
              message.content !== "" && (
                <div
                  className={`flex flex-col max-w-xs w-full gap-6 mb-1 ${
                    message.sender._id === user?.id
                      ? "items-end pr-4"
                      : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[65%] p-2 rounded-lg border shadow break-words inline-block ${
                      message.sender._id === user?.id &&
                      "bg-blue-500 text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.file && message.file.length >= 2 ? (
                    <div
                      className={`relative ${
                        message.sender._id === user?.id ? "right-4" : "left-0"
                      } cursor-pointer w-40 h-40`}
                    >
                      {message.file && message.file.length >= 3 ? (
                        <>
                          {message.file.slice(0, 3).map((file, index) => (
                            <img
                              className={`w-40 h-40 object-cover rounded absolute border bg-background rotate-${
                                index * 6
                              }`}
                              src={file}
                              onClick={() => {
                                setSelectedMessage(message);
                                setOpen(true);
                              }}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          {message.file.map((file, index) => (
                            <img
                              className={`w-40 h-40 object-cover rounded absolute border bg-background rotate-${
                                index * 6
                              }`}
                              src={file}
                              onClick={() => {
                                setSelectedMessage(message);
                                setOpen(true);
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  ) : (
                    <img
                      className={`w-full max-w-xs max-h-80 object-cover rounded  bg-background cursor-pointer`}
                      src={message.file[0]}
                      onLoad={() => console.log("loaded")}
                      onClick={() => {
                        setSelectedMessage(message);
                        setOpen(true);
                      }}
                    />
                  )}
                </div>
              )
            )}
          </TooltipTrigger>
          <TooltipContent
            side={message.sender._id === user?.id ? "left" : "right"}
          >
            {moment(message.timestamps).format("LT")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamps).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-xs text-muted-foreground my-2">
              {moment(message.timestamps).isSame(new Date(), "day")
                ? "Today"
                : moment(message.timestamps).format("LL")}
            </div>
          )}
          {<div className="rotate-0 rotate-6 rotate-12 hidden"></div>}
          {selectedChatType === "contact" && renderDMMessage(message)}
          {selectedChatType === "channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };
  return (
    <div className="flex-1 bg-background flex flex-col gap-4 p-2 overflow-y-auto h-full">
      {renderMessages()}
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setSelectedMessage(null);
        }}
      >
        <DialogContent className="min-w-full h-screen grid place-items-center">
          {selectedMessage?.file?.length === 1 ? (
            selectedMessage?.file?.map((file, index) => (
              <img
                className=" max-w-4xl object-cover aspect-auto"
                src={file}
                key={index}
              />
            ))
          ) : (
            <Carousel className="w-3/4 grid place-items-center">
              <CarouselContent>
                {selectedMessage?.file?.map((file, index) => (
                  <CarouselItem key={index} className="grid place-items-center">
                    <img className=" scale-75" src={file} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </DialogContent>
      </Dialog>

      <div ref={view}></div>
    </div>
  );
}

export default MessageContainer;
