import { BrowserRouter, Routes, Route } from "react-router-dom";

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
