import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyMedia from "./pages/MyMedia";
import MyEvent from "./pages/MyEvent";
import Upload from "./pages/Upload";
import CreateEvent from "./pages/CreateEvent";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Landing from "./pages/LandingPage";
import FeaturesDocs from "./pages/FeaturesDocs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;

    let title = "ShareAlbum";

    if (pathname === "/") title = "ShareAlbum";
    else if (pathname === "/login") title = "Log In • ShareAlbum";
    else if (pathname === "/signup") title = "Sign Up • ShareAlbum";
    else if (pathname === "/dashboard") title = "Dashboard • ShareAlbum";
    else if (pathname === "/profile") title = "Profile • ShareAlbum";
    else if (pathname === "/ceremony/create")
      title = "Create Event • ShareAlbum";
    else if (pathname === "/reset-password")
      title = "Reset Password • ShareAlbum";
    else if (pathname.includes("/upload")) title = "Add Media • ShareAlbum";
    else if (pathname.includes("/manage")) title = "Manage Event • ShareAlbum";
    else if (pathname.includes("/my-media")) title = "My Media • ShareAlbum";
    else if (pathname.startsWith("/ceremony/")) title = "Gallery • ShareAlbum";
    else title = "Page Not Found • ShareAlbum";

    document.title = title;
  }, [location]);

  return null;
}

function useToastPosition() {
  const [position, setPosition] = useState(
    typeof window !== "undefined" && window.innerWidth < 640
      ? "top-center"
      : "bottom-right",
  );

  useEffect(() => {
    function update() {
      setPosition(window.innerWidth < 640 ? "top-center" : "bottom-right");
    }
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return position;
}

function App() {
  const toastPosition = useToastPosition();

  return (
    <AuthProvider>
      <BrowserRouter>
        <PageTitle />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/ceremony/:id" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
          {/* Protected */}
          <Route
            path="/ceremony/:id/my-media"
            element={
              <ProtectedRoute>
                <MyMedia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ceremony/:id/manage"
            element={
              <ProtectedRoute>
                <MyEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ceremony/:id/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ceremony/create"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPassword />} />{" "}
          <Route path="/features/:slug" element={<FeaturesDocs />} />
        </Routes>{" "}
        <ToastContainer
          position={toastPosition}
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
          style={{ "--toastify-color-progress-light": "#C9A87C" }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
