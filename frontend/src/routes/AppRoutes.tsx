import { useRoutes, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import SettingsPage from "../pages/SettingsPage";
import ProfilePage from "../pages/ProfilePage";
import { useAuthStore } from "../store/useAuthStore";

const AppRoutes = () => {
  const { authUser } = useAuthStore();

  const routes = [
    // Public routes
    {
      path: "/signup",
      element: !authUser ? <SignUpPage /> : <Navigate to="/" replace />,
    },
    {
      path: "/login",
      element: !authUser ? <LoginPage /> : <Navigate to="/" replace />,
    },
    {
      path: "/settings",
      element: <SettingsPage />,
    },

    // Protected routes
    {
      path: "/",
      element: authUser ? <HomePage /> : <Navigate to="/login" replace />,
    },
    {
      path: "/profile",
      element: authUser ? <ProfilePage /> : <Navigate to="/login" replace />,
    },

    // Catch-all (optional)
    { path: "*", element: <Navigate to={authUser ? "/" : "/login"} replace /> },
  ];

  const route = useRoutes(routes);
  return route;
};

export default AppRoutes;
