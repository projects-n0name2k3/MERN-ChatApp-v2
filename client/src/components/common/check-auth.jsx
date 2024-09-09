import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, children }) {
  const location = useLocation();

  if (location.pathname === "/") {
    if (!isAuthenticated) {
      return <Navigate to="/auth/sign-in" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/sign-in") ||
      location.pathname.includes("/sign-up")
    ) &&
    !location.pathname.includes("/active/ey")
  ) {
    return <Navigate to="/auth/sign-in" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/sign-in") ||
      location.pathname.includes("/sign-up") ||
      location.pathname.includes("/active"))
  ) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
