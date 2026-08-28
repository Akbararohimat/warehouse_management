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
  ChevronDown,
  X,
  Clock3,
  CheckCircle2,
  CircleAlert,
  ArrowRight,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TicketStatus = "Pending" | "Diproses" | "Selesai"

type TicketData = {
  id: string
  customer: string
  product: string
  request: string
  date: string
  status: TicketStatus
  description: string
}

const tickets: TicketData[] = [
  {
    id: "#003",
    customer: "PT.Network",
    product: "Access Point",
    request: "Upgrade Access Point",
    date: "17/02/2027",
    status: "Selesai",
    description:
      "Upgrade access point untuk meningkatkan jangkauan jaringan.",
  },
]

export default function MonitoringTicket() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"Semua" | TicketStatus>(
   "Semua"
  )

  const [selectedTicket, setSelectedTicket] =
    useState<TicketData | null>(null)

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = `${ticket.id} ${ticket.customer} ${ticket.product} ${ticket.request}`
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "Semua" || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusStyle = (status: TicketStatus) => {
    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700"
    }

    if (status === "Diproses") {
      return "bg-gray-100 text-gray-700"
    }

    return "bg-green-100 text-green-600"
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
          href="/sales/tickets"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <Ticket size={18} />
          Ticket
        </Link>

        <Link
          href="/sales/monitoring"
          className="mt-1 flex items-center gap-3 rounded-full bg-[#F5C400] px-4 py-2.5 text-sm font-semibold text-black"
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
                onClick={() => router.push("/sales/edit-profile")}
              >
                <UserRound className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/sales/settings")}
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
                Monitoring Ticket
              </h2>

            </div>

            <p className="text-sm text-gray-500">
              Pantau progress request kepada Divisi RnD
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

       
          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-black">
                Monitoring Ticket
              </h2>

              <p className="text-sm text-gray-500">
                Lihat status dan perkembangan setiap request
              </p>

            </div>

            <Link
              href="/sales/tickets"
              className="flex h-11 items-center gap-2 rounded-2xl bg-[#F5C400] px-5 text-sm font-semibold text-black shadow-md transition hover:bg-[#E5B800]"
            >
              Buat Ticket
              <ArrowRight size={17} />
            </Link>

          </div>

          <div className="mb-6 grid grid-cols-4 gap-4">

            <div className="rounded-2xl bg-white p-5 shadow-md">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-black">
                <Ticket size={18} />
              </div>

              <p className="text-2xl font-bold text-black">
                {tickets.length}
              </p>

              <p className="text-sm text-gray-500">
                Total Ticket
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-md">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                <CircleAlert size={18} />
              </div>

              <p className="text-2xl font-bold text-black">
                {tickets.filter(
                  (ticket) => ticket.status === "Pending"
                ).length}
              </p>

              <p className="text-sm text-gray-500">
                Pending
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-md">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Clock3 size={18} />
              </div>

              <p className="text-2xl font-bold text-black">
                {tickets.filter(
                  (ticket) => ticket.status === "Diproses"
                ).length}
              </p>

              <p className="text-sm text-gray-500">
                Diproses
              </p>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow-md">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <CheckCircle2 size={18} />
              </div>

              <p className="text-2xl font-bold text-black">
                {tickets.filter(
                  (ticket) => ticket.status === "Selesai"
                ).length}
              </p>

              <p className="text-sm text-gray-500">
                Selesai
              </p>

            </div>

          </div>

          <div className="mb-5 flex items-center justify-between">

            <div className="flex h-11 w-80 items-center gap-2 rounded-full bg-white px-4 shadow-md">

              <Search
                size={18}
                className="text-gray-600"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ticket atau customer..."
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
              />

            </div>

            <div className="flex items-center gap-2">

              {(["Semua", "Pending", "Diproses", "Selesai"] as const).map(
                (status) => (

                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                      statusFilter === status
                        ? "bg-[#F5C400] text-black"
                        : "bg-white text-gray-600 shadow-sm hover:bg-gray-100"
                    }`}
                  >
                    {status}
                  </button>

                )
              )}

            </div>

          </div>

          <div className="rounded-2xl bg-white p-5 shadow-md">
           
            <div className="grid grid-cols-[0.7fr_1.2fr_1.1fr_1.3fr_1fr_0.9fr] border-b border-gray-300 pb-3 text-xs font-bold text-gray-700">

              <div>
                Ticket
              </div>

              <div>
                Customer
              </div>

              <div>
                Product
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

              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="grid w-full grid-cols-[0.7fr_1.2fr_1.1fr_1.3fr_1fr_0.9fr] items-center border-b border-gray-200 py-5 text-left text-sm transition hover:bg-gray-50"
              >

                <div className="font-semibold text-black">
                  {ticket.id}
                </div>

                <div className="text-gray-700">
                  {ticket.customer}
                </div>

                <div className="text-gray-700">
                  {ticket.product}
                </div>

                <div className="text-gray-700">
                  {ticket.request}
                </div>

                <div className="text-gray-500">
                  {ticket.date}
                </div>

                <div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </span>

                </div>

              </button>

            ))}

            {filteredTickets.length === 0 && (

              <div className="flex h-52 items-center justify-center text-sm text-gray-400">
                Ticket tidak ditemukan
              </div>

            )}

          </div>

        </div>

      </section>

      {selectedTicket && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-2xl rounded-3xl bg-white p-7 shadow-2xl">

            <div className="mb-6 flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Ticket {selectedTicket.id}
                </p>

                <h2 className="mt-1 text-2xl font-bold text-black">
                  {selectedTicket.request}
                </h2>

              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <X size={18} />
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Customer
                </p>

                <p className="mt-1 font-semibold text-black">
                  {selectedTicket.customer}
                </p>

              </div>

              <div className="rounded-xl bg-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Product
                </p>

                <p className="mt-1 font-semibold text-black">
                  {selectedTicket.product}
                </p>

              </div>

              <div className="rounded-xl bg-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Tanggal Request
                </p>

                <p className="mt-1 font-semibold text-black">
                  {selectedTicket.date}
                </p>

              </div>

              <div className="rounded-xl bg-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                    selectedTicket.status
                  )}`}
                >
                  {selectedTicket.status}
                </span>

              </div>

            </div>

            <div className="mt-5">

              <p className="mb-2 text-sm font-semibold text-gray-700">
                Description
              </p>

              <div className="rounded-xl border border-gray-200 p-4 text-sm leading-6 text-gray-600">
                {selectedTicket.description}
              </div>

            </div>

            <div className="mt-6">

              <p className="mb-4 text-sm font-semibold text-gray-700">
                Ticket Progress
              </p>

              <div className="space-y-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 size={16} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-black">
                      Ticket dibuat
                    </p>

                    <p className="text-xs text-gray-500">
                      Request telah dikirim oleh Sales
                    </p>

                  </div>

                </div>

                <div className="ml-4 h-5 border-l border-gray-300" />

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      selectedTicket.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    <Clock3 size={16} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-black">
                      RnD menerima request
                    </p>

                    <p className="text-xs text-gray-500">
                      {selectedTicket.status === "Pending"
                        ? "Menunggu request diproses"
                        : "Request sudah diterima RnD"}
                    </p>

                  </div>

                </div>

                <div className="ml-4 h-5 border-l border-gray-300" />

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      selectedTicket.status === "Selesai"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <CheckCircle2 size={16} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-black">
                      Request selesai
                    </p>

                    <p className="text-xs text-gray-500">
                      {selectedTicket.status === "Selesai"
                        ? "Request telah diselesaikan"
                        : "Belum selesai"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="mt-7 flex justify-end">

              <button
                onClick={() => setSelectedTicket(null)}
                className="h-11 rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Tutup
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}