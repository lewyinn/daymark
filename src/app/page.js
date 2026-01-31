"use client";

import React, { useState, useEffect } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Image from "next/image";
import NextLink from "next/link";
import { Link as ScrollLink } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";
import Daymark from "../../public/Logo.png";
import Link from "next/link";
import { BiLogoInstagramAlt, BiLogoGithub, BiLogoLinkedinSquare } from "react-icons/bi";


const menuItems = [
  { label: "Beranda", to: "home" },
];

const menuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.07,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <ScrollLink to="home" smooth spy offset={-80} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12">
              <Image src={Daymark} alt="Brandly Logo" priority />
            </div>
            <span className="text-xl md:text-2xl font-bold text-[#28C3B0]">
              Daymark
            </span>
          </ScrollLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <ScrollLink
                key={item.to}
                to={item.to}
                smooth
                spy
                offset={-80}
                duration={600}
                activeClass="active"
                className="nav-link cursor-pointer text-gray-800 hover:text-[#28C3B0] text-sm lg:text-base font-medium transition-colors"
              >
                {item.label}
              </ScrollLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="flex gap-2">
            {/* <div className="hidden md:block">
              <NextLink
                href="/sign-up"
                className="cursor-pointer bg-transparent border-2 border-[#28C3B0] hover:bg-[#28C3B0] text-[#28C3B0] hover:text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
                Sign up
              </NextLink>
            </div> */}
            <div className="hidden md:block">
              <NextLink
                href="/sign-in"
                className="cursor-pointer bg-[#28C3B0] hover:bg-[#22a899] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors">
                Sign In
              </NextLink>
            </div>

          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenuAlt3 className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4 pb-6 pt-4">
                {menuItems.map((item) => (
                  <motion.div key={item.to} variants={itemVariants}>
                    <ScrollLink
                      to={item.to}
                      smooth
                      spy
                      offset={-80}
                      duration={600}
                      activeClass="active"
                      className="nav-link cursor-pointer text-gray-700 text-base font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </ScrollLink>
                  </motion.div>
                ))}

                <div className="flex justify-between items-center">
                  {/* <motion.div variants={itemVariants}>
                    <NextLink
                      href="/sign-up"
                      className="mt-3 inline-flex justify-center bg-transparent border-2 border-[#28C3B0] hover:bg-[#28C3B0] text-[#28C3B0] hover:text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors">
                      Sign up
                    </NextLink>
                  </motion.div> */}
                  <motion.div variants={itemVariants}>
                    <NextLink
                      href="/sign-in"
                      className="mt-3 inline-flex justify-center bg-[#28C3B0] hover:bg-[#22a899] text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors">
                      Sign in
                    </NextLink>
                  </motion.div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

// ─── Floating Widget Cards ────────────────────────────────────────────────────
function FloatingWidget({ children, style, animDelay }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  return (
    <div
      className="absolute"
      style={style}
    >
      <div
        className={`bg-white border border-gray-100 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
      >
        {children}
      </div>
    </div>
  );
}

// Individual widget contents
function CalendarWidget() {
  return (
    <div className="w-[94px] h-[94px] p-3 flex flex-col items-center justify-center">
      <div className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Jan</div>
      <div className="text-[36px] font-bold text-gray-900 leading-none" style={{ fontFamily: "'Georgia', serif" }}>28</div>
    </div>
  );
}

function NoteWidget() {
  return (
    <div className="w-[84px] h-[92px] p-3 flex flex-col gap-1.5 justify-center">
      <div className="w-full h-1.5 bg-gray-200 rounded-full" />
      <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
      <div className="w-full h-1.5 bg-gray-200 rounded-full" />
      <div className="w-3/5 h-1.5 bg-gray-200 rounded-full" />
    </div>
  );
}

function ClockWidget() {
  return (
    <div className="w-[88px] h-[82px] flex items-center justify-center">
      <div className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center relative">
        {/* clock hands */}
        <div className="absolute w-px h-4 bg-gray-900 rounded-full" style={{ transformOrigin: "bottom center", top: "6px", transform: "rotate(0deg)" }} />
        <div className="absolute h-px w-3.5 bg-gray-900 rounded-full" style={{ transformOrigin: "left center", left: "12px", top: "20px", transform: "rotate(30deg)" }} />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-900 absolute" style={{ top: "18px", left: "11px" }} />
      </div>
    </div>
  );
}

function ReminderWidget() {
  return (
    <div className="w-[84px] h-[72px] p-3 flex flex-col gap-2 justify-center">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
        <div className="w-full h-1.5 bg-gray-200 rounded-full" />
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-emerald-400 flex-shrink-0" />
        <div className="w-4/5 h-1.5 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

function GridDotWidget() {
  return (
    <div className="w-[84px] h-[84px] flex items-center justify-center">
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i === 5 || i === 6 || i === 9 || i === 10 ? "bg-gray-300" : "bg-gray-150"
              }`}
            style={{ backgroundColor: [5, 6, 9, 10].includes(i) ? "#d1d5db" : "#eee" }}
          />
        ))}
      </div>
    </div>
  );
}

function MovieWidget() {
  return (
    <div className="w-[84px] h-[80px] p-2.5 flex flex-col gap-1.5 justify-center">
      <div className="w-full h-8 bg-gray-100 rounded-md flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="#9ca3af" strokeWidth="1.2" />
          <path d="M5 4.5l3 1.5-3 1.5V4.5z" fill="#9ca3af" />
        </svg>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full" />
      <div className="w-2/3 h-1.5 bg-gray-200 rounded-full" />
    </div>
  );
}

// ─── Dashboard Mockup Preview ─────────────────────────────────────────────────
function DashboardPreview() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const dates = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

  return (
    <div
      className={`w-full max-w-5xl mx-auto transition-all duration-1000 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_16px_48px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 flex justify-center">
            <div className="w-32 h-4 bg-gray-200 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-44 border-r border-gray-100 p-3 flex flex-col gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50">
              <div className="w-3 h-3 rounded bg-gray-300" />
              <span className="text-[11px] font-semibold text-gray-700">Campaign</span>
            </div>
            {/* Rows */}
            {["Design", "Concepting", "Development"].map((label, i) => (
              <div key={i} className="px-2 py-2">
                <div className="text-[11px] font-semibold text-gray-800">{label}</div>
                <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                  {i === 0 ? "14 Files" : i === 1 ? "3 Files" : "8 Files"}
                </div>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex-1 overflow-hidden">
            {/* Date header */}
            <div className="flex border-b border-gray-100">
              {dates.map((d, i) => {
                const isToday = d === 21;
                return (
                  <div
                    key={i}
                    className={`flex-1 text-center py-1.5 border-r border-gray-50 last:border-r-0 ${isToday ? "bg-gray-900" : ""
                      }`}
                  >
                    <div className={`text-[8px] ${isToday ? "text-white font-semibold" : "text-gray-400"}`}>
                      {weekDays[i % 7]}
                    </div>
                    <div className={`text-[9px] font-semibold ${isToday ? "text-white" : "text-gray-600"}`}>
                      {d}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Task rows */}
            <div className="relative" style={{ minHeight: "120px" }}>
              {/* Row 1 — Design */}
              <div className="absolute" style={{ top: "12px", left: "0%" }}>
                <div className="flex items-center gap-1.5 bg-gray-100 rounded-md px-2 py-1 mx-1" style={{ width: "140px" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#6b7280" strokeWidth="1.2" />
                    <path d="M5 5l0-2.5" stroke="#6b7280" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <span className="text-[9px] font-medium text-gray-700">Brainstorming</span>
                </div>
              </div>

              {/* V1 Due badge */}
              <div className="absolute" style={{ top: "8px", left: "52%" }}>
                <span className="bg-gray-900 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded">V1 Due</span>
              </div>

              {/* Row 2 — Design Sprint (longer bar) */}
              <div className="absolute" style={{ top: "42px", left: "28%" }}>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-md px-2 py-1" style={{ width: "220px" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#d97706" strokeWidth="1.2" />
                    <path d="M5 5l2.5 0" stroke="#d97706" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <span className="text-[9px] font-medium text-amber-700">Design Sprint</span>
                </div>
              </div>

              {/* Row 3 — Boards */}
              <div className="absolute" style={{ top: "72px", left: "8%" }}>
                <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 rounded-md px-2 py-1" style={{ width: "100px" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#0ea5e9" strokeWidth="1.2" />
                  </svg>
                  <span className="text-[9px] font-medium text-sky-700">Boards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTitleVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="min-h-screen bg-white overflow-hidden">
      <Navbar />

      {/* Hero content */}
      <div id="home" className="relative max-w-6xl mx-auto px-6 pt-28 md:pt-48 pb-32">
        {/* Floating widgets */}
        <FloatingWidget style={{ top: "160px", left: "5%" }} animDelay={300}>
          <ClockWidget />
        </FloatingWidget>

        <FloatingWidget style={{ top: "140px", right: "8%" }} animDelay={500}>
          <GridDotWidget />
        </FloatingWidget>

        <FloatingWidget style={{ top: "380px", left: "30%" }} animDelay={800}>
          <ReminderWidget />
        </FloatingWidget>

        <FloatingWidget style={{ top: "420px", left: "2%" }} animDelay={450}>
          <NoteWidget />
        </FloatingWidget>

        <FloatingWidget style={{ top: "320px", right: "3%" }} animDelay={650}>
          <MovieWidget />
        </FloatingWidget>

        <FloatingWidget style={{ top: "280px", left: "14%" }} animDelay={350}>
          <CalendarWidget />
        </FloatingWidget>

        <FloatingWidget style={{ top: "240px", right: "24%" }} animDelay={700}>
          <NoteWidget />
        </FloatingWidget>

        {/* Center text */}
        <div
          className={`text-center relative z-10 transition-all duration-700 ease-out ${titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <h1
            className="text-[62px] font-bold text-gray-900 leading-[1.1] tracking-[-2.5px] mx-auto"
            style={{ maxWidth: "640px", fontFamily: "'Georgia', serif" }}
          >
            Organize your
            <br />
            <span className="relative inline-block">
              <span
                className="absolute inset-x-0 bottom-1 h-[72%] rounded-lg"
                style={{ backgroundColor: "#eef9c3", zIndex: 0 }}
              />
              <span className="relative" style={{ zIndex: 1 }}>
                life in <em>one place.</em>
              </span>
            </span>
          </h1>

          <p className="text-[17px] text-gray-500 mt-5 leading-relaxed mx-auto" style={{ maxWidth: "440px" }}>
            Notes, tasks, reminders, and watchlist.
            <br />
            All synced, all yours.
          </p>

          {/* CTA Button */}
          <a
            href="#"
            className="inline-flex items-center gap-2 mt-7 bg-gray-900 text-white text-[15px] font-medium rounded-full px-6 py-3 hover:bg-gray-800 transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#eef9c3" }}
            />
            Get Started Free
          </a>
        </div>

        {/* Dashboard mockup */}
        <div className="mt-14">
          <DashboardPreview />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#092522] mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">

            {/* Brand */}
            <div className="flex items-center gap-2">
              <Image
                src={Daymark}
                width={24}
                height={24}
                alt="Daymark Logo"
                priority
              />
              <span className="text-xl font-semibold text-[#28C3B0]">
                Daymark
              </span>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-6 text-sm text-gray-300">
              <Link href="https://instagram.com/lewyinn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#28C3B0] transition flex flex-col justify-center items-center">
                <BiLogoInstagramAlt className="text-2xl" />
                Instagram
              </Link>
              <Link href="https://github.com/lewyinn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#28C3B0] transition flex flex-col justify-center items-center">
                <BiLogoGithub className="text-2xl" />
                GitHub
              </Link>
              <Link href="https://linkedin.com/in/lewyinn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#28C3B0] transition flex flex-col justify-center items-center">
                <BiLogoLinkedinSquare className="text-2xl" />
                LinkedIn
              </Link>
            </div>

            {/* Credit */}
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Dibuat oleh{" "}
              <span className="text-[#28C3B0] font-medium">
                Moch. Ridho Kurniawan (lewyinn)
              </span>
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}