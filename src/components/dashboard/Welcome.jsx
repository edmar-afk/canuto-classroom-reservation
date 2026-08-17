import React from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import classRoomImg from "../../assets/images/class.gif";

function Welcome() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-50 px-6 py-8 lg:px-10">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-144px)] max-w-7xl items-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 shadow-sm"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
                <Sparkles size={13} className="text-emerald-700" />
              </span>

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Smart Scheduling System
              </span>
            </motion.div>

            {/* Heading */}
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Where every
              <span className="relative mx-3 inline-block text-emerald-800">
                schedule
                <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-emerald-500/70" />
              </span>
              finds its place.
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
              Welcome to a smarter way of managing academic schedules. Organize
              classes, optimize time, and create a seamless experience for
              everyone in your institution.
            </p>

            {/* Mini Features */}
            <div className="mt-9 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <CalendarDays size={17} className="text-emerald-700" />
                <span className="text-sm font-medium text-slate-700">
                  Organized
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <Clock3 size={17} className="text-emerald-700" />
                <span className="text-sm font-medium text-slate-700">
                  Efficient
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <CheckCircle2 size={17} className="text-emerald-700" />
                <span className="text-sm font-medium text-slate-700">
                  Reliable
                </span>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#173B2F] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-all hover:bg-[#1d493a]"
            >
              Explore Dashboard
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 transition-transform group-hover:translate-x-1">
                <ArrowRight size={15} />
              </span>
            </motion.button>
          </motion.div>

          {/* RIGHT VISUAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Large Glow */}
            <div className="absolute h-[28rem] w-[28rem] rounded-full bg-emerald-100/60 blur-3xl" />

            {/* Main Image Container */}
            <div className="relative w-full max-w-xl">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-emerald-200/30 via-transparent to-emerald-100/40 blur-xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-[0_30px_80px_rgba(23,59,47,0.12)]">
                <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-100">
                  <img
                    src={classRoomImg}
                    alt="Academic classroom"
                    className="h-[380px] w-full object-cover sm:h-[440px]"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#173B2F]/30 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating Schedule Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                    <CalendarDays size={20} className="text-emerald-700" />
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Today's Schedule
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                      Everything in order
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Status */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.5 }}
                className="absolute -right-5 top-8 hidden rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl sm:block"
              >
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                  </span>

                  <span className="text-xs font-semibold text-slate-700">
                    System Ready
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Accent */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
    </div>
  );
}

export default Welcome;
