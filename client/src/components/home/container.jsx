import React, { useEffect, useState } from "react";
import ChatTtem from "../chat/chat-item";
import { ScrollArea } from "../ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { getContacts } from "@/store/test/testSlice";
import { getChannels } from "@/store/channel/channelSlice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
function ChatContainer({ contacts }) {
  const dispatch = useDispatch();

  const { selectedChatMessages, selectedChatData } = useSelector(
    (state) => state.test
  );
  const { channels } = useSelector((state) => state.channel);
  const [active, setActive] = useState(selectedChatData?._id || "");
  useEffect(() => {
    setActive(selectedChatData && selectedChatData._id);
  }, [selectedChatData]);
  useEffect(() => {
    dispatch(getContacts());
  }, [selectedChatMessages]);

  useEffect(() => {
    dispatch(getChannels());
  }, []);

  return (
    <ScrollArea className="w-full flex flex-col gap-1 h-[85%] px-2">
      <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Direct Message</AccordionTrigger>
          <AccordionContent>
            {contacts &&
              contacts.length > 0 &&
              contacts.map((item) => (
                <ChatTtem
                  item={item}
                  active={active}
                  setActive={setActive}
                  key={item._id}
                />
              ))}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Channels</AccordionTrigger>
          <AccordionContent>
            {channels &&
              channels.length > 0 &&
              channels.map((item) => (
                <ChatTtem
                  item={item}
                  active={active}
                  setActive={setActive}
                  key={item._id}
                  type="channel"
                />
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  );
}

export default ChatContainer;
