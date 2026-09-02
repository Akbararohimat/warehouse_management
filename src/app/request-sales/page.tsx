"use client"

import { useEffect, useState } from "react"
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

type RequestStatus = "PENDING" | "ON_PROGRESS" | "DONE"

type FollowUp = {
  id: string
  message: string
  createdAt: string
  user: {
    id: string
    name: string
    division: string
  }
}

type RequestData = {
  id: string
  requestedBy: {
    id: string
    name: string
    email: string
    division: string
  }
  requestFor: "CUSTOMER" | "COMPANY"
  priority: "NORMAL" | "MEDIUM" | "HIGH"
  request: string
  description: string
  status: RequestStatus
  createdAt: string
  updatedAt: string
  followUps?: FollowUp[]
}

type LoggedInUser = {
  id: string
  name: string
  email: string
  role: string
  division: string
}

export default function RequestSales() {
  const router = useRouter()

  const [search, setSearch] = useState("")

  const [requests, setRequests] = useState<RequestData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [user, setUser] = useState<LoggedInUser | null>(null)
  const [selectedRequest, setSelectedRequest] =
    useState<RequestData | null>(null)

  const [showForm, setShowForm] = useState(false)

  const [followUpMessage, setFollowUpMessage] = useState("")
  const [followUpLoading, setFollowUpLoading] = useState(false)
  const [followUpError, setFollowUpError] = useState("")

  const getToken = () => {
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")
    )
  }
  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user") ||
        sessionStorage.getItem("user")

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Get logged in user error:", error)
    }
  }, [])

  const fetchRequests = async () => {
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
        throw new Error(
          data.message || "Gagal mengambil request sales"
        )
      }

      setRequests(data.requests || [])
    } catch (error) {
      console.error("Fetch request sales error:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil request sales"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const filteredRequests = requests.filter((item) =>
    `${item.requestedBy.name} ${item.request} ${item.requestFor} ${item.priority} ${item.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusLabel = (status: RequestStatus) => {
    if (status === "PENDING") {
      return "Pending"
    }

    if (status === "ON_PROGRESS") {
      return "Diproses"
    }

    return "Selesai"
  }

  const getInitials = (name: string) => {
    if (!name) return "U"

    const words = name.trim().split(" ")

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase()
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase()
  }
  const handleOpenFollowUp = (request: RequestData) => {
    setSelectedRequest(request)
    setFollowUpMessage("")
    setFollowUpError("")
    setShowForm(true)
  }

  const handleCloseFollowUp = () => {
    if (followUpLoading) return

    setShowForm(false)
    setSelectedRequest(null)
    setFollowUpMessage("")
    setFollowUpError("")
  }
  const handleFollowUp = async () => {
    if (!selectedRequest) {
      setFollowUpError("Request belum dipilih.")
      return
    }

    if (!followUpMessage.trim()) {
      setFollowUpError("Pesan follow-up wajib diisi.")
      return
    }

    try {
      setFollowUpLoading(true)
      setFollowUpError("")

      const token = getToken()

      if (!token) {
        router.replace("/")
        return
      }

      const response = await fetch(
        `http://localhost:5000/api/sales-requests/${selectedRequest.id}/follow-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: followUpMessage.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menambahkan follow-up"
        )
      }
      await fetchRequests()
      setShowForm(false)
      setSelectedRequest(null)
      setFollowUpMessage("")
      setFollowUpError("")
    } catch (error) {
      console.error("Follow up error:", error)

      setFollowUpError(
        error instanceof Error
          ? error.message
          : "Gagal menambahkan follow-up"
      )
    } finally {
      setFollowUpLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
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

        <Link
          href="/products"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm hover:bg-[#211344]"
        >
          <FileText size={19} />
          <span>Products</span>
        </Link>

        <Link
          href="/principal"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm hover:bg-[#211344]"
        >
          <FileText size={19} />
          <span>Vendor/Principal</span>
        </Link>
        <div className="mt-auto pt-5">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full rounded-xl outline-none">
              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#211344]">

                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-white text-[#10052D]">
                    {getInitials(user?.name || "User")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-gray-300">
                    {user?.division
                      ? `${user.division} Division`
                      : "RnD Division"}
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
                  localStorage.removeItem("authToken")
                  sessionStorage.removeItem("authToken")
                  localStorage.removeItem("user")
                  sessionStorage.removeItem("user")

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

        <div className="px-8 pt-16">

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
              onClick={() => {
                if (selectedRequest) {
                  handleOpenFollowUp(selectedRequest)
                  return
                }

                if (filteredRequests.length > 0) {
                  handleOpenFollowUp(filteredRequests[0])
                  return
                }

                setFollowUpError(
                  "Belum ada request yang bisa di-follow-up."
                )
                setShowForm(true)
              }}
              className="flex h-12 items-center gap-2 rounded-2xl bg-[#33245A] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46]"
            >
              <SquarePen size={20} />

              <span>
                Follow Up
              </span>
            </button>

          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="min-h-[330px] w-full max-w-[700px] rounded-2xl bg-white p-4 shadow-md">

            <div className="grid grid-cols-[1.1fr_1fr_1.2fr_0.8fr] items-center border-b border-gray-400 px-2 pb-3">

              <p className="text-sm font-bold text-black">
                Nama
              </p>

              <p className="text-sm font-bold text-black">
                Request
              </p>

              <p className="text-sm font-bold text-black">
                Tanggal Request
              </p>

              <p className="text-sm font-bold text-black">
                Status
              </p>

            </div>

            {loading ? (

              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-gray-400">
                  Memuat request sales...
                </p>
              </div>

            ) : filteredRequests.length > 0 ? (

              filteredRequests.map((item) => (

                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedRequest(item)
                  }}
                  className={`grid cursor-pointer grid-cols-[1.1fr_1fr_1.2fr_0.8fr] items-center border-b border-gray-400 px-2 py-4 transition ${
                    selectedRequest?.id === item.id
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >

                  <p className="truncate pr-2 text-xs font-medium text-gray-800">
                    {item.requestedBy.name}
                  </p>

                  <p className="truncate pr-2 text-xs text-gray-700">
                    {item.request}
                  </p>

                  <p className="text-xs text-gray-700">
                    {formatDate(item.createdAt)}
                  </p>

                  <div>
                    <span
                      className={`inline-flex rounded-full px-5 py-1 text-xs font-medium ${
                        item.status === "DONE"
                          ? "bg-green-100 text-green-500"
                          : item.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-500"
                      }`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </div>

                </div>

              ))

            ) : (

              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-gray-400">
                  Data request tidak ditemukan.
                </p>
              </div>

            )}

          </div>

        </div>

      </section>
      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="max-h-[85vh] w-[480px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-black">
                  Follow Up Request
                </h2>

                <p className="text-sm text-gray-500">
                  Follow up request dari Sales
                </p>
              </div>

              <button
                onClick={handleCloseFollowUp}
                disabled={followUpLoading}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            {selectedRequest ? (

              <>
                <div className="mb-5 rounded-xl bg-gray-50 p-4">

                  <div className="mb-3">
                    <p className="text-xs text-gray-500">
                      Nama Sales
                    </p>

                    <p className="text-sm font-semibold text-gray-800">
                      {selectedRequest.requestedBy.name}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500">
                      Request For
                    </p>

                    <p className="text-sm font-semibold text-gray-800">
                      {selectedRequest.requestFor}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500">
                      Request
                    </p>

                    <p className="text-sm font-semibold text-gray-800">
                      {selectedRequest.request}
                    </p>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500">
                      Description
                    </p>

                    <p className="text-sm text-gray-700">
                      {selectedRequest.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-xs text-gray-500">
                        Tanggal Request
                      </p>

                      <p className="text-sm text-gray-700">
                        {formatDate(selectedRequest.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Status
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-4 py-1 text-xs font-medium ${
                          selectedRequest.status === "DONE"
                            ? "bg-green-100 text-green-500"
                            : selectedRequest.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-blue-100 text-blue-500"
                        }`}
                      >
                        {getStatusLabel(
                          selectedRequest.status
                        )}
                      </span>
                    </div>

                  </div>

                </div>
                {selectedRequest.followUps &&
                  selectedRequest.followUps.length > 0 && (

                    <div className="mb-5">

                      <p className="mb-3 text-sm font-semibold text-gray-800">
                        Riwayat Follow Up
                      </p>

                      <div className="space-y-3">

                        {selectedRequest.followUps.map(
                          (followUp) => (

                            <div
                              key={followUp.id}
                              className="rounded-xl border border-gray-200 p-3"
                            >

                              <div className="mb-1 flex items-center justify-between">

                                <p className="text-xs font-semibold text-gray-800">
                                  {followUp.user.name}
                                </p>

                                <p className="text-[10px] text-gray-400">
                                  {formatDateTime(
                                    followUp.createdAt
                                  )}
                                </p>

                              </div>

                              <p className="text-xs leading-5 text-gray-600">
                                {followUp.message}
                              </p>

                            </div>

                          )
                        )}

                      </div>

                    </div>
                  )}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Pesan Follow Up
                  </label>

                  <textarea
                    value={followUpMessage}
                    onChange={(e) => {
                      setFollowUpMessage(e.target.value)
                      setFollowUpError("")
                    }}
                    placeholder="Tulis hasil follow up..."
                    rows={5}
                    disabled={followUpLoading}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#33245A] disabled:bg-gray-100"
                  />

                </div>

                {followUpError && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {followUpError}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">

                  <button
                    onClick={handleCloseFollowUp}
                    disabled={followUpLoading}
                    className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Batal
                  </button>

                  <button
                    onClick={handleFollowUp}
                    disabled={
                      followUpLoading ||
                      !followUpMessage.trim()
                    }
                    className="rounded-xl bg-[#33245A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#271b46] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {followUpLoading
                      ? "Mengirim..."
                      : "Kirim Follow Up"}
                  </button>

                </div>

              </>

            ) : (

              <>
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                  Belum ada request sales yang dipilih.
                </div>

                {followUpError && (
                  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {followUpError}
                  </div>
                )}

                <div className="mt-6 flex justify-end">

                  <button
                    onClick={handleCloseFollowUp}
                    className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Tutup
                  </button>

                </div>
              </>

            )}

          </div>

        </div>

      )}

    </main>
  )
}