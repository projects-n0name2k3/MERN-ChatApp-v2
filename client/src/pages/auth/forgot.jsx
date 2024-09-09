import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Forgot({ isAuthenticated }) {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);
  const handleSubmit = async () => {
    setIsLoading(true);
    await axios
      .post(
        "http://localhost:3000/api/auth/forgot-password",
        {
          email,
        },
        {
          withCredentials: true,
        }
      )
      .then((data) => {
        if (data?.data?.success) {
          setIsSuccess(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast({
            title: data?.data?.message,
            variant: "destructive",
          });
          navigate("/auth/sign-in");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-screen h-screen grid place-items-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="font-extrabold">Forgot Password.</CardTitle>
          <CardDescription className="text-base font-semibold text-muted-foreground">
            Please enter your email address. We will send you an email contain
            OTP to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {!isSuccess ? (
              <>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mt-2 space-y-2">
                  <Button
                    disabled={!email || isLoading}
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Send Email"
                    )}
                  </Button>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/auth/sign-in")}
                  >
                    Back
                  </Button>
                </div>
              </>
            ) : (
              <div className="mt-2">
                <Button className="w-full">Email sent!</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Forgot;
