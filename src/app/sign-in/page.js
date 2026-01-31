"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Daymark from '../../../public/Logo.png'
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";

// ─── Decorative Illustrations ─────────────────────────────────────────────────

function Planet() {
    return (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
            <ellipse cx="60" cy="52" rx="56" ry="14" stroke="#c8d8e8" strokeWidth="2.5" fill="none" transform="rotate(-12 60 52)" />
            <circle cx="60" cy="48" r="28" fill="#dce8f0" />
            <circle cx="60" cy="48" r="28" fill="url(#planetGrad)" />
            <clipPath id="planetClip">
                <circle cx="60" cy="48" r="28" />
            </clipPath>
            <ellipse cx="60" cy="52" rx="56" ry="14" stroke="#a8c4d8" strokeWidth="2.5" fill="none" transform="rotate(-12 60 52)" clipPath="url(#planetClip)" />
            <defs>
                <radialGradient id="planetGrad" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="#eef4f8" />
                    <stop offset="100%" stopColor="#c5d8e8" />
                </radialGradient>
            </defs>
        </svg>
    );
}

function Pencil() {
    return (
        <svg width="130" height="70" viewBox="0 0 130 70" fill="none" style={{ transform: "rotate(-30deg)" }}>
            <rect x="20" y="22" width="90" height="22" rx="3" fill="#eedcb8" />
            <rect x="20" y="22" width="90" height="22" rx="3" fill="url(#pencilGrad)" />
            <rect x="100" y="22" width="6" height="22" fill="#e8d4a8" />
            <rect x="106" y="24" width="14" height="18" rx="2" fill="#f4a0a0" />
            <polygon points="20,33 8,33 14,27" fill="#c9a86c" />
            <polygon points="14,27 8,33 14,33" fill="#3a2a1a" />
            <defs>
                <linearGradient id="pencilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fff8ec" />
                    <stop offset="100%" stopColor="#eedcb8" />
                </linearGradient>
            </defs>
        </svg>
    );
}

function Sparkle({ size = 40, color = "#28C3B0" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
            <path
                d="M20 0 C20 12, 28 18, 40 20 C28 22, 22 28, 20 40 C18 28, 12 22, 0 20 C12 18, 20 12, 20 0Z"
                fill={color}
            />
        </svg>
    );
}

function RadialBurst() {
    return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                <line
                    key={i}
                    x1="40" y1="40" x2="40" y2="8"
                    stroke="#d4dfe8" strokeWidth="1.8" strokeLinecap="round"
                    transform={`rotate(${angle} 40 40)`}
                />
            ))}
        </svg>
    );
}

function SmallDots() {
    return (
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
            {[[10, 10], [25, 10], [40, 10], [10, 25], [25, 25], [40, 25], [10, 40], [25, 40], [40, 40]].map(([cx, cy], i) => (
                <circle key={i} cx={cx} cy={cy} r="3" fill="#d0dce6" opacity={0.5 + (i % 3) * 0.2} />
            ))}
        </svg>
    );
}

function LeafShape() {
    return (
        <svg width="50" height="70" viewBox="0 0 60 80" fill="none">
            <path d="M30 0 C55 20, 58 55, 30 80 C2 55, -1 20, 30 0Z" fill="#c8e6df" opacity="0.65" />
            <path d="M30 10 C30 10, 30 65, 30 70" stroke="#a8d4c8" strokeWidth="1.5" fill="none" />
        </svg>
    );
}

// ─── Eye Icons ────────────────────────────────────────────────────────────────
function EyeIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
function EyeOffIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}

// ─── Floating Deco Wrapper ────────────────────────────────────────────────────
function Deco({ children, style, delay, type = "fade" }) {
    const [on, setOn] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setOn(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    const anim =
        type === "scale"
            ? on ? "opacity-100 scale-100" : "opacity-0 scale-75"
            : on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";

    return (
        <div className={`absolute transition-all duration-1000 ease-out ${anim}`} style={style}>
            {children}
        </div>
    );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [alert, setAlert] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        if (type === 'error') {
            setTimeout(() => setAlert(null), 3000);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res.error) {
                showAlert("error", "Invalid email or password.");
                setLoading(false);
                return;
            }

            // Jika sukses
            showAlert("success", "Welcome back! Redirecting...");
            
            setTimeout(() => {
                router.replace("/dashboard");
            }, 1500);

        } catch (error) {
            console.log(error);
            showAlert("error", "Something went wrong");
            setLoading(false);
        }
    };

    const focusStyle = (e) => {
        e.target.style.borderColor = "#28C3B0";
        e.target.style.boxShadow = "0 0 0 3px rgba(40,195,176,0.18)";
    };
    const blurStyle = (e) => {
        e.target.style.borderColor = "#e5e7eb";
        e.target.style.boxShadow = "none";
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 md:px-2" style={{ backgroundColor: "#eef1f4" }}>
            <Deco delay={200} style={{ top: "18%", left: "4%" }}>
                <Planet />
            </Deco>
            <Deco delay={350} style={{ top: "42%", right: "3%" }}>
                <Pencil />
            </Deco>
            <Deco delay={280} type="scale" style={{ top: "22%", right: "18%" }}>
                <Sparkle size={44} color="#4ade80" />
            </Deco>
            <Deco delay={420} type="scale" style={{ bottom: "28%", left: "12%" }}>
                <Sparkle size={28} color="#28C3B0" />
            </Deco>
            <Deco delay={500} type="scale" style={{ top: "12%", right: "32%" }}>
                <Sparkle size={18} color="#a8d5ba" />
            </Deco>
            <Deco delay={180} style={{ top: "8%", left: "22%" }}>
                <RadialBurst />
            </Deco>
            <Deco delay={380} style={{ bottom: "10%", right: "15%" }}>
                <RadialBurst />
            </Deco>
            <Deco delay={450} style={{ bottom: "18%", left: "6%" }}>
                <SmallDots />
            </Deco>
            <Deco delay={520} style={{ bottom: "6%", left: "18%" }}>
                <LeafShape />
            </Deco>
            <Deco delay={550} type="scale" style={{ bottom: "32%", right: "28%" }}>
                <Sparkle size={22} color="#f0c060" />
            </Deco>
            {/* extra tiny accents */}
            <Deco delay={600} type="scale" style={{ top: "38%", left: "14%" }}>
                <Sparkle size={14} color="#28C3B0" />
            </Deco>
            <Deco delay={320} style={{ top: "70%", right: "22%" }}>
                <SmallDots />
            </Deco>


            {alert && <Alert type={alert.type} message={alert.message} />}
            
            {/* Logo */}
            <Link href='/' className={`relative z-10 flex items-center gap-2 mb-8 transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <Image src={Daymark} width={42} height={42} alt="Daymark" />
                </div>
                <span className="text-xl md:text-2xl font-semibold text-gray-800 tracking-[-0.3px]">Daymark</span>
            </Link>

            {/* Card */}
            <div className={`relative z-10 max-w-xl bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.07)] w-full px-8 py-9 transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: "100ms" }}>
                
                <div className="text-center mb-6">
                    <h1 className="text-gray-900 text-3xl font-bold tracking-[-0.5px]" style={{ fontFamily: "'Georgia', serif" }}>
                        Sign In
                    </h1>
                    <p className="text-gray-400 text-sm mt-1.5">
                        Enter details to sign in to your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-500 tracking-[0.2px]">Email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-800 placeholder-gray-300 outline-none transition-all duration-200" onFocus={focusStyle} onBlur={blurStyle} placeholder="leila@example.com" />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-500 tracking-[0.2px]">Password</label>
                        <div className="relative">
                            <input type={showPass ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} className="w-full px-3.5 pr-10 py-2.5 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-800 placeholder-gray-300 outline-none transition-all duration-200" onFocus={focusStyle} onBlur={blurStyle} placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                {showPass ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-xs text-center bg-red-50 py-2 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    {/* Sign In Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-2.5 rounded-lg text-white text-base font-semibold mt-1 transition-all duration-200 active:scale-[0.96] disabled:opacity-70"
                        style={{ backgroundColor: "#28C3B0" }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#1fa899")}
                        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#28C3B0")}
                    >
                        {loading ? "Signing In..." : "Sign in"}
                    </button>

                    <div className="text-center mt-0.5">
                        <Link href="/sign-up" className="text-[13px] font-medium transition-colors hover:underline" style={{ color: "#28C3B0" }}>
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className={`relative z-10 mt-8 flex items-center gap-3 transition-all duration-700 ease-out ${mounted ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "400ms" }}>
                <span className="text-[11px] text-gray-400">©Daymark 2026</span>
                <span className="text-gray-300">·</span>
                <a href="#" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</a>
                <span className="text-gray-300">·</span>
                <a href="#" className="text-[11px] font-medium transition-colors" style={{ color: "#28C3B0" }}>Terms of Service</a>
            </div>
        </div>
    );
}