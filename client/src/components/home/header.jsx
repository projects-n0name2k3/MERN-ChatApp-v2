import { LogOut, Menu, Moon, SquarePen, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent } from "../ui/sheet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { useTheme } from "../theme-provider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "@/store/auth/authSlice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/search/searchSlice";
import FoundItem from "../chat/found-item";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { updateInfo, updatePassword } from "@/store/user/userSlice";
import { useToast } from "@/hooks/use-toast";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/helpers/validate";
import Form from "../common/form";
import { changePasswordFormControls } from "@/config";
import MultipleSelector from "../common/multiSelect";
import axios from "axios";
import { createChannel } from "@/store/channel/channelSlice";

function HomeHeader() {
  const [open, setOpen] = useState(false);
  const [channelMode, setChannelMode] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const { searchResults, isLoading } = useSelector((state) => state.search);
  const [search, setSearch] = useState("");
  const [channelName, setChannelName] = useState("");
  const [isDark, setMode] = useState(() => {
    const theme = localStorage.getItem("vite-ui-theme");
    return theme ? theme !== "light" : true;
  });
  const [formDataInfo, setFormDataInfo] = useState({
    username: "",
    email: "",
  });
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const { user } = useSelector((state) => state.auth);
  const { setTheme } = useTheme();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const dispatch = useDispatch();
  const { toast } = useToast();
  useEffect(() => {
    if (search && search.trim() !== "") {
      dispatch(getSearchResults(search));
    } else {
      dispatch(resetSearchResults());
    }
  }, [search]);

  useEffect(() => {
    const getAllContacts = async () => {
      await axios
        .get("http://localhost:3000/api/search", {
          withCredentials: true,
        })
        .then((res) => {
          setAllContacts(res?.data?.data);
        });
    };

    getAllContacts();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleUpdateInfo = () => {
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
      formDataInfo.username === user?.username
    ) {
      return toast({
        title: "No changes detected",
        variant: "destructive",
      });
    }
    dispatch(
      updateInfo({
        userId: user?.id,
        formData: { ...formDataInfo },
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
        setFormDataInfo({
          username: "",
          email: "",
        });
        setOpenProfileDialog(false);
        setOpen(false);
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
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
        setFormData({
          oldPassword: "",
          newPassword: "",
        });
        setOpenProfileDialog(false);
        setOpen(false);
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  };

  const createNewChannel = () => {
    if (channelName) {
      const isValid = validateUsername(channelName);
      if (isValid !== true) {
        return toast({
          title: isValid,
          variant: "destructive",
        });
      }

      if (selectedContacts.length < 1) {
        return toast({
          title: "Please select contacts",
          variant: "destructive",
        });
      }

      const members = selectedContacts.map((contact) => contact.value);
      const formData = {
        name: channelName,
        members,
      };
      dispatch(createChannel(formData)).then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message,
          });

          setOpenCreateDialog(false);
          setChannelName("");
        } else {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <div>
      <div className="w-full flex items-center justify-between py-4 lg:flex-row-reverse md:hidden lg:flex">
        <SquarePen
          size={24}
          onClick={() => setOpenCreateDialog(true)}
          className="cursor-pointer"
        />
        <span className="font-bold text-xl tracking-normal ">Messages</span>
        <Menu size={24} onClick={() => setOpen(true)} className="lg:hidden" />
      </div>
      <Sheet open={open} onOpenChange={() => setOpen(false)}>
        <SheetContent className="md:hidden lg:hidden">
          <div
            className="flex items-center gap-3 "
            onClick={() => setOpenProfileDialog(true)}
          >
            <Avatar>
              <AvatarImage src={user?.image} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user?.username}</span>
          </div>
          <div className="w-full h-[1px] bg-gray-500 my-3"></div>
          <Card>
            <CardContent className="flex flex-col py-4 gap-4">
              <div className="flex gap-2 items-center">
                {isDark ? <Moon /> : <Sun />}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="mode"
                    onCheckedChange={() => {
                      setMode(!isDark);
                      setTheme(isDark ? "light" : "dark");
                    }}
                    checked={isDark}
                  />
                  <Label htmlFor="mode">Mode</Label>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={handleLogout}>
                <LogOut />
                <span className="font-bold text-sm">Logout</span>
              </div>
            </CardContent>
          </Card>
        </SheetContent>
      </Sheet>
      <Dialog
        open={openCreateDialog}
        onOpenChange={() => {
          setOpenCreateDialog(false);
          setSearch("");
        }}
      >
        <DialogContent className="w-[85%] rounded">
          <DialogHeader>
            <DialogTitle>New message</DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex items-center space-x-2 my-4 justify-center">
              <Switch
                id="airplane-mode"
                onCheckedChange={() => setChannelMode(!channelMode)}
                checked={channelMode}
              />
              <Label htmlFor="airplane-mode">
                Channel Mode is {channelMode ? "on" : "off"}
              </Label>
            </div>
            <div
              className={` items-center gap-2 ${
                channelMode ? "hidden" : "flex"
              }`}
            >
              <Label>To:</Label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div
              className={`${channelMode ? "flex flex-col gap-4" : "hidden"}`}
            >
              <Input
                placeholder="Channel's Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
              <MultipleSelector
                className="rounded-lg "
                defaultOptions={allContacts}
                placeholder="Search Contacts"
                value={selectedContacts}
                onChange={setSelectedContacts}
                emptyIndicator={
                  <div className="flex items-center justify-center h-20 text-muted-foreground">
                    No contacts found
                  </div>
                }
              />
            </div>
            <ScrollArea className="h-[30vh] space-y-4">
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="w-[80%]">
                      <Skeleton className="h-4 w-[80%]" />
                    </div>
                  </div>
                ))}
              {!isLoading &&
                searchResults &&
                searchResults.length > 0 &&
                searchResults.map((item) => (
                  <FoundItem
                    setOpenCreateDialog={setOpenCreateDialog}
                    item={item}
                    key={item._id}
                  />
                ))}
            </ScrollArea>
          </div>
          <DialogFooter className={`${channelMode ? "block" : "hidden"}`}>
            <Button className="w-full" onClick={createNewChannel}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openProfileDialog}
        onOpenChange={() => setOpenProfileDialog(false)}
      >
        <DialogContent className="w-full h-full md:hidden lg:hidden">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <div className="flex flex-col items-center justify-start py-10">
              <Avatar className="w-32 h-32 my-10">
                <AvatarImage src={user?.image} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Tabs defaultValue="account" className="w-full mt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                      <CardDescription>
                        Make changes to your account here. Click save when
                        you're done.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1 flex flex-col items-start gap-2">
                        <Label htmlFor="name">Username</Label>
                        <Input
                          id="name"
                          defaultValue={user?.username}
                          onChange={(e) => {
                            setFormDataInfo({
                              ...formDataInfo,
                              username: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1 flex flex-col items-start gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          defaultValue={user?.email}
                          onChange={(e) => {
                            setFormDataInfo({
                              ...formDataInfo,
                              email: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      <Button variant="destructive">Deactive account</Button>
                      <Button onClick={handleUpdateInfo}>Save changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="password">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>
                        Change your password here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Form
                        formControls={changePasswordFormControls}
                        formData={formData}
                        otherStyles={"hidden"}
                        setFormData={setFormData}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={handleUpdatePassword}>
                        Save password
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HomeHeader;
