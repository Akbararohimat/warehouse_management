"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  UserRound,
  LogOut,
  ChevronLeft,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE_URL = "http://localhost:5000/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  division: string;
  isActive: boolean;
};

function getAuthToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken")
  );
}

function getDivisionLabel(division: string) {
  switch (division) {
    case "RND":
      return "RnD Division";
    case "SALES":
      return "Sales Division";
    case "ADMIN":
      return "Admin";
    default:
      return division || "-";
  }
}

function getInitials(name: string) {
  if (!name) return "U";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (
    words[0].charAt(0) + words[words.length - 1].charAt(0)
  ).toUpperCase();
}

export default function EditProfile() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          router.replace("/");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Gagal mengambil data profile"
          );
        }

        const currentUser: User = data.user;

        setUser(currentUser);
        setName(currentUser.name || "");
        setEmail(currentUser.email || "");
        setDivision(currentUser.division || "");
      } catch (err) {
        console.error("Fetch profile error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getAuthToken();

      if (!token) {
        router.replace("/");
        return;
      }

      if (!name.trim()) {
        setError("Nama lengkap wajib diisi.");
        return;
      }

      if (!email.trim()) {
        setError("Email wajib diisi.");
        return;
      }

      if (!division) {
        setError("Divisi wajib dipilih.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          division,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Gagal menyimpan profile"
        );
      }

      setUser(data.user);

      setName(data.user.name);
      setEmail(data.user.email);
      setDivision(data.user.division);

      setSuccess("Profile berhasil disimpan.");

      // Hilangkan pesan sukses setelah beberapa detik
      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Save profile error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    router.replace("/");
  };

  const initials = getInitials(user?.name || name);

  return (
    <main className="flex min-h-screen bg-gray-100 text-gray-900 transition-colors dark:bg-[#020617] dark:text-white">
      {/* SIDEBAR */}
      <aside className="flex w-68 shrink-0 flex-col bg-[#010736] px-5 py-6 text-white">
        {/* Logo / Division */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#010736]">
            {user?.division === "SALES" ? "S" : "R"}
          </div>

          <h2 className="text-xl font-bold">
            {getDivisionLabel(user?.division || "")}
          </h2>
        </div>

        <p className="mb-3 text-sm font-semibold text-gray-300">
          Menu
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/contact-list"
          className="mt-3 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <Users size={18} />
          Contact List
        </Link>

        <Link
          href="/request-sales"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <FileText size={18} />
          Request Sales
        </Link>

        {/* Profile */}
        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full rounded-xl outline-none">
              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/10">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white font-semibold text-[#010736]">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {user?.name || "Loading..."}
                  </p>

                  <p className="truncate text-xs text-gray-300">
                    {getDivisionLabel(user?.division || "")}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="top"
              className="mb-2 w-52"
            >
              <DropdownMenuItem
                onClick={() => router.push("/edit-profile")}
              >
                <UserRound className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* CONTENT */}
      <section className="flex-1">
        {/* Header */}
        <header className="flex h-20 items-center border-b border-gray-200 bg-white px-8 transition-colors dark:border-white/10 dark:bg-[#07112f]">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>

              <span className="text-xl text-gray-400">
                ›
              </span>

              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Profile
              </h2>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelola informasi profile Anda
            </p>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-7 shadow-md transition-colors dark:border-white/10 dark:bg-[#0b1738]">
            {/* Title */}
            <div className="mb-7">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Perbarui informasi profile Anda
              </p>
            </div>

            {/* Profile Preview */}
            <div className="mb-8 flex items-center gap-5 border-b border-gray-200 pb-7 dark:border-white/10">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-[#010736] text-xl font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.name || "Loading..."}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getDivisionLabel(user?.division || "")}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Profile akun yang sedang login
                </p>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex min-h-[250px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#010736] dark:border-white/10 dark:border-t-blue-500" />

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Memuat data profile...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Error */}
                {error && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Success */}
                {success && (
                  <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
                    {success}
                  </div>
                )}

                {/* Form */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nama Lengkap
                    </label>

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-800 outline-none transition focus:border-[#010736] focus:ring-2 focus:ring-[#010736]/10 dark:border-white/10 dark:bg-[#07112f] dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-800 outline-none transition focus:border-[#010736] focus:ring-2 focus:ring-[#010736]/10 dark:border-white/10 dark:bg-[#07112f] dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Division */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Divisi
                    </label>

                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-800 outline-none transition focus:border-[#010736] focus:ring-2 focus:ring-[#010736]/10 dark:border-white/10 dark:bg-[#07112f] dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
                    >
                      <option value="RND">RnD Division</option>
                      <option value="SALES">Sales Division</option>
                    </select>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>

                    <input
                      value={user?.role || ""}
                      disabled
                      className="h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-200 px-4 text-sm text-gray-500 outline-none dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    disabled={saving}
                    className="flex h-11 items-center gap-2 rounded-xl border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    <ChevronLeft size={17} />
                    Kembali
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="h-11 rounded-xl bg-[#010736] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#07112f] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}