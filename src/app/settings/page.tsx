"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Bell,
  Lock,
  User,
  Palette,
} from "lucide-react"

export default function Settings() {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="flex h-20 items-center bg-white px-8 shadow-sm">
        <Link
          href="/dashboard"
          className="mr-4 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-black">
            Settings
          </h1>

          <p className="text-sm text-gray-500">
            Kelola pengaturan akun dan sistem
          </p>
        </div>
      </header>

    
      <div className="mx-auto max-w-3xl p-8">


        <div className="mb-5 rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#33245A] text-white">
              <User size={19} />
            </div>

            <div>
              <h2 className="font-bold text-black">
                Account
              </h2>

              <p className="text-sm text-gray-500">
                Pengaturan akun pengguna
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-4">
            <div>
              <p className="font-medium text-black">
                Nama pengguna
              </p>

              <p className="text-sm text-gray-500">
                Akbar arohimat
              </p>
            </div>

            <button className="rounded-lg px-4 py-2 text-sm font-medium text-[#33245A] hover:bg-gray-100">
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between py-4">
            <div>
              <p className="font-medium text-black">
                Divisi
              </p>

              <p className="text-sm text-gray-500">
                RnD Division
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#33245A] text-white">
              <Bell size={19} />
            </div>

            <div>
              <h2 className="font-bold text-black">
                Notifications
              </h2>

              <p className="text-sm text-gray-500">
                Atur notifikasi sistem
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">
                Notifikasi Request Sales
              </p>

              <p className="text-sm text-gray-500">
                Terima pemberitahuan ketika ada request baru
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 accent-[#33245A]"
            />
          </div>
        </div>

        {/* SECURITY */}
        <div className="mb-5 rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#33245A] text-white">
              <Lock size={19} />
            </div>

            <div>
              <h2 className="font-bold text-black">
                Security
              </h2>

              <p className="text-sm text-gray-500">
                Pengaturan keamanan akun
              </p>
            </div>
          </div>

          <button className="rounded-xl bg-[#33245A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#271b46]">
            Ubah Password
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#33245A] text-white">
              <Palette size={19} />
            </div>

            <div>
              <h2 className="font-bold text-black">
                Appearance
              </h2>

              <p className="text-sm text-gray-500">
                Pengaturan tampilan aplikasi
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium text-black">
              Theme
            </p>

            <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
        </div>

      </div>
    </main>
  )
}