"use client"

import { useEffect, useMemo, useState } from "react"
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

export default function UserManagement() {
  const router = useRouter()

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [search, setSearch] = useState("")
  const [divisionFilter, setDivisionFilter] = useState("ALL")

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    division: "RND",
  })

  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

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
      console.error("Get current user error:", error)
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
          data.message || "Gagal mengambil data user"
        )
      }

      setUsers(data.users || [])
    } catch (error) {
      console.error("Get users error:", error)
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
      const searchValue = search.toLowerCase()

      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)

      const matchesDivision =
        divisionFilter === "ALL" ||
        user.division === divisionFilter

      return matchesSearch && matchesDivision
    })
  }, [users, search, divisionFilter])

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
            "Content-Type": "application/json",
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
          data.message || "Gagal membuat user"
        )
        return
      }

      setUsers((previousUsers) => [
        data.user,
        ...previousUsers,
      ])

      closeAddModal()
    } catch (error) {
      console.error("Create user error:", error)

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

    if (!formData.name.trim() || !formData.email.trim()) {
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            division: formData.division,
            ...(formData.password
              ? { password: formData.password }
              : {}),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(
          data.message || "Gagal memperbarui user"
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

      closeEditModal()
    } catch (error) {
      console.error("Update user error:", error)

      setErrorMessage(
        "Tidak dapat terhubung ke server"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleStatus = async (user: User) => {
    if (user.role === "ADMIN") {
      return
    }

    const token = getToken()

    if (!token) {
      handleLogout()
      return
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
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
          data.message || "Gagal menghapus user"
        )
        return
      }

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) =>
            user.id !== selectedUser.id
        )
      )

      closeDeleteModal()
    } catch (error) {
      console.error("Delete user error:", error)

      setErrorMessage(
        "Tidak dapat terhubung ke server"
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-sm text-gray-500">
          Loading...
        </p>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen bg-gray-100">

      <aside className="flex w-68 shrink-0 flex-col bg-[#10052D] px-5 py-6 text-white">

        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#10052D]">
            {currentUser
              ? getInitials(currentUser.name)
              : "AA"}
          </div>

          <h2 className="text-xl font-bold">
            Divisi Admin
          </h2>

        </div>

        <p className="mb-3 px-1 text-sm font-semibold text-gray-300">
          Menu
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:bg-[#211344]"
        >
          <LayoutDashboard size={19} />

          <span>
            Dashboard
          </span>
        </Link>

        <Link
          href="/user-management"
          className="mt-2 flex items-center gap-3 rounded-full bg-[#33245A] px-4 py-3 text-sm"
        >
          <Users size={19} />

          <span>
            User Management
          </span>
        </Link>

        <Link
          href="/contact-list"
          className="mt-2 flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:bg-[#211344]"
        >
          <Users size={19} />

          <span>
            Contact List
          </span>
        </Link>

        <Link
          href="/request-sales"
          className="mt-2 flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:bg-[#211344]"
        >
          <FileText size={19} />

          <span>
            Request Sales
          </span>
        </Link>

        <Link
          href="/products"
          className="mt-2 flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:bg-[#211344]"
        >
          <FileText size={19} />

          <span>
            Products
          </span>
        </Link>

        <Link
          href="/principal"
          className="mt-2 flex items-center gap-3 rounded-full px-4 py-3 text-sm transition hover:bg-[#211344]"
        >
          <FileText size={19} />

          <span>
            Vendor/Principal
          </span>
        </Link>

        <div className="mt-6 border-t border-white/10 pt-5" />

        <div className="mt-auto">

          <DropdownMenu>

            <DropdownMenuTrigger className="w-full rounded-xl outline-none">

              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#211344]">

                <Avatar className="h-10 w-10">

                  <AvatarFallback className="bg-white text-[#10052D]">
                    {currentUser
                      ? getInitials(currentUser.name)
                      : "AA"}
                  </AvatarFallback>

                </Avatar>

                <div className="flex-1">

                  <p className="text-sm font-semibold">
                    {currentUser?.name || "Loading..."}
                  </p>

                  <p className="text-xs text-gray-300">
                    {currentUser
                      ? getDivisionName(
                          currentUser.division
                        )
                      : "Loading..."}
                  </p>

                </div>

                <ChevronDown size={18} />

              </div>

            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="top"
              className="mb-2 w-52"
            >

              <DropdownMenuItem
                onClick={() =>
                  router.push("/edit-profile")
                }
              >
                <UserRound className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  router.push("/settings")
                }
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600"
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

            <h1 className="text-3xl font-bold text-black">
              User Management
            </h1>

            <p className="text-sm text-gray-500">
              Kelola akun RnD dan Sales
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={openAddModal}
              className="flex h-10 items-center gap-2 rounded-full bg-[#33245A] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#271b46]"
            >
              <Plus size={17} />
              Add User
            </button>

            <div className="flex h-10 w-64 items-center gap-2 rounded-full bg-gray-100 px-4 shadow-inner">

              <Search
                size={17}
                className="text-gray-600"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Find User.."
                className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-500"
              />

            </div>

          </div>

        </header>

        <div className="p-8">

          <div className="mb-6 flex items-center gap-3">

            <button
              onClick={() =>
                setDivisionFilter("ALL")
              }
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                divisionFilter === "ALL"
                  ? "bg-[#33245A] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Semua
            </button>

            <button
              onClick={() =>
                setDivisionFilter("RND")
              }
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                divisionFilter === "RND"
                  ? "bg-[#33245A] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              RnD
            </button>

            <button
              onClick={() =>
                setDivisionFilter("SALES")
              }
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                divisionFilter === "SALES"
                  ? "bg-[#33245A] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Sales
            </button>

          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="font-bold text-black">
                  Daftar User
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredUsers.length} user ditemukan
                </p>

              </div>

            </div>

            {loadingUsers ? (

              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-gray-500">
                  Mengambil data user...
                </p>
              </div>

            ) : filteredUsers.length === 0 ? (

              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-gray-500">
                  Tidak ada user ditemukan.
                </p>
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-gray-200 text-left">

                      <th className="pb-4 text-sm font-semibold text-gray-600">
                        User
                      </th>

                      <th className="pb-4 text-sm font-semibold text-gray-600">
                        Email
                      </th>

                      <th className="pb-4 text-sm font-semibold text-gray-600">
                        Division
                      </th>

                      <th className="pb-4 text-sm font-semibold text-gray-600">
                        Role
                      </th>

                      <th className="pb-4 text-sm font-semibold text-gray-600">
                        Status
                      </th>

                      <th className="pb-4 text-right text-sm font-semibold text-gray-600">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredUsers.map((user) => (

                      <tr
                        key={user.id}
                        className="border-b border-gray-100 last:border-0"
                      >

                        <td className="py-4">

                          <div className="flex items-center gap-3">

                            <Avatar className="h-10 w-10">

                              <AvatarFallback className="bg-[#33245A] text-white">
                                {getInitials(user.name)}
                              </AvatarFallback>

                            </Avatar>

                            <div>

                              <p className="text-sm font-semibold text-gray-800">
                                {user.name}
                              </p>

                              {user.id === currentUser?.id && (
                                <p className="text-xs text-[#33245A]">
                                  Akun Anda
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        <td className="py-4 text-sm text-gray-600">
                          {user.email}
                        </td>

                        <td className="py-4">

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {getDivisionName(user.division)}
                          </span>

                        </td>

                        <td className="py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              user.role === "ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.role}
                          </span>

                        </td>

                        <td className="py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.isActive
                              ? "Aktif"
                              : "Nonaktif"}
                          </span>

                        </td>

                        <td className="py-4">

                          <div className="flex justify-end gap-2">

                            {user.role !== "ADMIN" && (
                              <>
                                <button
                                  onClick={() =>
                                    openEditModal(user)
                                  }
                                  title="Edit user"
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                                >
                                  <Pencil size={15} />
                                </button>

                                <button
                                  onClick={() =>
                                    handleToggleStatus(user)
                                  }
                                  title={
                                    user.isActive
                                      ? "Nonaktifkan"
                                      : "Aktifkan"
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                                >
                                  {user.isActive ? (
                                    <UserX size={15} />
                                  ) : (
                                    <Check size={15} />
                                  )}
                                </button>

                                <button
                                  onClick={() =>
                                    openDeleteModal(user)
                                  }
                                  title="Hapus user"
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-100"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}

                            {user.role === "ADMIN" && (
                              <span className="px-2 text-xs text-gray-400">
                                Protected
                              </span>
                            )}

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </section>

      {showAddModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">

          <div className="relative w-[500px] rounded-[32px] bg-white p-7 shadow-2xl">

            <button
              onClick={closeAddModal}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <X size={18} />
            </button>

            <h2 className="text-center text-2xl font-bold text-black">
              Add New User
            </h2>

            <p className="mt-1 text-center text-sm text-gray-500">
              Buat akun untuk RnD atau Sales
            </p>

            <div className="mt-6 space-y-4">

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[#33245A]/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[#33245A]/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[#33245A]/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[#33245A]/30"
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
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              onClick={handleCreateUser}
              disabled={submitting}
              className="mt-6 h-12 w-full rounded-2xl bg-[#33245A] text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Membuat akun..."
                : "Create User"}
            </button>

          </div>

        </div>

      )}

      {showEditModal && selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">

          <div className="relative w-[500px] rounded-[32px] bg-white p-7 shadow-2xl">

            <button
              onClick={closeEditModal}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <X size={18} />
            </button>

            <h2 className="text-center text-2xl font-bold text-black">
              Edit User
            </h2>

            <p className="mt-1 text-center text-sm text-gray-500">
              Perbarui informasi akun
            </p>

            <div className="mt-6 space-y-4">

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[#33245A]/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[#33245A]/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password Baru
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
                  placeholder="Kosongkan jika tidak diubah"
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[#33245A]/30"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                  className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm text-black outline-none focus:ring-2 focus:ring-[#33245A]/30"
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
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <button
              onClick={handleUpdateUser}
              disabled={submitting}
              className="mt-6 h-12 w-full rounded-2xl bg-[#33245A] text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Menyimpan..."
                : "Save Changes"}
            </button>

          </div>

        </div>

      )}

      {showDeleteModal && selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">

          <div className="relative w-[420px] rounded-[32px] bg-white p-7 shadow-2xl">

            <button
              onClick={closeDeleteModal}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <X size={18} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-black">
              Hapus User?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Apakah anda yakin mau menghapus akun{" "}
              <span className="font-semibold text-gray-800">
                {selectedUser.name}
              </span>
              ? Data akun ini akan dihapus.
            </p>

            {errorMessage && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            <div className="mt-6 flex gap-3">

              <button
                onClick={closeDeleteModal}
                disabled={submitting}
                className="h-12 flex-1 rounded-2xl bg-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                onClick={handleDeleteUser}
                disabled={submitting}
                className="h-12 flex-1 rounded-2xl bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {submitting
                  ? "Menghapus..."
                  : "Hapus"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}