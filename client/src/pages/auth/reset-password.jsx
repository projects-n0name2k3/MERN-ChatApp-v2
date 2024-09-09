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
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword({ isAuthenticated }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, []);
  const handleSubmit = async () => {
    setIsLoading(true);
    await axios
      .post(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        {
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((data) => {
        setIsLoading(false);
        if (data?.data?.success) {
          toast({
            title: data?.data?.message,
          });
          navigate("/auth/sign-in");
        }
      })
      .catch((err) => {
        toast({
          title: "Please try again",
          variant: "destructive",
        });
        setIsLoading(false);
        navigate("/auth/sign-in");
      });
  };
  return (
    <div className="w-screen h-screen grid place-items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="font-extrabold">Reset Password.</CardTitle>
          <CardDescription className="text-base font-semibold text-muted-foreground">
            Please enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={"New password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>

                  {/* hides browsers password toggles */}
                  <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
                </div>
              </>
            </div>
            <div className="mt-2">
              <Button
                disabled={!password.length || isLoading}
                className="w-full"
                onClick={handleSubmit}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Confirm"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPassword;
