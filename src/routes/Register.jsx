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
      className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-6"
    >
      <div className="w-full max-w-7xl grid lg:grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-2xl">
        <motion.div
          {...registerAnimation.leftPanel}
          className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-14 text-white"
        >
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">
                J
              </div>

              <div>
                <h3 className="font-bold text-xl">JHCSC Canuto Campus</h3>

                <p className="text-blue-100 text-sm">Room Scheduling System</p>
              </div>
            </div>

            <h1 className="mt-16 text-5xl font-bold leading-tight">
              Student
              <br />
              Registration
            </h1>

            <p className="mt-6 text-blue-100 leading-8 text-lg">
              Register your account to access the intelligent room scheduling
              platform of JHCSC Canuto Campus.
            </p>
          </div>

          <div className="space-y-4 text-blue-100">
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

          <motion.div
            {...registerAnimation.floatingTop}
            className="absolute right-[-120px] top-[-100px] h-80 w-80 rounded-full bg-white/10 blur-2xl"
          />

          <motion.div
            {...registerAnimation.floatingBottom}
            className="absolute bottom-[-100px] left-[-80px] h-64 w-64 rounded-full bg-blue-300/20 blur-3xl"
          />
        </motion.div>

        <motion.div
          {...registerAnimation.form}
          className="flex items-center justify-center bg-white px-8 py-12 sm:px-12"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-full max-w-xl"
          >
            <motion.div {...registerAnimation.title} className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900">
                Create Account
              </h2>

              <p className="mt-3 text-slate-500">
                Fill in your information to create your student account.
              </p>
            </motion.div>

            <div className="space-y-6">
              <motion.div {...registerAnimation.input(0.45)}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  name="full_name"
                  type="text"
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter your full name"
                />
              </motion.div>

              <motion.div
                {...registerAnimation.input(0.55)}
                className="grid grid-cols-3 gap-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Course
                  </label>

                  <select
                    name="course"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Course</option>
                    <option value="BTVTED">BTVTED</option>
                    <option value="BSIS">BSIS</option>
                    <option value="ACT">ACT</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Year
                  </label>

                  <select
                    name="year_lvl"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Section
                  </label>

                  <select
                    name="section"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </motion.div>

              <motion.div {...registerAnimation.input(0.65)}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Username
                </label>

                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </motion.div>

              <motion.div {...registerAnimation.input(0.75)}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Profile Picture (Optional)
                </label>

                <input
                  type="file"
                  name="profile_picture"
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-300 bg-slate-50 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                />
              </motion.div>

              <motion.div {...registerAnimation.input(0.85)}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange}
                      placeholder="Password"
                      className={`w-full rounded-xl border bg-slate-50 px-4 py-3 pr-12 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 ${
                        !isPasswordValid && form.password
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
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

                  <div className="relative">
                    <input
                      name="repeat_password"
                      type={showRepeatPassword ? "text" : "password"}
                      onChange={handleChange}
                      placeholder="Repeat Password"
                      className={`w-full rounded-xl border bg-slate-50 px-4 py-3 pr-12 outline-none transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 ${
                        form.repeat_password && !isPasswordMatch
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition"
                    >
                      {showRepeatPassword ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </button>
                  </div>
                </div>

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

            <motion.button
              {...registerAnimation.button}
              type="submit"
              disabled={!isFormValid || loading}
              className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white transition-all duration-300 ${
                loading || !isFormValid
                  ? "cursor-not-allowed bg-slate-400"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl"
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

            <div className="my-8 flex items-center">
              <div className="h-px flex-1 bg-slate-300"></div>
              <span className="mx-4 text-sm text-slate-400">OR</span>
              <div className="h-px flex-1 bg-slate-300"></div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
              >
                Back to Login
              </Link>
            </motion.div>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?
              <Link
                to="/"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign In
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Register;
