"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  UserRound,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  UserX,
  ShieldCheck,
  UserCheck,
  UserRoundX,
  Building2,
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

type User = {
  id: string
  name: string
  email: string
  role: string
  division: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type FormData = {
  name: string
  email: string
  password: string
  division: "RND" | "SALES"
}

type FilterType = "ALL" | "ADMIN" | "RND" | "SALES"

export default function UserManagement() {
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [search, setSearch] = useState("")
  const [userFilter, setUserFilter] =
    useState<FilterType>("ALL")

  const [showAddModal, setShowAddModal] =
    useState(false)
  const [showEditModal, setShowEditModal] =
    useState(false)
  const [showDeleteModal, setShowDeleteModal] =
    useState(false)

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    division: "RND",
  })

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [statusUpdatingId, setStatusUpdatingId] =
    useState<string | null>(null)

  const getToken = () => {
    return (
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  const getDivisionName = (division: string) => {
    if (division === "RND") {
      return "RnD Division"
    }

    if (division === "SALES") {
      return "Sales Division"
    }

    if (division === "ADMIN") {
      return "Admin Division"
    }

    return division
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")

    sessionStorage.removeItem("authToken")
    sessionStorage.removeItem("user")

    router.replace("/")
  }

  const fetchCurrentUser = async () => {
    const token = getToken()

    if (!token) {
      router.replace("/")
      return null
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        handleLogout()
        return null
      }

      setCurrentUser(data.user)

      if (data.user.role !== "ADMIN") {
        router.replace("/dashboard")
        return null
      }

      return data.user
    } catch (error) {
      console.error(
        "Get current user error:",
        error
      )

      return null
    }
  }

  const fetchUsers = async () => {
    const token = getToken()

    if (!token) {
      router.replace("/")
      return
    }

    setLoadingUsers(true)

    try {
      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout()
          return
        }

        if (response.status === 403) {
          router.replace("/dashboard")
          return
        }

        throw new Error(
          data.message ||
            "Gagal mengambil data user"
        )
      }

      setUsers(data.users || [])
    } catch (error) {
      console.error(
        "Get users error:",
        error
      )
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    async function initialize() {
      setLoading(true)

      const user = await fetchCurrentUser()

      if (user?.role === "ADMIN") {
        await fetchUsers()
      }

      setLoading(false)
    }

    initialize()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue =
        search.trim().toLowerCase()

      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue)

      let matchesFilter = true

      if (userFilter === "ADMIN") {
        matchesFilter = user.role === "ADMIN"
      }

      if (userFilter === "RND") {
        matchesFilter =
          user.division === "RND"
      }

      if (userFilter === "SALES") {
        matchesFilter =
          user.division === "SALES"
      }

      return (
        matchesSearch &&
        matchesFilter
      )
    })
  }, [users, search, userFilter])

  const totalUsers = users.length

  const activeUsers = users.filter(
    (user) => user.isActive
  ).length

  const inactiveUsers = users.filter(
    (user) => !user.isActive
  ).length

  const adminUsers = users.filter(
    (user) => user.role === "ADMIN"
  ).length

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      division: "RND",
    })

    setErrorMessage("")
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const closeAddModal = () => {
    if (submitting) {
      return
    }

    setShowAddModal(false)
    resetForm()
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)

    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      division:
        user.division === "SALES"
          ? "SALES"
          : "RND",
    })

    setErrorMessage("")
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    if (submitting) {
      return
    }

    setShowEditModal(false)
    setSelectedUser(null)
    resetForm()
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setErrorMessage("")
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    if (submitting) {
      return
    }

    setShowDeleteModal(false)
    setSelectedUser(null)
    setErrorMessage("")
  }

  const handleCreateUser = async () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setErrorMessage(
        "Nama, email, dan password wajib diisi"
      )
      return
    }

    const token = getToken()

    if (!token) {
      handleLogout()
      return
    }

    setSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch(
        "http://localhost:5000/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            division: formData.division,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "Gagal membuat user"
        )
        return
      }

      setUsers((previousUsers) => [
        data.user,
        ...previousUsers,
      ])

      setShowAddModal(false)
      resetForm()
    } catch (error) {
      console.error(
        "Create user error:",
        error
      )

      setErrorMessage(
        "Tidak dapat terhubung ke server"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) {
      return
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim()
    ) {
      setErrorMessage(
        "Nama dan email wajib diisi"
      )
      return
    }

    const token = getToken()

    if (!token) {
      handleLogout()
      return
    }

    setSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            division: formData.division,
            ...(formData.password
              ? {
                  password:
                    formData.password,
                }
              : {}),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "Gagal memperbarui user"
        )
        return
      }

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === selectedUser.id
            ? data.user
            : user
        )
      )

      setShowEditModal(false)
      setSelectedUser(null)
      resetForm()
    } catch (error) {
      console.error(
        "Update user error:",
        error
      )

      setErrorMessage(
        "Tidak dapat terhubung ke server"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (
    user: User
  ) => {
    if (user.role === "ADMIN") {
      return
    }

    const token = getToken()

    if (!token) {
      handleLogout()
      return
    }

    setStatusUpdatingId(user.id)

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: !user.isActive,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(
          data.message ||
            "Gagal mengubah status user"
        )
        return
      }

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.id === user.id
            ? data.user
            : item
        )
      )
    } catch (error) {
      console.error(
        "Update user status error:",
        error
      )

      alert(
        "Tidak dapat terhubung ke server"
      )
    } finally {
      setStatusUpdatingId(null)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      return
    }

    const token = getToken()

    if (!token) {
      handleLogout()
      return
    }

    setSubmitting(true)
    setErrorMessage("")

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "Gagal menghapus user"
        )
        return
      }
      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === selectedUser.id
            ? data.user || {
                ...user,
                isActive: false,
              }
            : user
        )
      )

      setShowDeleteModal(false)
      setSelectedUser(null)
      setErrorMessage("")
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      )

      setErrorMessage(
        "Tidak dapat terhubung ke server"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const sidebarItem =
    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/65 transition-all duration-200 hover:bg-white/[0.07] hover:text-white"

  const activeSidebarItem =
    "group flex items-center gap-3 rounded-xl bg-white/[0.10] px-4 py-3 text-sm font-semibold text-white shadow-sm"

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:bg-white focus:ring-4 focus:ring-[#010736]/5 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 dark:focus:bg-slate-800 dark:focus:ring-blue-400/10"

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] dark:bg-[#080d1c]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#010736] dark:border-slate-700 dark:border-t-blue-400" />

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading User Management...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-900 dark:bg-[#080d1c] dark:text-white">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-[#010736] px-4 py-5 text-white">
        <div className="mb-8 flex items-center gap-3 px-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
            <Image
              src="/OIP.webp"
              alt="Logo"
              width={44}
              height={44}
              className="h-full w-full object-contain p-1"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold tracking-tight">
              Divisi Admin
            </p>

            <p className="mt-0.5 text-[11px] text-white/45">
              Management Portal
            </p>
          </div>

        </div>

        <div className="px-2">

          <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
            Menu
          </p>

          <div className="space-y-1">

            <Link
              href="/dashboard"
              className={sidebarItem}
            >
              <LayoutDashboard
                size={18}
                className="text-white/55 transition group-hover:text-white"
              />

              <span>
                Dashboard
              </span>
            </Link>

            <Link
              href="/user-management"
              className={activeSidebarItem}
            >
              <Users size={18} />

              <span>
                User Management
              </span>

              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-300" />
            </Link>

            <Link
              href="/contact-list"
              className={sidebarItem}
            >
              <Users
                size={18}
                className="text-white/55 transition group-hover:text-white"
              />

              <span>
                Contact List
              </span>
            </Link>

            <Link
              href="/request-sales"
              className={sidebarItem}
            >
              <FileText
                size={18}
                className="text-white/55 transition group-hover:text-white"
              />

              <span>
                Request Sales
              </span>
            </Link>

            <Link
              href="/products"
              className={sidebarItem}
            >
              <FileText
                size={18}
                className="text-white/55 transition group-hover:text-white"
              />

              <span>
                Products
              </span>
            </Link>

            <Link
              href="/principal"
              className={sidebarItem}
            >
              <Building2
                size={18}
                className="text-white/55 transition group-hover:text-white"
              />

              <span>
                Vendor / Principal
              </span>
            </Link>

          </div>

        </div>
        <div className="mt-auto border-t border-white/10 pt-4">

          <DropdownMenu>

            <DropdownMenuTrigger className="w-full rounded-xl outline-none">

              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.07]">

                <Avatar className="h-10 w-10 shrink-0 border border-white/10">

                  <AvatarFallback className="bg-white text-sm font-bold text-[#010736]">
                    {currentUser
                      ? getInitials(
                          currentUser.name
                        )
                      : "AA"}
                  </AvatarFallback>

                </Avatar>

                <div className="min-w-0 flex-1">

                  <p className="truncate text-sm font-semibold text-white">
                    {currentUser?.name ||
                      "Loading..."}
                  </p>

                  <p className="mt-0.5 truncate text-[11px] text-white/45">
                    {currentUser
                      ? getDivisionName(
                          currentUser.division
                        )
                      : "Loading..."}
                  </p>

                </div>

                <ChevronDown
                  size={16}
                  className="shrink-0 text-white/45"
                />

              </div>

            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="top"
              className="mb-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >

              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    "/edit-profile"
                  )
                }
                className="rounded-lg"
              >
                <UserRound className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  router.push("/settings")
                }
                className="rounded-lg"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="rounded-lg text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </aside>
      <section className="ml-[260px] min-h-screen">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-slate-200/80 bg-[#f6f7fb]/90 px-8 backdrop-blur-xl dark:border-slate-800 dark:bg-[#080d1c]/90">

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Administration
            </p>

            <h1 className="text-[25px] font-bold tracking-tight text-slate-950 dark:text-white">
              User Management
            </h1>

            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Kelola akun RnD dan Sales
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden h-11 w-[260px] items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm transition focus-within:border-[#010736]/30 focus-within:ring-4 focus-within:ring-[#010736]/5 lg:flex dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-blue-400/30 dark:focus-within:ring-blue-400/5">

              <Search
                size={17}
                className="shrink-0 text-slate-400 dark:text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari user..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
              />

              {search && (
                <button
                  onClick={() =>
                    setSearch("")
                  }
                  className="text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
                >
                  <X size={15} />
                </button>
              )}

            </div>

            <button
              onClick={openAddModal}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#010736] px-4 text-sm font-semibold text-white shadow-lg shadow-[#010736]/10 transition hover:bg-[#07115c] active:scale-[0.98] dark:bg-blue-600 dark:shadow-blue-900/20 dark:hover:bg-blue-500"
            >
              <Plus size={17} strokeWidth={2.2} />
              <span>Add User</span>
            </button>

          </div>

        </header>

        <div className="p-8">

          <div className="mb-6 flex h-11 items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm lg:hidden dark:border-slate-700 dark:bg-slate-900">

            <Search
              size={17}
              className="text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Cari user..."
              className="w-full bg-transparent text-sm outline-none dark:text-white"
            />

          </div>
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Total User
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {totalUsers}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#010736]/[0.06] text-[#010736] dark:bg-blue-400/10 dark:text-blue-400">
                  <Users size={19} />
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                Semua akun terdaftar
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    User Aktif
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {activeUsers}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400">
                  <UserCheck size={19} />
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                Akun yang dapat digunakan
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    User Nonaktif
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {inactiveUsers}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-400">
                  <UserRoundX size={19} />
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                Akun yang dinonaktifkan
              </p>

            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Administrator
                  </p>

                  <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {adminUsers}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400">
                  <ShieldCheck size={19} />
                </div>

              </div>

              <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                Akun dengan akses admin
              </p>

            </div>

          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200/80 px-6 py-5 dark:border-slate-800">

              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                <div>
                  <h2 className="text-base font-bold text-slate-950 dark:text-white">
                    Daftar User
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {filteredUsers.length} user ditemukan
                  </p>
                </div>

                <div className="flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">

                  {(
                    [
                      ["ALL", "Semua"],
                      ["ADMIN", "Admin"],
                      ["RND", "RnD"],
                      ["SALES", "Sales"],
                    ] as [
                      FilterType,
                      string
                    ][]
                  ).map(
                    ([value, label]) => (
                      <button
                        key={value}
                        onClick={() =>
                          setUserFilter(value)
                        }
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                          userFilter === value
                            ? "bg-white text-[#010736] shadow-sm dark:bg-slate-700 dark:text-white"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    )
                  )}

                </div>

              </div>

            </div>

            {loadingUsers ? (

              <div className="flex min-h-[360px] items-center justify-center">

                <div className="flex flex-col items-center gap-3">

                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#010736] dark:border-slate-700 dark:border-t-blue-400" />

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Mengambil data user...
                  </p>

                </div>

              </div>

            ) : filteredUsers.length === 0 ? (

              <div className="flex min-h-[360px] flex-col items-center justify-center px-6">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <Users size={24} />
                </div>

                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tidak ada user ditemukan
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Coba ubah pencarian atau filter.
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>
                    <tr className="border-b border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        User
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Email
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Division
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Role
                      </th>

                      <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {filteredUsers.map(
                      (user) => (
                        <tr
                          key={user.id}
                          className="group border-b border-slate-100 transition-colors hover:bg-slate-50/70 last:border-0 dark:border-slate-800/80 dark:hover:bg-slate-800/40"
                        >

                          {/* USER */}
                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <Avatar className="h-10 w-10 shrink-0 border border-slate-200 dark:border-slate-700">

                                <AvatarFallback
                                  className={`text-xs font-bold ${
                                    user.role ===
                                    "ADMIN"
                                      ? "bg-[#010736] text-white dark:bg-blue-600"
                                      : "bg-blue-50 text-[#010736] dark:bg-blue-400/10 dark:text-blue-300"
                                  }`}
                                >
                                  {getInitials(
                                    user.name
                                  )}
                                </AvatarFallback>

                              </Avatar>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                  {user.name}
                                </p>

                                {user.id ===
                                  currentUser?.id && (
                                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-[#010736] dark:text-blue-400">
                                    <Check
                                      size={11}
                                    />
                                    Akun Anda
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {user.email}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">

                              <Building2
                                size={12}
                              />

                              {getDivisionName(
                                user.division
                              )}

                            </span>

                          </td>

    
                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                user.role ===
                                "ADMIN"
                                  ? "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300"
                              }`}
                            >
                              {user.role ===
                              "ADMIN" ? (
                                <ShieldCheck
                                  size={12}
                                />
                              ) : (
                                <Users
                                  size={12}
                                />
                              )}

                              {user.role}
                            </span>

                          </td>


                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                                user.isActive
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                                  : "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  user.isActive
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                                }`}
                              />

                              {user.isActive
                                ? "Aktif"
                                : "Nonaktif"}
                            </span>

                          </td>

                          <td className="px-6 py-4">

                            <div className="flex justify-end gap-1.5">

                              {user.role !==
                                "ADMIN" ? (
                                <>
                                  <button
                                    onClick={() =>
                                      openEditModal(
                                        user
                                      )
                                    }
                                    title="Edit user"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-[#010736]/20 hover:bg-[#010736]/5 hover:text-[#010736] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-400/20 dark:hover:bg-blue-400/10 dark:hover:text-blue-400"
                                  >
                                    <Pencil
                                      size={15}
                                    />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleToggleStatus(
                                        user
                                      )
                                    }
                                    disabled={
                                      statusUpdatingId ===
                                      user.id
                                    }
                                    title={
                                      user.isActive
                                        ? "Nonaktifkan"
                                        : "Aktifkan"
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-400/20 dark:hover:bg-amber-400/10 dark:hover:text-amber-400"
                                  >
                                    {statusUpdatingId ===
                                    user.id ? (
                                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700 dark:border-slate-600 dark:border-t-white" />
                                    ) : user.isActive ? (
                                      <UserX
                                        size={15}
                                      />
                                    ) : (
                                      <Check
                                        size={15}
                                      />
                                    )}
                                  </button>

                                  <button
                                    onClick={() =>
                                      openDeleteModal(
                                        user
                                      )
                                    }
                                    title="Hapus akses user"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40"
                                  >
                                    <Trash2
                                      size={15}
                                    />
                                  </button>
                                </>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                  <ShieldCheck
                                    size={12}
                                  />
                                  Protected
                                </span>
                              )}

                            </div>

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </section>

  
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          <div className="relative max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl dark:border-slate-700 dark:bg-slate-900">

            <button
              onClick={closeAddModal}
              disabled={submitting}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="pr-10">

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#010736] text-white shadow-lg shadow-[#010736]/10 dark:bg-blue-600">
                <Plus size={21} />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Add New User
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Buat akun baru untuk divisi RnD atau Sales.
              </p>

            </div>

            <div className="mt-7 space-y-5">

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Nama
                </label>

                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Masukkan nama"
                  className={inputClass}
                />

              </div>

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="Masukkan email"
                  className={inputClass}
                />

              </div>

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>

                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder="Masukkan password"
                  className={inputClass}
                />

              </div>

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Division
                </label>

                <select
                  value={formData.division}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      division:
                        e.target.value as
                          | "RND"
                          | "SALES",
                    })
                  }
                  className={inputClass}
                >
                  <option value="RND">
                    RnD
                  </option>

                  <option value="SALES">
                    Sales
                  </option>
                </select>

              </div>

            </div>

            {errorMessage && (
              <p className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                {errorMessage}
              </p>
            )}

            <div className="mt-7 flex gap-3">

              <button
                onClick={closeAddModal}
                disabled={submitting}
                className="h-12 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Batal
              </button>

              <button
                onClick={handleCreateUser}
                disabled={submitting}
                className="h-12 flex-1 rounded-xl bg-[#010736] text-sm font-semibold text-white shadow-lg shadow-[#010736]/10 transition hover:bg-[#07115c] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                {submitting
                  ? "Membuat akun..."
                  : "Create User"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal &&
        selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

            <div className="relative max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl dark:border-slate-700 dark:bg-slate-900">

              <button
                onClick={closeEditModal}
                disabled={submitting}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="pr-10">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#010736] dark:bg-blue-400/10 dark:text-blue-400">
                  <Pencil size={20} />
                </div>

                <h2 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Edit User
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Perbarui informasi akun user.
                </p>

              </div>

              <div className="mt-7 space-y-5">

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Nama
                  </label>

                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Password Baru
                  </label>

                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password:
                          e.target.value,
                      })
                    }
                    placeholder="Kosongkan jika tidak diubah"
                    className={inputClass}
                  />

                </div>

                <div>

                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Division
                  </label>

                  <select
                    value={formData.division}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        division:
                          e.target.value as
                            | "RND"
                            | "SALES",
                      })
                    }
                    className={inputClass}
                  >
                    <option value="RND">
                      RnD
                    </option>

                    <option value="SALES">
                      Sales
                    </option>
                  </select>

                </div>

              </div>

              {errorMessage && (
                <p className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                  {errorMessage}
                </p>
              )}

              <div className="mt-7 flex gap-3">

                <button
                  onClick={closeEditModal}
                  disabled={submitting}
                  className="h-12 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Batal
                </button>

                <button
                  onClick={handleUpdateUser}
                  disabled={submitting}
                  className="h-12 flex-1 rounded-xl bg-[#010736] text-sm font-semibold text-white shadow-lg shadow-[#010736]/10 transition hover:bg-[#07115c] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
                >
                  {submitting
                    ? "Menyimpan..."
                    : "Save Changes"}
                </button>

              </div>

            </div>

          </div>
        )}

      {showDeleteModal &&
        selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

            <div className="relative w-full max-w-[430px] rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl dark:border-slate-700 dark:bg-slate-900">

              <button
                onClick={closeDeleteModal}
                disabled={submitting}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-400/10 dark:text-red-400">
                <Trash2 size={21} />
              </div>

              <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950 dark:text-white">
                Hapus Akses User?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Apakah Anda yakin ingin menghapus akses akun{" "}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedUser.name}
                </span>
                ?
              </p>

              <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-950/20">

                <div className="flex gap-2">

                  <div className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400">
                    <ShieldCheck size={15} />
                  </div>

                  <p className="text-xs leading-5 text-amber-700 dark:text-amber-400">
                    Akun akan dinonaktifkan dan data terkait tetap tersimpan.
                  </p>

                </div>

              </div>

              {errorMessage && (
                <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                  {errorMessage}
                </p>
              )}

              <div className="mt-6 flex gap-3">

                <button
                  onClick={closeDeleteModal}
                  disabled={submitting}
                  className="h-12 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Batal
                </button>

                <button
                  onClick={handleDeleteUser}
                  disabled={submitting}
                  className="h-12 flex-1 rounded-xl bg-red-600 text-sm font-semibold text-white shadow-lg shadow-red-600/10 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Memproses..."
                    : "Nonaktifkan"}
                </button>

              </div>

            </div>

          </div>
        )}

    </main>
  )
}