import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { activeAccount } from "@/store/auth/authSlice";
import { useToast } from "@/hooks/use-toast";
function ActivePage() {
  const [value, setValue] = useState(""); // State to store the OTP
  const { token } = useParams();
  console.log(token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const handleVerify = () => {
    dispatch(activeAccount({ token: token, otp: value }))
      .then((data) => {
        if (data?.payload?.success) {
          toast({
            title: data?.payload?.message,
          });
          navigate("/auth/sign-in");
        } else {
          toast({
            title: data?.payload?.message,
            variant: "destructive",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleBack = () => {
    // Logic to go back
    navigate("/auth/sign-in");
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle
            className="font-extrabold
      "
          >
            Activation.
          </CardTitle>
          <CardDescription className="text-base font-semibold text-muted-foreground">
            Verify your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center w-full justify-center">
          <InputOTP
            maxLength={4}
            pattern={REGEXP_ONLY_DIGITS}
            value={value}
            onChange={(value) => setValue(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 w-full">
          <Button className="w-full" onClick={handleVerify}>
            Verify
          </Button>

          <Button className="w-full" variant="outline" onClick={handleBack}>
            Back
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default ActivePage;
