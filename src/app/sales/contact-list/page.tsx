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
  Trash2,
  Plus,
  ChevronDown,
  X,
  Save,
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

type Contact = {
  id: number
  name: string
  company: string
  phone: string
  email: string
  product: string
}

export default function SalesContactList() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)

  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [product, setProduct] = useState("")

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: "Akbar arohimat",
      company: "PT.PTan",
      phone: "08888888",
      email: "akbar@gmail.com",
      product: "Router",
    },
    {
      id: 2,
      name: "Akbar arohimat2",
      company: "PT.ABC",
      phone: "08123456789",
      email: "budi@gmail.com",
      product: "Switch",
    },
    {
      id: 3,
      name: "Akbar arohimat3",
      company: "PT.Network",
      phone: "082233445566",
      email: "citra@gmail.com",
      product: "Access Point",
    },
  ])

  const filteredContacts = contacts.filter((contact) =>
    `${contact.name} ${contact.company} ${contact.phone} ${contact.email} ${contact.product}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault()

    const newContact: Contact = {
      id: Date.now(),
      name,
      company,
      phone,
      email,
      product,
    }

    setContacts((prev) => [...prev, newContact])

    setName("")
    setCompany("")
    setPhone("")
    setEmail("")
    setProduct("")

    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    setContacts((prev) =>
      prev.filter((contact) => contact.id !== id)
    )
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
          className="mt-3 flex items-center gap-3 rounded-full bg-[#F5C400] px-4 py-2.5 text-sm font-semibold text-black"
        >
          <Users size={18} />
          Contact List
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
                Contact List
              </h2>

            </div>

            <p className="text-sm text-gray-500">
              Kelola data customer dan contact
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
                Contact List
              </h2>

              <p className="text-sm text-gray-500">
                Daftar customer yang ditangani Sales
              </p>

            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex h-11 items-center gap-2 rounded-2xl bg-[#F5C400] px-5 text-sm font-semibold text-black shadow-md transition hover:bg-[#E5B800]"
            >
              <Plus size={18} />
              Add Contact
            </button>

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
                placeholder="Find nama, perusahaan, email..."
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
              />

            </div>

            <button
              disabled
              className="flex h-11 w-14 cursor-not-allowed items-center justify-center rounded-2xl bg-red-100 text-red-400"
            >
              <Trash2 size={20} />
            </button>

          </div>

          <div className="min-h-[520px] rounded-2xl bg-white p-5 shadow-md">

            <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1.4fr_1fr_0.5fr] border-b border-gray-300 pb-3 text-sm font-bold text-black">

              <div>
                Nama
              </div>

              <div>
                Perusahaan
              </div>

              <div>
                No. Telepon
              </div>

              <div>
                Email
              </div>

              <div>
                Produk
              </div>

              <div>
                
              </div>

            </div>

            {filteredContacts.map((contact) => (

              <div
                key={contact.id}
                className="grid grid-cols-[1.2fr_1.2fr_1fr_1.4fr_1fr_0.5fr] items-center border-b border-gray-200 py-5 text-sm"
              >

                <div className="font-medium text-gray-900">
                  {contact.name}
                </div>

                <div className="text-gray-700">
                  {contact.company}
                </div>

                <div className="text-gray-700">
                  {contact.phone}
                </div>

                <div className="text-gray-700">
                  {contact.email}
                </div>

                <div className="text-gray-700">
                  {contact.product}
                </div>

                <div>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            ))}

            {filteredContacts.length === 0 && (

              <div className="flex h-60 items-center justify-center text-sm text-gray-400">
                Contact tidak ditemukan
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
                  Add Contact
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tambahkan customer baru ke Contact List
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
              onSubmit={handleAddContact}
              className="space-y-4"
            >

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Nama
                </label>

                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama customer"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Perusahaan
                </label>

                <input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Nama perusahaan"
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                />

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    No. Telepon
                  </label>

                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxx"
                    className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@gmail.com"
                    className="h-11 w-full rounded-xl border border-gray-300 px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Produk
                </label>

                <select
                  required
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-black outline-none focus:border-[#F5C400] focus:ring-2 focus:ring-yellow-100"
                >

                  <option value="">
                    Pilih Produk
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

              <div className="flex justify-end gap-3 pt-3">

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
                  <Save size={17} />
                  Save Contact
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
  )
}