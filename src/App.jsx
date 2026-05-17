import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ceremony/:id" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ceremony/:id/my-media" element={<MyMedia />} />
        <Route path="/ceremony/:id/manage" element={<MyEvent />} />
        <Route path="/ceremony/:id/upload" element={<Upload />} />
        <Route path="/ceremony/create" element={<CreateEvent />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
