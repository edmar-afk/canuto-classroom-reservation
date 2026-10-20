import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import api from "../../assets/api";

/* =========================================================
   PASSWORD INPUT
   IMPORTANT:
   This component is OUTSIDE ProfileSettings so React keeps
   the same component identity and the input does not lose
   focus while typing.
========================================================= */

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) => (
  <div>
    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    <div className="relative">
      <LockKeyhole
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#173B2F] focus:bg-white focus:ring-4 focus:ring-[#173B2F]/10"
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  </div>
);

function ProfileSettings({ data, onProfileUpdate }) {
  const fileInputRef = useRef(null);

  const [userId, setUserId] = useState(null);

  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const getImageUrl = (path) => {
    if (!path) return "";

    // Already an absolute URL
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Relative Django media path
    return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  };
  /* ---------------------------------------------
     Get logged-in user ID
  --------------------------------------------- */

  useEffect(() => {
    const stored = localStorage.getItem("user");

    let parsed = {};

    try {
      parsed = stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
    }

    const id =
      data?.user?.id ??
      data?.student?.user_id ??
      (typeof data?.student?.user === "number"
        ? data.student.user
        : data?.student?.user?.id) ??
      data?.user_id ??
      parsed?.user?.id ??
      parsed?.user_id ??
      parsed?.id;

    if (id != null && id !== "") {
      setUserId(id);
    } else {
      setUserId(null);
      console.warn("Could not identify user ID:", {
        profileData: data,
        storedUser: parsed,
      });
    }
  }, [data]);

  /* ---------------------------------------------
     Load profile information
  --------------------------------------------- */

  useEffect(() => {
    if (!data) return;

    const firstName = data?.user?.first_name || "";
    const lastName = data?.user?.last_name || "";

    // Student's full_name takes priority
    let name = data?.student?.full_name || "";

    // Fallback to Django User name
    if (!name) {
      name = `${firstName} ${lastName}`.trim();
    }

    setFullName(name);

    if (data?.student?.profile_picture) {
      setImagePreview(getImageUrl(data.student.profile_picture));
    } else if (data?.user?.profile_picture) {
      setImagePreview(getImageUrl(data.user.profile_picture));
    }
  }, [data]);

  /* ---------------------------------------------
     Profile picture
  --------------------------------------------- */
  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Profile picture must be less than 5MB.");
      return;
    }

    setProfileError("");
    setProfileMessage("");

    setProfileImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview("");
  };

  /* ---------------------------------------------
     Save profile
  --------------------------------------------- */
  const handleProfileSave = async (event) => {
    event.preventDefault();

    if (!userId) {
      setProfileError("Unable to identify the current user.");
      return;
    }

    if (!fullName.trim()) {
      setProfileError("Full name cannot be empty.");
      return;
    }

    setSavingProfile(true);
    setProfileError("");
    setProfileMessage("");

    try {
      const formData = new FormData();

      formData.append("full_name", fullName.trim());

      if (profileImage) {
        formData.append("profile_picture", profileImage);
      }

      /*
       * If your Django API uses a different field name,
       * change "profile_picture" above.
       */
      const response = await api.put(`/api/profile/${userId}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileMessage("Your profile has been updated successfully.");

      if (response.data) {
        onProfileUpdate?.(response.data);
      }

      // Update localStorage if your stored user contains profile data.
      try {
        const stored = localStorage.getItem("user");

        if (stored) {
          const parsed = JSON.parse(stored);

          if (parsed?.user) {
            parsed.user.full_name = fullName.trim();

            if (response.data?.profile_picture) {
              parsed.user.profile_picture = response.data.profile_picture;
            }

            localStorage.setItem("user", JSON.stringify(parsed));
          }
        }
      } catch (error) {
        console.warn("Could not update localStorage:", error);
      }
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Something went wrong while updating your profile.";

      setProfileError(message);
    } finally {
      setSavingProfile(false);
    }
  };

  /* ---------------------------------------------
     Change password
  --------------------------------------------- */
  const handlePasswordSave = async (event) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setPasswordError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Your new password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("The new passwords do not match.");
      return;
    }

    if (!userId) {
      setPasswordError("Unable to identify the current user.");
      return;
    }

    setSavingPassword(true);

    try {
      /*
       * Change this endpoint if your Django backend
       * uses a different password API.
       */
      await api.put(`/api/profile/${userId}/`, {
        current_password: currentPassword,
        new_password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage("Your password has been changed successfully.");
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Unable to change your password.";

      setPasswordError(message);
    } finally {
      setSavingPassword(false);
    }
  };

  /* ---------------------------------------------
     Password strength
  --------------------------------------------- */
  const getPasswordStrength = () => {
    if (!newPassword) return 0;

    let strength = 0;

    if (newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength++;

    return strength;
  };

  const passwordStrength = getPasswordStrength();

  /* ---------------------------------------------
     Get initials
  --------------------------------------------- */
  const getInitials = () => {
    if (!fullName.trim()) return "U";

    return fullName
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  console.log("ProfileSettings data:", data);

  return (
    <div className="space-y-6">
      {/* =========================================
          PROFILE CARD
      ========================================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Green Header */}
        <div className="relative h-44 overflow-hidden bg-[#173B2F]">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[30px] border-white/5" />

          <div className="absolute -left-20 top-4 h-40 w-40 rounded-full bg-white/[0.03]" />

          <div className="absolute bottom-24 left-6 sm:left-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100/70">
              Account Settings
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">Your Profile</h2>
          </div>
        </div>

        <form onSubmit={handleProfileSave}>
          <div className="px-6 pb-7 pt-0 sm:px-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-[#173B2F] text-3xl font-bold text-white shadow-lg">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials()
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-4 border-white bg-[#173B2F] text-white shadow-md transition hover:bg-[#245544]"
                  title="Change profile picture"
                >
                  <Camera size={17} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="pb-1">
                <h3 className="text-lg font-bold text-slate-900">
                  {fullName || "Your Name"}
                </h3>

                <p className="mt-0.5 text-sm text-slate-400">
                  Manage your personal account information
                </p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="mt-8 grid gap-6">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#173B2F] focus:bg-white focus:ring-4 focus:ring-[#173B2F]/10"
                  />
                </div>
              </div>

              {/* Image controls */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Profile Picture
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#173B2F]/30 hover:bg-slate-50"
                  >
                    Choose Image
                  </button>

                  {profileImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  )}

                  <span className="text-xs text-slate-400">
                    JPG, PNG or WEBP · Max 5MB
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Error */}
            {profileError && (
              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {profileError}
              </div>
            )}

            {/* Profile Success */}
            {profileMessage && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <Check size={17} />
                {profileMessage}
              </div>
            )}

            {/* Save */}
            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 rounded-xl bg-[#173B2F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245544] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingProfile ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* =========================================
          SECURITY CARD
      ========================================= */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#173B2F]/10 text-[#173B2F]">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">Password & Security</h2>

              <p className="mt-1 text-sm text-slate-400">
                Keep your account secure with a strong password.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordSave} className="px-6 py-7 sm:px-8">
          <div className="grid gap-5">
            {/* Current Password */}
            <PasswordInput
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              show={showCurrentPassword}
              setShow={setShowCurrentPassword}
              placeholder="Enter your current password"
            />

            <div className="grid gap-5 md:grid-cols-2">
              {/* New Password */}
              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                show={showNewPassword}
                setShow={setShowNewPassword}
                placeholder="Enter a new password"
              />

              {/* Confirm Password */}
              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showConfirmPassword}
                setShow={setShowConfirmPassword}
                placeholder="Confirm your new password"
              />
            </div>

            {/* Password Strength */}
            {newPassword && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Password strength
                  </span>

                  <span className="text-xs font-semibold text-slate-500">
                    {passwordStrength === 4
                      ? "Strong"
                      : passwordStrength >= 2
                        ? "Medium"
                        : "Weak"}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition ${
                        level <= passwordStrength
                          ? "bg-[#173B2F]"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use 8+ characters with uppercase letters, numbers and symbols
                  for better security.
                </p>
              </div>
            )}
          </div>

          {/* Password Error */}
          {passwordError && (
            <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {passwordError}
            </div>
          )}

          {/* Password Success */}
          {passwordMessage && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <Check size={17} />
              {passwordMessage}
            </div>
          )}

          {/* Update Password */}
          <div className="mt-7 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 rounded-xl bg-[#173B2F] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#245544] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPassword ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Updating...
                </>
              ) : (
                <>
                  <LockKeyhole size={17} />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* =========================================
          SECURITY NOTE
      ========================================= */}
      <div className="flex items-start gap-3 rounded-2xl border border-[#173B2F]/10 bg-[#173B2F]/[0.035] px-5 py-4">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#173B2F]" />

        <div>
          <p className="text-sm font-semibold text-[#173B2F]">
            Your account security matters
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Never share your password with anyone. We recommend using a unique
            password that you do not use on other services.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;
