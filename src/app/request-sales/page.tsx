"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Search,
  SquarePen,
  Settings,
  UserRound,
  LogOut,
  X,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type RequestData = {
  id: number
  nama: string
  produk: string
  tanggal: string
  status: string
}

export default function RequestSales() {
  const router = useRouter()

  const [search, setSearch] = useState("")

  const [showForm, setShowForm] = useState(false)

  const [nama, setNama] = useState("")
  const [produk, setProduk] = useState("")
  const [tanggal, setTanggal] = useState("")
  const [status, setStatus] = useState("Pending")

  const [requests, setRequests] = useState<RequestData[]>([
    {
      id: 1,
      nama: "Akbar arohimat",
      produk: "Router",
      tanggal: "19/02/2027",
      status: "Selesai",
    },
  ])

  const filteredRequests = requests.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddRequest = () => {
    if (!nama || !produk || !tanggal) {
      return
    }

    const newRequest: RequestData = {
      id: Date.now(),
      nama,
      produk,
      tanggal,
      status,
    }

    setRequests((prev) => [...prev, newRequest])

    setNama("")
    setProduk("")
    setTanggal("")
    setStatus("Pending")
    setShowForm(false)
  }

  return (
    <main className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="flex w-68 shrink-0 flex-col bg-[#10052D] px-5 py-6 text-white">

        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-bold text-[#10052D]">
            RnD
          </div>

          <h2 className="text-xl font-bold">
            Divisi RnD
          </h2>
        </div>

        <p className="mb-3 px-4 text-sm font-semibold text-gray-200">
          Menu
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:bg-[#211344]"
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/contact-list"
          className="mt-2 flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:bg-[#211344]"
        >
          <Users size={19} />
          <span>Contact List</span>
        </Link>

        <Link
          href="/request-sales"
          className="mt-2 flex items-center gap-3 rounded-full bg-[#33245A] px-4 py-3 text-sm"
        >
          <FileText size={19} />
          <span>Request Sales</span>
        </Link>

        {/* PROFILE */}
        <div className="mt-auto pt-5">

          <DropdownMenu>

            <DropdownMenuTrigger className="w-full rounded-xl outline-none">

              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#211344]">

                <Avatar className="h-10 w-10 shrink-0">

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
                 onClick={()=> router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </aside>

      {/* CONTENT */}
      <section className="flex-1">

        {/* HEADER */}
        <header className="flex h-20 items-center justify-between bg-white px-8">

          <div>

            <div className="flex items-center gap-2">

              <h1 className="text-3xl font-bold text-black">
                Dashboard
              </h1>

              <span className="text-xl text-gray-400">
                ›
              </span>

              <h2 className="text-lg font-semibold text-black">
                Request Sales
              </h2>

            </div>

            <p className="text-sm text-gray-500">
              Pantau dan Follow up Request Sales
            </p>

          </div>

          <div className="flex h-10 w-60 items-center gap-2 rounded-full bg-gray-100 px-4 shadow-inner">

            <Search
              size={17}
              className="text-gray-700"
            />

            <span className="text-sm text-gray-600">
              Find Something...
            </span>

          </div>

        </header>

        {/* MAIN */}
        <div className="px-8 pt-16">

          {/* SEARCH + FOLLOW UP */}
          <div className="mb-4 flex items-center justify-between">

            <div className="flex h-11 w-60 items-center gap-2 rounded-full bg-white px-4 shadow-md">

              <Search
                size={17}
                className="text-gray-700"
              />

              <input
                type="text"
                placeholder="Find Contact Or Name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-500"
              />

            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex h-12 items-center gap-2 rounded-2xl bg-[#33245A] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46]"
            >

              <SquarePen size={20} />

              <span>
                Follow Up
              </span>

            </button>

          </div>

          {/* TABLE */}
          <div className="min-h-[330px] w-full max-w-[700px] rounded-2xl bg-white p-4 shadow-md">

            <div className="grid grid-cols-[1.1fr_1fr_1.2fr_0.8fr] items-center border-b border-gray-400 px-2 pb-3">

              <p className="text-sm font-bold text-black">
                Nama
              </p>

              <p className="text-sm font-bold text-black">
                Produk
              </p>

              <p className="text-sm font-bold text-black">
                Tanggal Request
              </p>

              <p className="text-sm font-bold text-black">
                Status
              </p>

            </div>

            {filteredRequests.map((item) => (

              <div
                key={item.id}
                className="grid grid-cols-[1.1fr_1fr_1.2fr_0.8fr] items-center border-b border-gray-400 px-2 py-4"
              >

                <p className="text-xs font-medium text-gray-800">
                  {item.nama}
                </p>

                <p className="text-xs text-gray-700">
                  {item.produk}
                </p>

                <p className="text-xs text-gray-700">
                  {item.tanggal}
                </p>

                <div>

                  <span
                    className={`inline-flex rounded-full px-5 py-1 text-xs font-medium ${
                      item.status === "Selesai"
                        ? "bg-green-100 text-green-500"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-500"
                    }`}
                  >
                    {item.status}
                  </span>

                </div>

              </div>

            ))}

            {filteredRequests.length === 0 && (

              <div className="flex h-40 items-center justify-center">

                <p className="text-sm text-gray-400">
                  Data request tidak ditemukan.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

      {/* FORM FOLLOW UP */}
      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-[420px] rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-black">
                  Follow Up Request
                </h2>

                <p className="text-sm text-gray-500">
                  Tambahkan request sales baru
                </p>

              </div>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-4">

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nama
                </label>

                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama contact"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#33245A]"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Produk
                </label>

                <input
                  value={produk}
                  onChange={(e) => setProduk(e.target.value)}
                  placeholder="Contoh: Router"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#33245A]"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tanggal Request
                </label>

                <input
                  type="text"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#33245A]"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#33245A]"
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Follow Up">
                    Follow Up
                  </option>

                  <option value="Selesai">
                    Selesai
                  </option>

                </select>

              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                onClick={handleAddRequest}
                className="rounded-xl bg-[#33245A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#271b46]"
              >
                Tambah Request
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}   