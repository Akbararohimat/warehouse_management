"use client"

import { useState } from "react"
import Link from "next/link"

import { Calendar } from "@/components/ui/calendar"

import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  UserRound,
  LogOut,
  Search,
  Trash2,
  Plus,
  ChevronDown,
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

type Contact = {
  id: number
  nama: string
  perusahaan: string
  telepon: string
  email: string
  produk: string
}

export default function ContactList() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [search, setSearch] = useState("")

  const [showForm, setShowForm] = useState(false)

  const [selectedContact, setSelectedContact] = useState<number | null>(null)

  const [nama, setNama] = useState("")
  const [perusahaan, setPerusahaan] = useState("")
  const [telepon, setTelepon] = useState("")
  const [email, setEmail] = useState("")
  const [produk, setProduk] = useState("")

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      nama: "Akbar arohimat",
      perusahaan: "PT.PTan",
      telepon: "08888888",
      email: "akbar@gmail.com",
      produk: "Pulpen listrik",
    },
  ])

  const filteredContacts = contacts.filter((contact) => {
    const keyword = search.toLowerCase()

    return (
      contact.nama.toLowerCase().includes(keyword) ||
      contact.perusahaan.toLowerCase().includes(keyword) ||
      contact.email.toLowerCase().includes(keyword)
    )
  })

  const handleAddContact = () => {
    if (
      !nama ||
      !perusahaan ||
      !telepon ||
      !email ||
      !produk
    ) {
      return
    }

    const newContact: Contact = {
      id: Date.now(),
      nama,
      perusahaan,
      telepon,
      email,
      produk,
    }

    setContacts((prev) => [...prev, newContact])

    setNama("")
    setPerusahaan("")
    setTelepon("")
    setEmail("")
    setProduk("")

    setShowForm(false)
  }

  const handleDeleteContact = () => {
    if (selectedContact === null) {
      return
    }

    setContacts((prev) =>
      prev.filter((contact) => contact.id !== selectedContact)
    )

    setSelectedContact(null)
  }

  return (
    <main className="flex min-h-screen bg-gray-100">


      <aside className="flex w-68 flex-col bg-[#10052D] px-5 py-6 text-white">


        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#10052D]">
            RnD
          </div>

          <h2 className="text-xl font-bold">
            Divisi RnD
          </h2>

        </div>

        <p className="mb-3 text-sm font-semibold uppercase text-gray-300">
          Menu
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-full px-4 py-2.5 text-sm hover:bg-[#211344]"
        >
          <LayoutDashboard size={18} />

          Dashboard
        </Link>

        <Link
          href="/contact-list"
          className="mt-3 flex items-center gap-3 rounded-full bg-[#33245A] px-4 py-2.5 text-sm"
        >
          <Users size={18} />

          Contact List
        </Link>

        <Link
          href="/request-sales"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm hover:bg-[#211344]"
        >
          <FileText size={18} />

          Request Sales
        </Link>

        <div className="mt-7 border-t border-white/10 pt-6">

          <div className="rounded-2xl border border-white/10 bg-[#120832] p-2">

            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={new Date()}
              className="w-full bg-transparent text-white"
              classNames={{

                caption_label:
                  "text-sm font-medium text-white",

                button_previous:
                  "text-white hover:bg-white/10 hover:text-white",

                button_next:
                  "text-white hover:bg-white/10 hover:text-white",

                weekday:
                  "text-white/50",

                day:
                  "text-white hover:bg-white/10 hover:text-white",

                today:
                  "bg-white/10 text-white",

                outside:
                  "text-white/30",

                disabled:
                  "text-white/30 opacity-50",

              }}
            />

          </div>

        </div>

        <div className="mt-auto">

          <DropdownMenu>

            <DropdownMenuTrigger className="w-full rounded-xl outline-none">

              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#211344]">

                <Avatar className="h-10 w-10">

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


                <ChevronDown size={18} />

              </div>

            </DropdownMenuTrigger>


            <DropdownMenuContent
              align="end"
              side="top"
              className="mb-2 w-52"
            >

              <DropdownMenuItem>

                <UserRound className="mr-2 h-4 w-4" />

                Edit Profile

              </DropdownMenuItem>


              <DropdownMenuItem>

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
              Welcome to RnD Web Portal
            </p>

          </div>

          <div className="flex items-center gap-3">

            <button className="flex h-9 w-16 items-center justify-center rounded-full bg-gray-100 text-black shadow-sm">

              <Plus size={18} />

              <span className="mx-2 text-gray-400">
                |
              </span>

              <ChevronDown size={15} />

            </button>


            <div className="flex h-10 w-64 items-center gap-2 rounded-full bg-gray-100 px-4 shadow-inner">

              <Search
                size={17}
                className="text-gray-600"
              />

              <span className="text-sm text-gray-500">
                Find Something...
              </span>

            </div>

          </div>

        </header>

        <div className="p-8">

          <div className="mb-4 flex items-center justify-between">

            <div className="flex h-11 w-72 items-center gap-2 rounded-full bg-white px-4 shadow-md">

              <Search
                size={18}
                className="text-gray-700"
              />

              <input
                type="text"
                placeholder="Find nama,perusahaan,atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
              />

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={handleDeleteContact}
                disabled={selectedContact === null}
                className="flex h-11 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >

                <Trash2 size={21} />

              </button>

              <button
                onClick={() => setShowForm(true)}
                className="flex h-11 items-center gap-2 rounded-2xl bg-[#33245A] px-5 text-sm font-semibold text-white shadow-md hover:bg-[#271b46]"
              >

                <Plus size={18} />

                Add Contact

              </button>

            </div>

          </div>

          <div className="min-h-[520px] rounded-2xl bg-white p-5 shadow-md">


            <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1.3fr_1fr] border-b border-gray-400 pb-3 text-sm font-bold text-black">

              <div>
                Nama
              </div>

              <div>
                Perusahaan
              </div>

              <div>
                NO.TELFON
              </div>

              <div>
                EMAIL
              </div>

              <div>
                Produk
              </div>

            </div>

            {filteredContacts.map((contact) => (

              <button
                key={contact.id}
                onClick={() =>
                  setSelectedContact(
                    selectedContact === contact.id
                      ? null
                      : contact.id
                  )
                }
                className={`grid w-full grid-cols-[1.2fr_1.2fr_1fr_1.3fr_1fr] border-b border-gray-300 py-4 text-left text-sm transition ${
                  selectedContact === contact.id
                    ? "bg-[#f1edfa]"
                    : "hover:bg-gray-50"
                }`}
              >

                <div className="font-medium text-gray-900">
                  {contact.nama}
                </div>

                <div>
                  {contact.perusahaan}
                </div>

                <div>
                  {contact.telepon}
                </div>

                <div>
                  {contact.email}
                </div>

                <div>
                  {contact.produk}
                </div>

              </button>

            ))}

            {filteredContacts.length === 0 && (

              <div className="flex h-40 items-center justify-center">

                <p className="text-sm text-gray-400">
                  Contact tidak ditemukan.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-[430px] rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-black">
                  Add Contact
                </h2>

                <p className="text-sm text-gray-500">
                  Tambahkan contact baru
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
                  Perusahaan
                </label>

                <input
                  value={perusahaan}
                  onChange={(e) =>
                    setPerusahaan(e.target.value)
                  }
                  placeholder="Nama perusahaan"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#33245A]"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  No. Telepon
                </label>

                <input
                  value={telepon}
                  onChange={(e) =>
                    setTelepon(e.target.value)
                  }
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#33245A]"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="email@gmail.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#33245A]"
                />

              </div>


              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Produk
                </label>

                <input
                  value={produk}
                  onChange={(e) =>
                    setProduk(e.target.value)
                  }
                  placeholder="Nama produk"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-[#33245A]"
                />

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
                onClick={handleAddContact}
                className="rounded-xl bg-[#33245A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#271b46]"
              >
                Simpan Contact
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}