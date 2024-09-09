import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./components/auth/sign-in";
import SignUp from "./components/auth/sign-up";
import Home from "./pages/home";
import Message from "./pages/message";
import ActivePage from "./pages/auth/activePage";
import { checkAuth } from "./store/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "./components/ui/skeleton";
import AuthLayout from "./pages/auth/layout";
import CheckAuth from "./components/common/check-auth";
import { Loader2 } from "lucide-react";
import Forgot from "./pages/auth/forgot";
import ResetPassword from "./pages/auth/reset-password";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading)
    return (
      <div className="w-screen h-screen grid place-items-center">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <CheckAuth isAuthenticated={isAuthenticated}>
            <AuthLayout />
          </CheckAuth>
        }
      >
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="active/:token" element={<ActivePage />} />
        <Route path="*" element={<Navigate to="/auth/sign-in" />} />
      </Route>
      <Route path="/" element={<Home isAuthenticated={isAuthenticated} />}>
        <Route path="messages/:id" element={<Message />} />
      </Route>
      {/* <Route path="/messages/:id" element={<Message />} /> */}
      <Route
        path="/forgot-password"
        element={<Forgot isAuthenticated={isAuthenticated} />}
      />
      <Route
        path="/reset-password/:token"
        element={<ResetPassword isAuthenticated={isAuthenticated} />}
      />

      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  );
}

export default App;
