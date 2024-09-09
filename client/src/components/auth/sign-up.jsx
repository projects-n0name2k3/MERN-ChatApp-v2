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
import { registerFormControls } from "@/config";
import { icons } from "@/constants";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/auth/authSlice";
import { useToast } from "@/hooks/use-toast";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "@/helpers/validate";
const initialState = {
  username: "",
  email: "",
  password: "",
};
function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { isLoading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialState);
  const onSubmit = (e) => {
    e.preventDefault();
    if (formData.username) {
      const isValid = validateUsername(formData.username);
      if (isValid !== true) {
        return toast({
          title: isValid,
          variant: "destructive",
        });
      }
    }
    if (formData.email) {
      const isValid = validateEmail(formData.email);
      if (isValid !== true) {
        return toast({
          title: isValid,
          variant: "destructive",
        });
      }
    }
    if (formData.password) {
      const isValid = validatePassword(formData.password);
      if (isValid !== true) {
        return toast({
          title: isValid,
          variant: "destructive",
        });
      }
    }
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate(`/auth/active/${data.payload.token}`);
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  };
  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle
            className="font-extrabold
          "
          >
            Welcome.
          </CardTitle>
          <CardDescription className="text-base font-semibold text-muted-foreground">
            Create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            formControls={registerFormControls}
            buttonText={"Sign Up"}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <p className="uppercase text-xs tracking-wide font-medium text-muted-foreground">
            OR SIGN UP WITH
          </p>

          <img src={icons.google} className="w-8 h-8 object-cover" />
          <p className="align-bottom text-xs font-normal ">
            Already have an account?{" "}
            <Link className="font-bold" to="/auth/sign-in">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
}

export default SignUp;
