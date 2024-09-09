import MessageContainer from "@/components/messages/container";
import MessageFooter from "@/components/messages/footer";
import MessageHeader from "@/components/messages/header";
import { ScrollArea } from "@/components/ui/scroll-area";

function Message() {
  return (
    <div className="flex flex-col justify-between h-screen w-full">
      <div className=" w-full mt-4">
        <MessageHeader />
      </div>
      <ScrollArea className="h-full w-full">
        <MessageContainer />
      </ScrollArea>
      <div className="w-full">
        <MessageFooter />
      </div>
    </div>
  );
}

export default Message;
