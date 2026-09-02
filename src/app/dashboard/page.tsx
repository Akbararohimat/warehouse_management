"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Search,
  Plus,
  List,
  UserRound,
  Settings,
  LogOut,
  ChevronDown,
  X,
  ImagePlus,
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
}

export default function Dashboard() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)

  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  const [step, setStep] = useState(1)

  const [contactName, setContactName] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  const [product, setProduct] = useState("")
  const [description, setDescription] = useState("")
  const [productImage, setProductImage] = useState<File | null>(null)

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken")

    if (!token) {
      router.replace("/")
      return
    }

    async function fetchUser() {
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
          localStorage.removeItem("authToken")
          localStorage.removeItem("user")

          sessionStorage.removeItem("authToken")
          sessionStorage.removeItem("user")

          router.replace("/")
          return
        }

        setUser(data.user)
      } catch (error) {
        console.error("Get user error:", error)
      }
    }

    fetchUser()
  }, [router])

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

  const getDepartmentName = () => {
    if (!user) {
      return "Loading..."
    }

    if (user.role === "ADMIN" || user.division === "ADMIN") {
      return "Divisi Admin"
    }

    if (user.division === "RND") {
      return "Divisi RnD"
    }

    if (user.division === "SALES") {
      return "Divisi Sales"
    }

    return user.division
  }

  const openNewContact = () => {
    setShowAddMenu(false)

    setStep(1)

    setContactName("")
    setCompany("")
    setPhone("")
    setEmail("")

    setProduct("")
    setDescription("")
    setProductImage(null)

    setShowContactModal(true)
  }

  const closeModal = () => {
    setShowContactModal(false)

    setStep(1)

    setContactName("")
    setCompany("")
    setPhone("")
    setEmail("")

    setProduct("")
    setDescription("")
    setProductImage(null)
  }

  const nextStep = () => {
    if (
      !contactName.trim() ||
      !company.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      alert("Mohon lengkapi semua informasi kontak.")
      return
    }

    setStep(2)
  }

  const previousStep = () => {
    setStep(1)
  }

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (file) {
      setProductImage(file)
    }
  }

  const handleConfirm = () => {
    if (!product.trim()) {
      alert("Nama product wajib diisi.")
      return
    }

    console.log({
      contactName,
      company,
      phone,
      email,
      product,
      description,
      productImage,
    })

    closeModal()
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")

    sessionStorage.removeItem("authToken")
    sessionStorage.removeItem("user")

    router.replace("/")
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      <aside className="flex w-68 shrink-0 flex-col bg-[#10052D] px-5 py-6 text-white">

        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#10052D]">
            {user ? getInitials(user.name) : "AA"}
          </div>

          <h2 className="text-xl font-bold">
            {getDepartmentName()}
          </h2>

        </div>

        <p className="mb-3 px-1 text-sm font-semibold text-gray-300">
          Menu
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-full bg-[#33245A] px-4 py-3 text-sm"
        >
          <LayoutDashboard size={19} />

          <span>
            Dashboard
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
                    {user
                      ? getInitials(user.name)
                      : "AA"}
                  </AvatarFallback>

                </Avatar>

                <div className="flex-1">

                  <p className="text-sm font-semibold">
                    {user?.name || "Loading..."}
                  </p>

                  <p className="text-xs text-gray-300">
                    {user
                      ? getDivisionName(user.division)
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
              {user?.role === "ADMIN" && (
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/user-management")
                  }
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </DropdownMenuItem>
              )}

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
              Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Welcome to RnD Web Portal
            </p>

          </div>

          <div className="flex items-center gap-3">
            <div className="relative">

              <button
                onClick={() =>
                  setShowAddMenu(!showAddMenu)
                }
                className="flex h-10 w-16 items-center justify-center rounded-full bg-gray-100 text-black shadow-sm transition hover:bg-gray-200"
              >

                <Plus size={18} />

                <span className="mx-2 text-gray-400">
                  |
                </span>

                <ChevronDown
                  size={15}
                  className={
                    showAddMenu
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />

              </button>

              {showAddMenu && (

                <div className="absolute right-0 top-12 z-40 w-44 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5">

                  <button
                    onClick={openNewContact}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-800 transition hover:bg-gray-100"
                  >

                    <UserRound size={17} />

                    New Contact

                  </button>

                  <button
                    onClick={() => {
                      setShowAddMenu(false)
                      router.push("/products")
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-800 transition hover:bg-gray-100"
                  >

                    <List size={17} />

                    New Products

                  </button>

                </div>

              )}

            </div>
            <div className="flex h-10 w-64 items-center gap-2 rounded-full bg-gray-100 px-4 shadow-inner">

              <Search
                size={17}
                className="text-gray-600"
              />

              <input
                type="text"
                placeholder="Find Something.."
                className="w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-500"
              />

            </div>

          </div>

        </header>
        <div className="p-8">
          <div className="flex gap-5">

            <div className="h-28 w-64 rounded-2xl bg-white p-6 shadow-md">

              <p className="text-3xl font-bold text-black">
                0
              </p>

              <p className="mt-1 text-sm text-gray-700">
                Perusahaan terhubung
              </p>

            </div>

            <div className="h-28 w-64 rounded-2xl bg-white p-6 shadow-md">

              <p className="text-3xl font-bold text-black">
                0
              </p>

              <p className="mt-1 text-sm text-gray-700">
                Request Sales
              </p>

            </div>

            <div className="h-28 w-64 rounded-2xl bg-white p-6 shadow-md">

              <p className="text-3xl font-bold text-black">
                0
              </p>

              <p className="mt-1 text-sm text-gray-700">
                Request Done
              </p>

            </div>

            <div className="h-28 w-64 rounded-2xl bg-white p-6 shadow-md">

              <p className="text-3xl font-bold text-black">
                0
              </p>

              <p className="mt-1 text-sm text-gray-700">
                Request Pending
              </p>

            </div>

          </div>

          <div className="mt-6 h-64 max-w-[600px] rounded-2xl bg-white p-6 shadow-md">

            <div className="flex items-center justify-between">

              <h2 className="font-bold text-black">
                Kontak Terbaru
              </h2>

              <button
                onClick={() =>
                  router.push("/contact-list")
                }
                className="text-sm text-gray-600"
              >
                Lihat Semua →
              </button>

            </div>

            <div className="mt-4 flex items-center justify-between border-b border-gray-300 pb-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-[#33245A]">
                  AR
                </div>

                <div>

                  <p className="text-sm font-semibold text-gray-800">
                    Akbar arohimat
                  </p>

                  <p className="text-sm text-gray-500">
                    PT.PTan
                  </p>

                </div>

              </div>

              <p className="text-xs text-gray-500">
                2 jam yang lalu
              </p>

            </div>

          </div>

        </div>

      </section>

      {showContactModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">

          <div className="relative w-[520px] rounded-[32px] bg-white p-7 shadow-2xl">

            <button
              onClick={closeModal}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
            >
              <X size={18} />
            </button>

            {step === 1 && (

              <div>

                <h2 className="text-center text-2xl font-bold text-black">
                  Add New Contact
                </h2>

                <p className="mt-1 text-center text-sm text-gray-500">
                  Masukkan informasi kontak
                </p>

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Nama
                  </label>

                  <input
                    value={contactName}
                    onChange={(e) =>
                      setContactName(e.target.value)
                    }
                    placeholder="Masukkan nama"
                    className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm outline-none focus:ring-2 focus:ring-[#33245A]/30"
                  />

                </div>

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Perusahaan
                  </label>

                  <input
                    value={company}
                    onChange={(e) =>
                      setCompany(e.target.value)
                    }
                    placeholder="Masukkan perusahaan"
                    className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm outline-none focus:ring-2 focus:ring-[#33245A]/30"
                  />

                </div>

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    No. Telepon
                  </label>

                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Masukkan nomor telepon"
                    className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm outline-none focus:ring-2 focus:ring-[#33245A]/30"
                  />

                </div>

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Masukkan email"
                    className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm outline-none focus:ring-2 focus:ring-[#33245A]/30"
                  />

                </div>

                <button
                  onClick={nextStep}
                  className="mt-6 h-12 w-full rounded-2xl bg-[#33245A] text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46]"
                >
                  Next
                </button>

                <div className="mt-4 flex justify-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-[#33245A]" />

                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />

                </div>

              </div>

            )}

            {step === 2 && (

              <div>

                <h2 className="text-center text-2xl font-bold text-black">
                  Add Product
                </h2>

                <p className="mt-1 text-center text-sm text-gray-500">
                  Masukkan informasi produk
                </p>

                <div className="mt-6">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Product
                  </label>

                  <input
                    value={product}
                    onChange={(e) =>
                      setProduct(e.target.value)
                    }
                    placeholder="Masukkan nama product"
                    className="h-12 w-full rounded-2xl bg-gray-100 px-4 text-sm outline-none focus:ring-2 focus:ring-[#33245A]/30"
                  />

                </div>

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Foto Product
                  </label>

                  <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-2xl bg-gray-100 text-gray-500 transition hover:bg-gray-200">

                    <ImagePlus size={30} />

                    <span className="mt-2 text-sm">
                      {productImage
                        ? productImage.name
                        : "Upload foto product"}
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                </div>

                <div className="mt-4">

                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    placeholder="Description..."
                    className="h-24 w-full resize-none rounded-2xl bg-gray-100 p-4 text-sm outline-none focus:ring-2 focus:ring-[#33245A]/30"
                  />

                </div>

                <div className="mt-5 flex gap-3">

                  <button
                    onClick={previousStep}
                    className="h-12 flex-1 rounded-2xl bg-gray-200 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleConfirm}
                    className="h-12 flex-1 rounded-2xl bg-[#33245A] text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46]"
                  >
                    Confirm
                  </button>

                </div>

                <div className="mt-4 flex justify-center gap-2">

                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />

                  <span className="h-2.5 w-2.5 rounded-full bg-[#33245A]" />

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </main>
  )
}