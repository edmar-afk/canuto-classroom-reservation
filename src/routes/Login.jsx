/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../assets/api";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import loginAnimation from "../utils/loginAnimation";
function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await api.post("/api/login/", {
      username: form.username,
      password: form.password,
    });

    const data = res.data;

    // Login successful — no staff/superuser checking
    localStorage.setItem("user", JSON.stringify(data));

    await Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back!",
      confirmButtonColor: "#2563eb",
    });

    navigate("/dashboard");
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Incorrect username or password",
      confirmButtonColor: "#dc2626",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      {...loginAnimation.page}
      className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-7xl grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-2xl">
        <motion.div
          {...loginAnimation.leftPanel}
          className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-14 text-white"
        >
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur">
                J
              </div>

              <div>
                <h3 className="font-bold text-xl">JHCSC Canuto Campus</h3>
                <p className="text-blue-100 text-sm">Room Scheduling System</p>
              </div>
            </div>

            <h1 className="mt-16 text-5xl font-bold leading-tight">
              Smart Room
              <br />
              Scheduling
            </h1>

            <p className="mt-6 text-blue-100 leading-8 text-lg">
              A modern web-based platform that simplifies classroom scheduling,
              reservation management, and administrative monitoring for JHCSC
              Canuto Campus.
            </p>
          </div>

          <div className="space-y-4 text-blue-100">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              Fast Room Reservation
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              Secure Administrator Access
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              Real-Time Schedule Monitoring
            </div>
          </div>

          <motion.div
            {...loginAnimation.floatingTop}
            className="absolute right-[-120px] top-[-100px] h-80 w-80 rounded-full bg-white/10 blur-2xl"
          />

          <motion.div
            {...loginAnimation.floatingBottom}
            className="absolute bottom-[-100px] left-[-80px] h-64 w-64 rounded-full bg-blue-300/20 blur-3xl"
          />
        </motion.div>

        <motion.div
          {...loginAnimation.form}
          className="flex items-center justify-center bg-white px-8 py-12 sm:px-12"
        >
          <form onSubmit={handleLogin} className="w-full max-w-md">
            <motion.div {...loginAnimation.title} className="mb-10">
              <h2 className="text-4xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-3 text-slate-500">
                Sign in to continue to the Room Scheduling System.
              </p>
            </motion.div>

            <div className="space-y-6">
              <motion.div {...loginAnimation.input(0.55)}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </label>

                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 transition-all duration-200 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </motion.div>

              <motion.div {...loginAnimation.input(0.65)}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-800 transition-all duration-200 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"
                  >
                    {showPassword ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.button
              {...loginAnimation.button}
              type="submit"
              disabled={loading}
              className={`mt-8 w-full rounded-xl py-3.5 text-white font-semibold transition-all duration-300 ${
                loading
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-0.5 hover:shadow-xl"
              }`}
            >
              {loading ? "Logging in..." : "Sign In"}
            </motion.button>

            <div className="my-8 flex items-center">
              <div className="h-px flex-1 bg-slate-300"></div>
              <span className="mx-4 text-sm text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-300"></div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/register"
                className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                Create an Account
              </Link>
            </motion.div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?
              <Link
                to="/register"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                Register
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Login;
