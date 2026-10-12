/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../assets/api";
import Swal from "sweetalert2";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { motion } from "framer-motion";
import registerAnimation from "../utils/registerAnimation";

import jhAdminImg from "../assets/images/admin.jpg";
import logo from "../assets/images/logo.jpg";
import schoolDraw from "../assets/images/schooldraw.png";

import {
  User,
  LockKeyhole,
  GraduationCap,
  Layers,
  BookOpen,
  ImagePlus,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    course: "",
    section: "",
    year_lvl: "",
    username: "",
    password: "",
    repeat_password: "",
    profile_picture: null,
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, [name]: files[0] });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const isPasswordMatch =
    form.password &&
    form.repeat_password &&
    form.password === form.repeat_password;

  const isPasswordValid = form.password.length >= 5;

  const isFormValid =
    form.full_name &&
    form.course &&
    form.section &&
    form.year_lvl &&
    form.username &&
    form.password &&
    form.repeat_password &&
    isPasswordMatch &&
    isPasswordValid;

  const handleSubmit = async () => {
    if (!isPasswordMatch || !isPasswordValid) return;

    setLoading(true);

    const formData = new FormData();

    formData.append("username", form.username);
    formData.append("full_name", form.full_name);
    formData.append("password", form.password);
    formData.append("course", form.course);
    formData.append("section", form.section);
    formData.append("year_lvl", form.year_lvl);

    if (form.profile_picture) {
      formData.append("profile_picture", form.profile_picture);
    }

    try {
      await api.post("/api/register/student/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await Swal.fire({
        icon: "success",
        title: "Registered Successfully",
        text: "Your account has been created.",
      });

      navigate("/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text:
          err.response?.data?.detail ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      {...registerAnimation.page}
      className="min-h-screen flex items-center justify-center p-6"
    >
      <div className="w-full max-w-7xl grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* =========================
            LEFT PANEL
        ========================== */}
        <motion.div
          {...registerAnimation.leftPanel}
          className="relative hidden lg:flex flex-col justify-between overflow-hidden p-14 text-white"
        >
          {/* Background Image */}
          <img
            src={jhAdminImg}
            alt="JHCSC Admin"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Green Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-600/90 via-green-800/20 to-transparent" />

          {/* Overall Overlay */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur">
                <img src={logo} className="rounded-full" alt="JHCSC Logo" />
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
              Student
              <br />
              Registration
            </h1>

            <p className="mt-6 text-green-100 leading-8 text-lg">
              Create your student account and gain access to the modern room
              scheduling platform of JHCSC Canuto Campus.
            </p>
          </div>

          {/* Bottom Features */}
          <div className="relative z-10 space-y-4 text-green-100">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              Fast Student Registration
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              Secure Account Approval
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              Easy Room Reservation
            </div>
          </div>

          {/* Floating Decorations */}
          <motion.div
            {...registerAnimation.floatingTop}
            className="absolute right-[-120px] top-[-100px] z-10 h-80 w-80 rounded-full bg-white/10 blur-2xl"
          />

          <motion.div
            {...registerAnimation.floatingBottom}
            className="absolute bottom-[-100px] left-[-80px] z-10 h-64 w-64 rounded-full bg-green-300/20 blur-3xl"
          />
        </motion.div>

        {/* =========================
            RIGHT PANEL
        ========================== */}
        <motion.div
          {...registerAnimation.form}
          className="relative flex items-center justify-center bg-white px-8 py-12 sm:px-12"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full max-w-xl z-10 mb-24"
          >
            {/* Title */}
            <motion.div {...registerAnimation.title} className="mb-8">
              <h2 className="text-4xl font-bold text-green-700">
                Create Account
              </h2>

              <p className="mt-3 text-slate-500">
                Fill in your information to create your student account.
              </p>
            </motion.div>

            <div className="space-y-5">
              {/* =========================
                  FULL NAME
              ========================== */}
              <motion.div {...registerAnimation.input(0.45)}>
                <div className="relative">
                  <User
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="full_name"
                    type="text"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-md border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-slate-800 transition-all duration-200 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </motion.div>

              {/* =========================
                  COURSE / YEAR / SECTION
              ========================== */}
              <motion.div
                {...registerAnimation.input(0.55)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {/* Course */}
                <div className="relative">
                  <GraduationCap
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-md border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 transition-all duration-200 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  >
                    <option value="">Course</option>
                    <option value="BTVTED">BTVTED</option>
                    <option value="BSIS">BSIS</option>
                    <option value="ACT">ACT</option>
                  </select>
                </div>

                {/* Year */}
                <div className="relative">
                  <BookOpen
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    name="year_lvl"
                    value={form.year_lvl}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-md border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 transition-all duration-200 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  >
                    <option value="">Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                {/* Section */}
                <div className="relative">
                  <Layers
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-md border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-slate-700 transition-all duration-200 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  >
                    <option value="">Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </motion.div>

              {/* =========================
                  USERNAME
              ========================== */}
              <motion.div {...registerAnimation.input(0.65)}>
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
                    placeholder="Choose a username"
                    className="w-full rounded-md border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 text-slate-800 transition-all duration-200 outline-none focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </motion.div>

              {/* =========================
                  PROFILE PICTURE
              ========================== */}
              <motion.div {...registerAnimation.input(0.75)}>
                <div className="relative">
                  <ImagePlus
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
                  />

                  <input
                    type="file"
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full rounded-md border border-slate-300 bg-slate-50 py-2.5 pl-12 pr-4 text-sm text-slate-600 transition-all file:mr-4 file:rounded-md file:border-0 file:bg-green-600 file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-green-700 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  />
                </div>
              </motion.div>

              {/* =========================
                  PASSWORDS
              ========================== */}
              <motion.div {...registerAnimation.input(0.85)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="relative">
                    <LockKeyhole
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
                    />

                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Password"
                      className={`w-full rounded-md border bg-slate-50 py-3 pl-12 pr-12 text-slate-800 outline-none transition-all duration-200 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 ${
                        !isPasswordValid && form.password
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
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

                  {/* Repeat Password */}
                  <div className="relative">
                    <LockKeyhole
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10"
                    />

                    <input
                      name="repeat_password"
                      type={showRepeatPassword ? "text" : "password"}
                      value={form.repeat_password}
                      onChange={handleChange}
                      required
                      placeholder="Repeat Password"
                      className={`w-full rounded-md border bg-slate-50 py-3 pl-12 pr-12 text-slate-800 outline-none transition-all duration-200 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100 ${
                        form.repeat_password && !isPasswordMatch
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-green-600"
                    >
                      {showRepeatPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password validation */}
                {!isPasswordValid && form.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    Password must contain at least 5 characters.
                  </motion.p>
                )}

                {form.repeat_password && !isPasswordMatch && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    Passwords do not match.
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* =========================
                CREATE ACCOUNT BUTTON
            ========================== */}
            <motion.button
              {...registerAnimation.button}
              type="submit"
              disabled={!isFormValid || loading}
              className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition-all duration-300 ${
                loading || !isFormValid
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-gradient-to-r from-green-600 to-emerald-600 hover:-translate-y-0.5 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "white" }} />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>

            {/* =========================
                OR DIVIDER
            ========================== */}
            <div className="my-7 flex items-center">
              <div className="h-px flex-1 bg-slate-300"></div>

              <span className="mx-4 text-sm text-slate-400">OR</span>

              <div className="h-px flex-1 bg-slate-300"></div>
            </div>

            {/* =========================
                BACK TO LOGIN
            ========================== */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition hover:border-green-500 hover:bg-green-50 hover:text-green-600"
              >
                Back to Login
              </Link>
            </motion.div>

            {/* =========================
                LOGIN LINK
            ========================== */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?
              <Link
                to="/"
                className="ml-2 font-semibold text-green-600 hover:text-green-700"
              >
                Sign In
              </Link>
            </p>
          </form>

          {/* Bottom Illustration */}
          <img
            src={schoolDraw}
            className="absolute -bottom-8 sm:-bottom-28 pointer-events-none select-none"
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

export default Register;
