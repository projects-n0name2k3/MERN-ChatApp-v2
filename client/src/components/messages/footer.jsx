import { Images, Paperclip, Send, SmilePlus, XIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "@/context/SocketContext";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/config/firebase";

function MessageFooter() {
  const emojiRef = useRef(null);
  const fileRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [imagePercentage, setImagePercentage] = useState(0);
  const { socket } = useSocket();
  const { selectedChatType, selectedChatData } = useSelector(
    (state) => state.test
  );
  const { user } = useSelector((state) => state.auth);
  const [value, setValue] = useState("");
  const handleAddEmoji = (emoji) => {
    setValue((msg) => msg + emoji.emoji);
  };
  useEffect(() => {
    const handleClickOutsite = (e) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsite);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsite);
    };
  }, [emojiRef]);

  //if pressing enter then run sendMessage function
  const sendMessage = async () => {
    if (files.length > 0 && value.trim() !== "") {
      handleUploadFiles(value);
    }
    if (files.length > 0 && value.trim() === "") {
      handleUploadFiles("");
    }
    if (value.trim() === "" && files.length === 0) return;

    if (
      value.trim() !== "" &&
      selectedChatType === "contact" &&
      files.length === 0
    ) {
      socket.emit("sendMessage", {
        sender: user.id,
        receiver: selectedChatData._id,
        content: value,
        messageType: "text",
        file: undefined,
      });
      setValue("");
    } else if (
      value.trim() !== "" &&
      selectedChatType === "channel" &&
      files.length === 0
    ) {
      socket.emit("sendChannelMessage", {
        sender: user.id,
        content: value,
        messageType: "text",
        file: undefined,
        channelId: selectedChatData._id,
      });
      setValue("");
    }
  };

  const handleAttachFile = async () => {
    const file = fileRef.current.files[0];
    if (!file) return;
    setFiles((prev) => [...prev, file]);
  };

  const handleUploadFiles = async (content) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);

      const uploadPromises = files.map((file) => {
        const fileName = new Date().getTime() + file.name;

        const storageRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",

            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

              setImagePercentage(Math.round(progress));
            },

            (error) => {
              reject(error);
            },

            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                //console.log(downloadURL);

                resolve(downloadURL); // Resolve the promise with the downloadURL
              });
            }
          );
        });
      });
      setValue("");
      setFiles([]);
      Promise.all(uploadPromises)
        .then((downloadURLs) => {
          // Clear the files
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              sender: user.id,
              receiver: selectedChatData._id,
              content: content,
              messageType: "file",
              file: downloadURLs,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("sendChannelMessage", {
              sender: user.id,
              content: content,
              messageType: "file",
              file: downloadURLs,
              channelId: selectedChatData._id,
            });
          }

          resolve(downloadURLs); // Resolve the promise with the array of downloadURLs
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <div
      className={`${
        files && files.length > 0 ? "h-[20vh]" : "h-[10vh]"
      } border-t flex items-center flex-col justify-center gap-2 px-2 lg:px-6`}
    >
      <div
        className={` self-start border w-full p-4 items-center rounded gap-4 ${
          files && files.length > 0 ? "flex" : "hidden"
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (fileRef.current) fileRef.current.click();
          }}
        >
          <Images />
        </Button>
        {files && files.length > 0 && (
          <div className="flex gap-4">
            {files.map((file, index) => {
              return (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="file"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <XIcon
                    className="absolute -top-2 -right-3 cursor-pointer rounded-full bg-slate-500 hover:bg-slate-300"
                    size={20}
                    onClick={() => {
                      if (files.length === 1) {
                        setFiles([]);

                        fileRef.current.value = null;
                      } else {
                        setFiles(files.filter((_, i) => i !== index));
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="w-full flex items-center gap-2">
        <Input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          id="attach-file"
          onChange={handleAttachFile}
        />
        <Label htmlFor="attach-file">
          <Paperclip
            className="text-muted-foreground cursor-pointer"
            size={24}
          />
        </Label>
        <div className="relative w-full">
          <Input
            placeholder="Message"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-full w-full bg-transparent focus-visible:ring-offset-0 focus-visible:ring-0"
            onKeyPress={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <SmilePlus
            className="absolute top-2.5 right-4 text-secondary-foreground cursor-pointer hidden lg:block"
            size={20}
            onClick={() => setOpen(true)}
          />
          <div className="absolute right-0 bottom-10" ref={emojiRef}>
            <EmojiPicker
              open={open}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>

        <Send
          className="text-muted-foreground cursor-pointer hover:opacity-60"
          size={24}
          onClick={sendMessage}
        />
      </div>
    </div>
  );
}

export default MessageFooter;
