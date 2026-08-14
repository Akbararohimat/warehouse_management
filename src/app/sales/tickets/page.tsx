"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  Ticket,
  ChartNoAxesCombined,
  Settings,
  UserRound,
  LogOut,
  Search,
  Plus,
  ChevronDown,
  X,
  Send,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SalesTickets() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)

  const [subject, setSubject] = useState("")
  const [customer, setCustomer] = useState("")
  const [product, setProduct] = useState("")
  const [description, setDescription] = useState("")

  const tickets = [
    {
      id: "#001",
      customer: "PT.PTan",
      request: "Request Router",
      date: "19/02/2027",
      status: "Pending",
    },
    {
      id: "#002",
      customer: "PT.ABC",
      request: "Request Switch",
      date: "18/02/2027",
      status: "Diproses",
    },
    {
      id: "#003",
      customer: "PT.Network",
      request: "Upgrade Router",
      date: "17/02/2027",
      status: "Selesai",
    },
  ]

  const filteredTickets = tickets.filter((ticket) =>
    `${ticket.id} ${ticket.customer} ${ticket.request} ${ticket.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log({
      subject,
      customer,
      product,
      description,
    })

    setShowModal(false)

    setSubject("")
    setCustomer("")
    setProduct("")
    setDescription("")
  }

  return (
    <main className="flex min-h-screen bg-gray-100">

      <aside className="flex w-68 shrink-0 flex-col bg-[#111111] px-5 py-6 text-white">

        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5C400] text-sm font-bold text-black">
            S
          </div>

          <h2 className="text-xl font-bold">
            Divisi Sales
          </h2>

        </div>
        <p className="mb-3 px-4 text-sm font-semibold uppercase text-gray-400">
          Menu
        </p>

        <Link
          href="/sales"
          className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/sales/contact-list"
          className="mt-3 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <Users size={18} />
          Contact List
        </Link>

        <Link
          href="/sales/tickets"
          className="mt-1 flex items-center gap-3 rounded-full bg-[#F5C400] px-4 py-2.5 text-sm font-semibold text-black"
        >
          <Ticket size={18} />
          Ticket
        </Link>

        <Link
          href="/sales/monitoring"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <ChartNoAxesCombined size={18} />
          Monitoring Ticket
        </Link>
        <div className="mt-auto">

          <DropdownMenu>

            <DropdownMenuTrigger className="w-full rounded-xl outline-none">

              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/10">

                <Avatar className="h-10 w-10 shrink-0">

                  <AvatarFallback className="bg-[#F5C400] text-black">
                    AR
                  </AvatarFallback>

                </Avatar>

                <div className="flex-1">

                  <p className="text-sm font-semibold">
                    Akbar arohimat
                  </p>

                  <p className="text-xs text-gray-400">
                    Sales Division
                  </p>

                </div>

                <ChevronDown size={17} />

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
        <header className="flex h-20 items-center justify-between bg-white px-8">

          <div>

            <div className="flex items-center gap-2">

              <h1 className="text-3xl font-bold text-black">
                Dashboard
              </h1>

              <span className="text-xl text-gray-400">
                ›
              </span>

              <h2 className="text-xl font-semibold text-black">
                Ticket
              </h2>

            </div>

            <p className="text-sm text-gray-500">
              Buat dan kelola request ke Divisi RnD
            </p>

          </div>
          <div className="flex h-10 w-64 items-center gap-2 rounded-full bg-gray-100 px-4 shadow-inner">

            <Search
              size={17}
              className="text-gray-600"
            />

            <input
              placeholder="Find Something..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
            />

          </div>

        </header>
        <div className="p-8">
          <div className="mb-5 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-black">
                Ticket Request
              </h2>

              <p className="text-sm text-gray-500">
                Request kebutuhan kepada Divisi RnD
              </p>

            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex h-11 items-center gap-2 rounded-2xl bg-[#F5C400] px-5 text-sm font-semibold text-black shadow-md transition hover:bg-[#E5B800]"
            >
              <Plus size={18} />
              New Ticket
            </button>

          </div>
          <div className="mb-5 flex h-11 w-80 items-center gap-2 rounded-full bg-white px-4 shadow-md">

            <Search
              size={18}
              className="text-gray-600"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find ticket, customer, request..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
            />

          </div>
          <div className="min-h-[500px] rounded-2xl bg-white p-5 shadow-md">
            <div className="grid grid-cols-[0.7fr_1.3fr_1.5fr_1fr_1fr] border-b border-gray-300 pb-3 text-sm font-bold text-black">

              <div>
                Ticket
              </div>

              <div>
                Customer
              </div>

              <div>
                Request
              </div>

              <div>
                Tanggal
              </div>

              <div>
                Status
              </div>

            </div>
            {filteredTickets.map((ticket) => (

              <div
                key={ticket.id}
                className="grid grid-cols-[0.7fr_1.3fr_1.5fr_1fr_1fr] items-center border-b border-gray-200 py-5 text-sm"
              >

                <div className="font-semibold text-black">
                  {ticket.id}
                </div>

                <div className="text-gray-700">
                  {ticket.customer}
                </div>

                <div className="text-gray-700">
                  {ticket.request}
                </div>

                <div className="text-gray-500">
                  {ticket.date}
                </div>

                <div>

                  {ticket.status === "Pending" && (
                    <span className="inline-flex rounded-full bg-yellow-100 px-4 py-1 text-xs font-medium text-yellow-700">
                      Pending
                    </span>
                  )}

                  {ticket.status === "Diproses" && (
                    <span className="inline-flex rounded-full bg-gray-100 px-4 py-1 text-xs font-medium text-gray-700">
                      Diproses
                    </span>
                  )}

                  {ticket.status === "Selesai" && (
                    <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-xs font-medium text-green-600">
                      Selesai
                    </span>
                  )}

                </div>

              </div>

            ))}

            {filteredTickets.length === 0 && (
              <div className="flex h-60 items-center justify-center text-sm text-gray-400">
                Ticket tidak ditemukan
              </div>
            )}

          </div>

        </div>

      </section>
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold text-black">
                  New Ticket
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Buat request baru untuk Divisi RnD
                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200"
              >
                <X size={18} />
              </button>

            </div>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subject
                </label>

                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Request Router untuk customer"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

              </div>
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Customer
                </label>

                <select
                  required
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                >

                  <option value="">
                    Pilih Customer
                  </option>

                  <option value="PT.PTan">
                    PT.PTan
                  </option>

                  <option value="PT.ABC">
                    PT.ABC
                  </option>

                  <option value="PT.Network">
                    PT.Network
                  </option>

                </select>

              </div>
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Product
                </label>

                <select
                  required
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                >

                  <option value="">
                    Pilih Product
                  </option>

                  <option value="Router">
                    Router
                  </option>

                  <option value="Switch">
                    Switch
                  </option>

                  <option value="Access Point">
                    Access Point
                  </option>

                </select>

              </div>
              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan kebutuhan atau masalah yang ingin disampaikan kepada RnD..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

              </div>
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="h-11 rounded-xl border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex h-11 items-center gap-2 rounded-xl bg-[#F5C400] px-5 text-sm font-semibold text-black transition hover:bg-[#E5B800]"
                >
                  <Send size={17} />
                  Send Ticket
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  )
}