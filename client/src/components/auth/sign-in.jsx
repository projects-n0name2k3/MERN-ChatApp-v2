import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Form from "../common/form";
import { loginFormControls } from "@/config";
import { icons } from "@/constants";
import { Link, useNavigate } from "react-router-dom";
import { doSignInWithGoogle } from "@/config/auth";
import { useDispatch } from "react-redux";
import { loginUser, setUser } from "@/store/auth/authSlice";
import { useToast } from "@/hooks/use-toast";
const initialState = {
  email: "",
  password: "",
};
function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialState);
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/");
      } else {
        if (data?.payload?.action) {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
          navigate(`/auth/active/${data.payload.token}`);
        } else {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
        }
      }
    });
  };
  const handleSignInWithGoogle = () => {
    doSignInWithGoogle()
      .then((data) => {
        if (data?.data.success) {
          toast({
            title: data?.data.message,
          });
          dispatch(setUser(data.data));
          navigate("/");
        } else {
          toast({
            title: data.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle
            className="font-extrabold
          "
          >
            Hello.
          </CardTitle>
          <CardDescription className="text-base font-semibold text-muted-foreground">
            Welcome back
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            formControls={loginFormControls}
            buttonText={"Sign In"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <p className="uppercase text-xs tracking-wide font-medium text-muted-foreground">
            or continue with
          </p>

          <Button variant="outline" onClick={handleSignInWithGoogle}>
            <img src={icons.google} className="w-8 h-8 object-cover" />
          </Button>
          <p className="align-bottom text-xs font-normal ">
            Don't have an account?{" "}
            <Link className="font-bold" to="/auth/sign-up">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}

export default SignIn;
