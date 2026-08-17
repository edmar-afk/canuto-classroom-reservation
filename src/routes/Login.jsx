/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../assets/api";
import Swal from "sweetalert2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import loginAnimation from "../utils/loginAnimation";
import jhAdminImg from "../assets/images/admin.jpg";
import logo from "../assets/images/logo.jpg";
import schoolDraw from "../assets/images/schooldraw.webp";
import { User, LockKeyhole } from "lucide-react";
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
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="w-full max-w-7xl grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-2xl">
        <motion.div
          {...loginAnimation.leftPanel}
          className="relative hidden lg:flex flex-col justify-between overflow-hidden p-14 text-white"
        >
          {/* Background Image */}
          <img
            src={jhAdminImg}
            alt="JHCSC Admin"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Black gradient: transparent at top → black at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-600/90 via-green-800/20 to-transparent" />

          {/* Optional overall dark overlay */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur">
                <img src={logo} className="rounded-full" alt="" />
              </div>

              <div>
                <h3 className="font-bold text-xl text-green-800">
                  JHCSC Canuto Campus
                </h3>
                <p className="text-gray-900 text-sm font-bold">
                  Lakewood, Zamboanga del Sur
                </p>
              </div>
            </div>

            <h1 className="mt-16 text-5xl font-bold leading-tight">
              Smart Room
              <br />
              Scheduling
            </h1>

            <p className="mt-6 text-green-100 leading-8 text-lg">
              A modern web-based platform that simplifies classroom scheduling,
              reservation management, and administrative monitoring for JHCSC
              Canuto Campus.
            </p>
          </div>

          {/* Bottom Features */}
          <div className="relative z-10 space-y-4 text-green-100">
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

          {/* Floating Decorations */}
          <motion.div
            {...loginAnimation.floatingTop}
            className="absolute right-[-120px] top-[-100px] z-10 h-80 w-80 rounded-full bg-white/10 blur-2xl"
          />

          <motion.div
            {...loginAnimation.floatingBottom}
            className="absolute bottom-[-100px] left-[-80px] z-10 h-64 w-64 rounded-full bg-green-300/20 blur-3xl"
          />
        </motion.div>

        <motion.div
          {...loginAnimation.form}
          className="relative flex items-center justify-center bg-white px-8 py-12 sm:px-12"
        >
          <form onSubmit={handleLogin} className="w-full max-w-md z-10 mb-24">
            <motion.div {...loginAnimation.title} className="mb-10 text-center">
              <h2 className="text-4xl font-bold text-green-700">
                Smart Scheduling System
              </h2>

              <p className="relative mt-3 text-slate-500 uppercase after:content-[''] after:block after:w-14 after:h-[4px] after:bg-green-700 after:mx-auto after:mt-4">
                For Academic Institution
              </p>
            </motion.div>

            <motion.div {...loginAnimation.input(0.55)} className="mb-8">
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                  className="w-full rounded-md border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-slate-800 transition-all duration-200 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                />
              </div>
            </motion.div>

            <motion.div {...loginAnimation.input(0.65)}>
              <div className="relative">
                <LockKeyhole
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-slate-300 bg-slate-50 py-3 pl-12 pr-12 text-slate-800 transition-all duration-200 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-green-600"
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.button
              {...loginAnimation.button}
              type="submit"
              disabled={loading}
              className={`mt-8 w-full rounded-xl py-3.5 text-white font-semibold transition-all duration-300 ${
                loading
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:-translate-y-0.5 hover:shadow-xl"
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
                className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
              >
                Create an Account
              </Link>
            </motion.div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?
              <Link
                to="/register"
                className="ml-2 font-semibold text-green-600 hover:text-green-700"
              >
                Register
              </Link>
            </p>
          </form>

          <img
            src={schoolDraw}
            className="absolute -bottom-8 sm:-bottom-24"
            alt=""
          />
        </motion.div>
        <div className="bg-green-800 w-full h-12 lg:col-span-2 z-[999] text-white text-center flex items-center justify-center">
          <p>@2026 J.H. Cerilles State College. All rights reserved.</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Login;
