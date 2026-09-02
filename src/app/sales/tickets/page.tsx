"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  LayoutDashboard,
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

type TicketStatus = "PENDING" | "ON_PROGRESS" | "DONE"

type SalesTicket = {
  id: string
  requestFor: "CUSTOMER" | "COMPANY"
  priority: "NORMAL" | "MEDIUM" | "HIGH"
  request: string
  description: string
  status: TicketStatus
  createdAt: string
}

export default function SalesTickets() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)

  const [requestFor, setRequestFor] = useState("")
  const [priority, setPriority] = useState("NORMAL")
  const [request, setRequest] = useState("")
  const [description, setDescription] = useState("")

  const [tickets, setTickets] = useState<SalesTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const getToken = () => {
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")
    )
  }

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError("")

      const token = getToken()

      if (!token) {
        router.replace("/")
        return
      }

      const response = await fetch(
        "http://localhost:5000/api/sales-requests",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil ticket")
      }

      setTickets(data.requests || [])
    } catch (error) {
      console.error("Fetch tickets error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil ticket"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const filteredTickets = tickets.filter((ticket) =>
    `${ticket.id} ${ticket.requestFor} ${ticket.request} ${ticket.priority} ${ticket.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSubmitting(true)
      setError("")

      const token = getToken()

      if (!token) {
        router.replace("/")
        return
      }

      const response = await fetch(
        "http://localhost:5000/api/sales-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestFor,
            priority,
            request,
            description,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat ticket")
      }

      setShowModal(false)

      setRequestFor("")
      setPriority("NORMAL")
      setRequest("")
      setDescription("")

      await fetchTickets()
    } catch (error) {
      console.error("Create ticket error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Gagal membuat ticket"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getStatusLabel = (status: TicketStatus) => {
    if (status === "PENDING") return "Pending"
    if (status === "ON_PROGRESS") return "Diproses"
    return "Selesai"
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
                  localStorage.removeItem("token")
                  sessionStorage.removeItem("token")
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
              placeholder="Find ticket, request..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
            />

          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="min-h-[500px] rounded-2xl bg-white p-5 shadow-md">

            <div className="grid grid-cols-[0.7fr_1.3fr_1.5fr_1fr_1fr] border-b border-gray-300 pb-3 text-sm font-bold text-black">

              <div>
                Ticket
              </div>

              <div>
                Request For
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

            {loading ? (

              <div className="flex h-60 items-center justify-center text-sm text-gray-400">
                Memuat ticket...
              </div>

            ) : filteredTickets.length > 0 ? (

              filteredTickets.map((ticket) => (

                <div
                  key={ticket.id}
                  className="grid grid-cols-[0.7fr_1.3fr_1.5fr_1fr_1fr] items-center border-b border-gray-200 py-5 text-sm"
                >

                  <div className="font-semibold text-black">
                    #{ticket.id.slice(0, 8)}
                  </div>

                  <div className="text-gray-700">
                    {ticket.requestFor === "CUSTOMER"
                      ? "Customer"
                      : "Company"}
                  </div>

                  <div className="truncate pr-4 text-gray-700">
                    {ticket.request}
                  </div>

                  <div className="text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </div>

                  <div>

                    {ticket.status === "PENDING" && (
                      <span className="inline-flex rounded-full bg-yellow-100 px-4 py-1 text-xs font-medium text-yellow-700">
                        Pending
                      </span>
                    )}

                    {ticket.status === "ON_PROGRESS" && (
                      <span className="inline-flex rounded-full bg-gray-100 px-4 py-1 text-xs font-medium text-gray-700">
                        Diproses
                      </span>
                    )}

                    {ticket.status === "DONE" && (
                      <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-xs font-medium text-green-600">
                        Selesai
                      </span>
                    )}

                  </div>

                </div>

              ))

            ) : (

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
                  Request For
                </label>

                <select
                  required
                  value={requestFor}
                  onChange={(e) => setRequestFor(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                >

                  <option value="">
                    Pilih Request For
                  </option>

                  <option value="CUSTOMER">
                    Customer
                  </option>

                  <option value="COMPANY">
                    Company
                  </option>

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Priority
                </label>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                >

                  <option value="NORMAL">
                    Normal
                  </option>

                  <option value="MEDIUM">
                    Medium
                  </option>

                  <option value="HIGH">
                    High
                  </option>

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Request
                </label>

                <input
                  required
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Contoh: Request Router"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

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
                  disabled={submitting}
                  className="h-11 rounded-xl border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-11 items-center gap-2 rounded-xl bg-[#F5C400] px-5 text-sm font-semibold text-black transition hover:bg-[#E5B800] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={17} />
                  {submitting ? "Sending..." : "Send Ticket"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  )
}