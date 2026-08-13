"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  UserRound,
  LogOut,
  ChevronLeft,
  Camera,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function EditProfile() {
  const router = useRouter()

  const [name, setName] = useState("Akbar arohimat")
  const [email, setEmail] = useState("akbar@gmail.com")
  const [phone, setPhone] = useState("08888888")
  const [division, setDivision] = useState("RnD Division")

  const handleSave = () => {
    alert("Profile berhasil disimpan!")
  }

  return (
    <main className="flex min-h-screen bg-gray-100">

      <aside className="flex w-68 shrink-0 flex-col bg-[#10052D] px-5 py-6 text-white">

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#10052D]">
            RnD
          </div>

          <h2 className="text-xl font-bold">
            Divisi RnD
          </h2>
        </div>

        <p className="mb-3 text-sm font-semibold text-gray-300">
          Menu
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-[#211344]"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/contact-list"
          className="mt-3 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-[#211344]"
        >
          <Users size={18} />
          Contact List
        </Link>

        <Link
          href="/request-sales"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-[#211344]"
        >
          <FileText size={18} />
          Request Sales
        </Link>

        <div className="mt-auto">

          <DropdownMenu>

            <DropdownMenuTrigger className="w-full rounded-xl outline-none">

              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#211344]">

                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white text-[#10052D]">
                    AR
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    Akbar arohimat
                  </p>

                  <p className="text-xs text-gray-300">
                    RnD Division
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
                onClick={() => {
                  localStorage.removeItem("isLoggedIn")
                  router.replace("/")
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </aside>

      <section className="flex-1">

        <header className="flex h-20 items-center bg-white px-8">

          <div>
            <div className="flex items-center gap-2">

              <h1 className="text-3xl font-bold text-black">
                Dashboard
              </h1>

              <span className="text-xl text-gray-400">
                ›
              </span>

              <h2 className="text-xl font-semibold text-black">
                Edit Profile
              </h2>

            </div>

            <p className="text-sm text-gray-500">
              Kelola informasi profile Anda
            </p>

          </div>

        </header>

        <div className="p-8">

          <div className="max-w-4xl rounded-2xl bg-white p-7 shadow-md">

            <div className="mb-7">
              <h2 className="text-xl font-bold text-black">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Perbarui informasi profile Anda
              </p>
            </div>

            <div className="mb-8 flex items-center gap-5 border-b border-gray-200 pb-7">

              <div className="relative">

                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-[#33245A] text-xl font-bold text-white">
                    AR
                  </AvatarFallback>
                </Avatar>

                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#536DFE] text-white shadow-md hover:opacity-90"
                >
                  <Camera size={14} />
                </button>

              </div>

              <div>
                <h3 className="text-lg font-semibold text-black">
                  Akbar arohimat
                </h3>

                <p className="text-sm text-gray-500">
                  RnD Division
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  JPG, PNG maksimal 2MB
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nama Lengkap
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm text-gray-800 outline-none transition focus:ring-2 focus:ring-[#536DFE]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm text-gray-800 outline-none transition focus:ring-2 focus:ring-[#536DFE]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm text-gray-800 outline-none transition focus:ring-2 focus:ring-[#536DFE]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Divisi
                </label>

                <input
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="h-12 w-full rounded-xl bg-gray-100 px-4 text-sm text-gray-800 outline-none transition focus:ring-2 focus:ring-[#536DFE]"
                />
              </div>

            </div>

            <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex h-11 items-center gap-2 rounded-xl border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <ChevronLeft size={17} />
                Kembali
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="h-11 rounded-xl bg-[#33245A] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46]"
              >
                Simpan Perubahan
              </button>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}