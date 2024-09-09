import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2, Lock, LogOut, Moon, Sun, Trash2, User } from "lucide-react";

import { useTheme } from "../theme-provider";

import { Button } from "../ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "@/store/auth/authSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Form from "../common/form";
import { changePasswordFormControls } from "@/config";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/helpers/validate";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { updateInfo, updatePassword } from "@/store/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "@/config/firebase";

function Sidebar() {
  const [isDark, setMode] = useState(() => {
    const theme = localStorage.getItem("vite-ui-theme");
    return theme ? theme !== "light" : true;
  });
  const [formData, setFormData] = useState({
    oldPassword: null,
    newPassword: null,
  });
  const [formDataInfo, setFormDataInfo] = useState({
    username: null,
    email: null,
  });
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputImageRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { setTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState("account");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  const { toast } = useToast();

  const handleUploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      const storage = getStorage(app);

      const fileName = new Date().getTime() + file.name;

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",

        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },

        (error) => {
          reject(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setIsUploading(false);
            resolve(downloadURL); // Resolve the promise with the downloadURL
          });
        }
      );
    });
  };

  const handleUpdateInfo = async () => {
    //validate before send to server
    if (formDataInfo.username) {
      const isValid = validateUsername(formDataInfo.username);
      if (isValid !== true) {
        return toast({
          title: isValid,
          variant: "destructive",
        });
      }
    }
    if (formDataInfo.email) {
      const isValid = validateEmail(formDataInfo.email);
      if (isValid !== true) {
        return toast({
          title: isValid,
          variant: "destructive",
        });
      }
    }
    if (
      formDataInfo.email === user?.email &&
      formDataInfo.username === user?.username &&
      !image
    ) {
      return toast({
        title: "No changes detected",
        variant: "destructive",
      });
    }

    if (image) {
      await handleUploadFile(image).then((data) =>
        dispatch(
          updateInfo({
            userId: user?.id,
            formData: { ...formDataInfo, image: data },
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(
              setUser({
                success: true,
                user: {
                  ...data?.payload?.data,
                },
              })
            );
            toast({
              title: data?.payload?.message,
            });
            setOpen(false);
          } else {
            toast({
              title: data?.payload?.message,
              variant: "destructive",
            });
          }
        })
      );
    }
  };

  const handleUpdatePassword = async () => {
    if (formData.oldPassword) {
      const isValid = validatePassword(formData.oldPassword);
      if (isValid !== true) {
        return toast({
          title: isValid,
          variant: "destructive",
        });
      }
    }
    if (formData.newPassword) {
      const isValid = validatePassword(formData.newPassword);
      if (isValid !== true) {
        return toast({
          title: isValid,
          variant: "destructive",
        });
      }
    }
    dispatch(
      updatePassword({
        userId: user?.id,
        formData,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(
          setUser({
            success: true,
            user: {
              ...data?.payload?.data,
            },
          })
        );
        toast({
          title: data?.payload?.message,
        });
        setOpen(false);
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="hidden lg:flex md:flex flex-col items-center justify-end py-4 px-2 gap-4 pb-8">
      <div>
        <Avatar className="cursor-pointer" onClick={() => setOpen(1)}>
          <AvatarImage src={user?.image} alt="@shadcn" />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="cursor-pointer" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setMode(!isDark);
                setTheme(isDark ? "light" : "dark");
              }}
            >
              {isDark ? <Moon /> : <Sun />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{isDark ? "Dark Mode" : "Light Mode"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      >
        <DialogContent className="max-w-6xl h-fit">
          <div className="grid grid-cols-2 gap-2">
            <div className="border-r flex flex-col gap-2 px-2">
              <div
                className={`flex items-center gap-2 p-2 hover:bg-card-foreground/10 rounded cursor-pointer ${
                  activeMenu === "account" && "bg-card-foreground/10"
                }`}
                onClick={() => setActiveMenu("account")}
              >
                <User />
                <span className="text-sm font-semibold">Profile</span>
              </div>
              <div
                className={`flex items-center gap-2 p-2 hover:bg-card-foreground/10 rounded cursor-pointer ${
                  activeMenu === "password" && "bg-card-foreground/10"
                }`}
                onClick={() => setActiveMenu("password")}
              >
                <Lock />
                <span className="text-sm font-semibold">Password</span>
              </div>
              <div className="w-full h-[0.5px] bg-gray-300"></div>
              <Button variant="ghost" className="text-red-500">
                <div className="gap-2 flex items-center">
                  {" "}
                  <Trash2 />
                  Delete your account
                </div>
              </Button>
            </div>
            <div
              className={`flex flex-col gap-2 ${
                activeMenu === "account" ? "flex" : "hidden"
              }`}
            >
              <DialogHeader>
                <DialogTitle className="text-3xl font-extrabold">
                  Edit profile
                </DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4">
                <div className="w-40 h-40 rounded border">
                  <img
                    src={(image && URL.createObjectURL(image)) || user?.image}
                    alt="profile"
                    className="w-full h-full rounded"
                  />
                </div>
                <div className="flex flex-col justify-between py-4">
                  <span className="text-sm font-semibold">
                    Upload your photo
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Your photo should be in PNG or JPG
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputImageRef}
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                      }}
                      accept="image/*"
                      type="file"
                      placeholder="Choose File"
                    />{" "}
                    <span
                      className="text-xs font-semibold text-muted-foreground hover:text-red-500 cursor-pointer"
                      onClick={() => {
                        inputImageRef.current.value = null;
                        setImage(null);
                      }}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Username</Label>
                  <Input
                    placeholder={user?.username}
                    onChange={(e) => {
                      setFormDataInfo({
                        ...formDataInfo,
                        username: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Email</Label>
                  <Input
                    placeholder={user?.email}
                    type="email"
                    onChange={(e) => {
                      setFormDataInfo({
                        ...formDataInfo,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div
              className={`flex flex-col gap-2 ${
                activeMenu === "password" ? "flex" : "hidden"
              }`}
            >
              <DialogHeader>
                <DialogTitle className="text-3xl font-extrabold">
                  Edit profile
                </DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-3 flex flex-col gap-4">
                <Form
                  formControls={changePasswordFormControls}
                  formData={formData}
                  otherStyles={"hidden"}
                  setFormData={setFormData}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(0)}>
              Cancel
            </Button>

            <Button
              disabled={
                (activeMenu === "account" &&
                  !formDataInfo.username &&
                  !formDataInfo.email &&
                  !image) ||
                (activeMenu === "password" &&
                  (!formData.oldPassword || !formData.newPassword)) ||
                isUploading
              }
              onClick={() => {
                if (activeMenu === "account") {
                  handleUpdateInfo();
                }
                if (activeMenu === "password") {
                  handleUpdatePassword();
                }
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span className="ml-2 text-sm font-semibold">Updating</span>
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Sidebar;
