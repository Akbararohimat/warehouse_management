"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Lock,
  User,
  Palette,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

type UserData = {
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

export default function Settings() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAuthToken();

        if (!token) {
          window.location.href = "/";
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
            data.message || "Gagal mengambil data pengguna"
          );
        }

        setUser(data.user);
      } catch (err) {
        console.error("Fetch user error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal mengambil data pengguna"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 transition-colors dark:bg-[#020617] dark:text-white">
      <header className="flex h-20 items-center border-b border-gray-200 bg-white px-8 shadow-sm transition-colors dark:border-white/10 dark:bg-[#07112f]">
        <Link
          href="/dashboard"
          className="mr-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Kelola pengaturan akun dan sistem
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-8">
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-colors dark:border-white/10 dark:bg-[#0b1738]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#010736] text-white">
              <User size={19} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                Account
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pengaturan akun pengguna
              </p>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 py-4 dark:border-white/10">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Nama pengguna
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {loading ? "Memuat..." : user?.name || "-"}
                  </p>
                </div>

                <Link
                  href="/edit-profile"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[#010736] transition hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-white/10"
                >
                  Edit
                </Link>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 py-4 dark:border-white/10">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Email
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {loading ? "Memuat..." : user?.email || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Divisi
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {loading
                      ? "Memuat..."
                      : getDivisionLabel(user?.division || "")}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-colors dark:border-white/10 dark:bg-[#0b1738]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#010736] text-white">
              <Bell size={19} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                Notifications
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Atur notifikasi sistem
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Notifikasi Request Sales
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Terima pemberitahuan ketika ada request baru
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-[#010736]"
            />
          </div>
        </div>

        <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-colors dark:border-white/10 dark:bg-[#0b1738]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#010736] text-white">
              <Lock size={19} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                Security
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pengaturan keamanan akun
              </p>
            </div>
          </div>

          <button className="rounded-xl bg-[#010736] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#07112f] dark:bg-blue-600 dark:hover:bg-blue-500">
            Ubah Password
          </button>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-colors dark:border-white/10 dark:bg-[#0b1738]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#010736] text-white">
              <Palette size={19} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900 dark:text-white">
                Appearance
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Pengaturan tampilan aplikasi
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}