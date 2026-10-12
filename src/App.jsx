import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";
import Register from "./routes/Register";
import Settings from "./routes/Settings";
import Users from "./routes/Users";
import Calendar from "./routes/Calendar";

function Logout() {
  localStorage.removeItem("user");
  return <Navigate to="/" replace />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600">Page not found.</p>
      <a
        href="/dashboard"
        className="rounded-lg bg-[#246B4F] px-5 py-2 text-white hover:bg-[#1D5B43]"
      >
        Back to Dashboard
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/users" element={<Users />} />

        {/* Logout */}
        <Route path="/logout" element={<Logout />} />

        {/* Unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
