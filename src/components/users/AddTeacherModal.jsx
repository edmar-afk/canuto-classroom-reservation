import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  X,
  UserPlus,
  Upload,
  User,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "../../assets/api";

function AddTeacherModal({ onCreated }) {
  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------------------------
     Password validation
  --------------------------------------------- */

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  /* ---------------------------------------------
     Form validation
  --------------------------------------------- */

  const isFormValid = useMemo(() => {
    return (
      fullName.trim() !== "" &&
      phoneNumber.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      password.length >= 6
    );
  }, [fullName, phoneNumber, password, confirmPassword]);

  /* ---------------------------------------------
     Open / Close
  --------------------------------------------- */

  const handleOpen = () => {
    setError("");
    setOpen(true);
  };

  const handleClose = () => {
    if (loading) return;

    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFullName("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");

    setProfilePicture(null);
    setPreview(null);

    setShowPassword(false);
    setShowConfirmPassword(false);

    setError("");
  };

  /* ---------------------------------------------
     Profile picture
  --------------------------------------------- */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------------------------------------
     Submit
  --------------------------------------------- */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || loading) return;

    setError("");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("full_name", fullName.trim());
      formData.append("phone_number", phoneNumber.trim());
      formData.append("password", password);
      formData.append("confirm_password", confirmPassword);

      if (profilePicture) {
        formData.append("profile_picture", profilePicture);
      }

      const response = await api.post("/api/users/teachers/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.success) {
        onCreated?.(response.data.teacher);

        setOpen(false);
        resetForm();
      }
    } catch (err) {
      console.error("Failed to create teacher:", err);

      const backendError = err.response?.data;

      if (backendError?.phone_number) {
        setError(
          Array.isArray(backendError.phone_number)
            ? backendError.phone_number[0]
            : backendError.phone_number,
        );
      } else if (backendError?.confirm_password) {
        setError(
          Array.isArray(backendError.confirm_password)
            ? backendError.confirm_password[0]
            : backendError.confirm_password,
        );
      } else if (backendError?.password) {
        setError(
          Array.isArray(backendError.password)
            ? backendError.password[0]
            : backendError.password,
        );
      } else if (backendError?.detail) {
        setError(backendError.detail);
      } else {
        setError("Failed to create teacher. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* =========================================
          OPEN BUTTON
      ========================================= */}

      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#173B2F] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f2d23]"
      >
        <UserPlus size={16} />
        Add Teacher
      </button>

      {/* =========================================
          MODAL
      ========================================= */}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
          },
        }}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#173B2F] text-white">
              <UserPlus size={19} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Add Teacher
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Create a new teacher account
              </p>
            </div>
          </div>

          <IconButton
            onClick={handleClose}
            disabled={loading}
            size="small"
            sx={{
              color: "#94a3b8",
              "&:hover": {
                backgroundColor: "#f1f5f9",
                color: "#334155",
              },
            }}
          >
            <X size={18} />
          </IconButton>
        </div>

        <DialogContent sx={{ padding: 0 }}>
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              {/* PROFILE PICTURE */}

              <div className="mb-6 flex flex-col items-center">
                <div className="relative">
                  <Avatar
                    src={preview || undefined}
                    sx={{
                      width: 88,
                      height: 88,
                      backgroundColor: "#173B2F",
                      fontSize: "28px",
                    }}
                  >
                    {!preview && <User size={32} />}
                  </Avatar>

                  <label
                    htmlFor="teacher-profile-picture"
                    className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-2 border-white bg-[#173B2F] text-white shadow-sm transition hover:bg-[#0f2d23]"
                  >
                    <Upload size={14} />
                  </label>

                  <input
                    id="teacher-profile-picture"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">JPG, PNG or WEBP</p>
              </div>

              {/* FULL NAME */}

              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter teacher's full name"
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <User size={17} className="mr-2 text-slate-400" />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </div>

              {/* PHONE NUMBER */}

              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="09XXXXXXXXX"
                  inputProps={{
                    maxLength: 11,
                  }}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <Phone size={17} className="mr-2 text-slate-400" />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </div>

              {/* PASSWORD */}

              <div className="mb-4">
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={loading}
                  helperText={
                    password.length > 0 && password.length < 6
                      ? "Password must be at least 6 characters."
                      : ""
                  }
                  error={password.length > 0 && password.length < 6}
                  InputProps={{
                    startAdornment: (
                      <LockKeyhole size={17} className="mr-2 text-slate-400" />
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  label="Repeat Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  disabled={loading}
                  error={passwordMismatch}
                  helperText={passwordMismatch ? "Passwords do not match." : ""}
                  InputProps={{
                    startAdornment: (
                      <LockKeyhole size={17} className="mr-2 text-slate-400" />
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {passwordsMatch && (
                          <CheckCircle2
                            size={18}
                            className="mr-1 text-emerald-500"
                          />
                        )}

                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </div>

              {/* ACCOUNT INFO */}

              <div className="mt-5 flex gap-3 rounded-xl border border-[#173B2F]/10 bg-[#173B2F]/5 p-4">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-[#173B2F]"
                />

                <div>
                  <p className="text-xs font-semibold text-[#173B2F]">
                    Teacher account
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Make sure to provide proper details. The teacher will use the provided phone number and password to log in.
                  </p>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="mt-4 flex gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
                  <AlertCircle size={16} className="shrink-0" />

                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button
                type="button"
                onClick={handleClose}
                disabled={loading}
                variant="outlined"
                sx={{
                  borderRadius: "12px",
                  padding: "9px 18px",
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#64748b",
                  borderColor: "#e2e8f0",
                  backgroundColor: "white",
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                    borderColor: "#cbd5e1",
                  },
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!isFormValid || loading}
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress size={15} sx={{ color: "white" }} />
                  ) : (
                    <UserPlus size={16} />
                  )
                }
                sx={{
                  borderRadius: "12px",
                  padding: "9px 18px",
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#173B2F",
                  "&:hover": {
                    backgroundColor: "#0f2d23",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#cbd5e1",
                    color: "#ffffff",
                  },
                }}
              >
                {loading ? "Creating..." : "Create Teacher"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddTeacherModal;
