"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  UserRound,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react"

export default function SalesEditProfile() {
  const router = useRouter()

  const [name, setName] = useState("Akbar arohimat")
  const [email, setEmail] = useState("akbar@gmail.com")
  const [phone, setPhone] = useState("08888888")
  const [position, setPosition] = useState("Sales")

  const handleSave = () => {
    alert("Profile berhasil disimpan!")
  }

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="flex h-20 items-center bg-white px-8 shadow-sm">

        <button
          onClick={() => router.back()}
          className="mr-4 flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-black" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-black">
            Edit Profile
          </h1>

          <p className="text-sm text-gray-500">
            Kelola informasi profile Sales
          </p>
        </div>

      </header>

      <div className="mx-auto max-w-4xl p-8">

        <div className="rounded-3xl bg-white p-8 shadow-md">

          <div className="mb-8 flex items-center gap-5 border-b border-gray-200 pb-7">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5C400] text-2xl font-bold text-black">
              AR
            </div>

            <div>
              <h2 className="text-xl font-bold text-black">
                Akbar arohimat
              </h2>

              <p className="text-sm text-gray-500">
                Sales Division
              </p>
            </div>

          </div>

          <form
            onSubmit={handleSave}
            className="space-y-6"
          >

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Nama Lengkap
              </label>

              <div className="relative">

                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-sm text-black outline-none transition focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-sm text-black outline-none transition focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                No. Telepon
              </label>

              <div className="relative">

                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-sm text-black outline-none transition focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Divisi
              </label>

              <div className="relative">

                <Briefcase
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value="Sales Division"
                  disabled
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 pl-11 pr-4 text-sm text-gray-500 outline-none"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Jabatan
              </label>

              <div className="relative">

                <Briefcase
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 text-sm text-black outline-none transition focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

              </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">

              <button
                type="button"
                onClick={() => router.back()}
                className="h-11 rounded-xl border border-gray-300 px-6 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                type="submit"
                className="flex h-11 items-center gap-2 rounded-xl bg-[#F5C400] px-6 text-sm font-semibold text-black transition hover:bg-[#E5B800]"
              >
                <Save size={17} />
                Simpan Perubahan
              </button>

            </div>

          </form>

        </div>

      </div>

    </main>
  )
}