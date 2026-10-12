import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";
import Register from "./routes/Register";
import Settings from "./routes/Settings";
import Users from "./routes/Users";
import Calendar from "./routes/Calendar";
function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/calendar" element={<Calendar/>} />
        <Route path="/users" element={<Users/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
