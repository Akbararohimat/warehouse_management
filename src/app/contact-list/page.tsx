"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
  Building2,
  Phone,
  Mail,
  Package,
  Image as ImageIcon,
  ArrowLeft,
  ChevronRight,
  Filter,
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

type Product = {
  id: number
  nama: string
  brand: string
  model: string
  deskripsi: string
  images: string[]
}

type Contact = {
  id: number
  nama: string
  perusahaan: string
  telepon: string
  email: string
  productIds: number[]
}

const initialProducts: Product[] = [
  {
    id: 1,
    nama: "Huawei Router AX3",
    brand: "Huawei",
    model: "WS7200",
    deskripsi:
      "Router WiFi 6 dual-band untuk kebutuhan jaringan customer.",
    images: [
      "https://placehold.co/900x600?text=Huawei+Depan",
      "https://placehold.co/900x600?text=Huawei+Samping",
      "https://placehold.co/900x600?text=Huawei+Belakang",
      "https://placehold.co/900x600?text=Huawei+Atas",
      "https://placehold.co/900x600?text=Huawei+Lainnya",
    ],
  },
  {
    id: 2,
    nama: "Huawei Switch S5735",
    brand: "Huawei",
    model: "S5735-L24T4S",
    deskripsi:
      "Managed switch untuk kebutuhan jaringan perusahaan.",
    images: [
      "https://placehold.co/900x600?text=Switch+Depan",
      "https://placehold.co/900x600?text=Switch+Samping",
      "https://placehold.co/900x600?text=Switch+Belakang",
      "https://placehold.co/900x600?text=Switch+Atas",
      "https://placehold.co/900x600?text=Switch+Lainnya",
    ],
  },
  {
    id: 3,
    nama: "Cisco Catalyst 9200",
    brand: "Cisco",
    model: "C9200L",
    deskripsi:
      "Enterprise switch untuk kebutuhan jaringan kantor.",
    images: [
      "https://placehold.co/900x600?text=Cisco+Depan",
      "https://placehold.co/900x600?text=Cisco+Samping",
      "https://placehold.co/900x600?text=Cisco+Belakang",
      "https://placehold.co/900x600?text=Cisco+Atas",
      "https://placehold.co/900x600?text=Cisco+Lainnya",
    ],
  },
  {
    id: 4,
    nama: "MikroTik RB4011",
    brand: "MikroTik",
    model: "RB4011iGS+",
    deskripsi:
      "Router enterprise dengan dukungan routing dan switching.",
    images: [
      "https://placehold.co/900x600?text=MikroTik+Depan",
      "https://placehold.co/900x600?text=MikroTik+Samping",
      "https://placehold.co/900x600?text=MikroTik+Belakang",
      "https://placehold.co/900x600?text=MikroTik+Atas",
      "https://placehold.co/900x600?text=MikroTik+Lainnya",
    ],
  },
]

const initialContacts: Contact[] = [
  {
    id: 1,
    nama: "Akbar arohimat",
    perusahaan: "PT.PTan",
    telepon: "08888888",
    email: "akbar@gmail.com",
    productIds: [1, 2],
  },
  {
    id: 2,
    nama: "Akbar Versi 2",
    perusahaan: "PT. ABC",
    telepon: "08123456789",
    email: "akbar2@gmail.com",
    productIds: [3],
  },
  {
    id: 3,
    nama: "Akbar Versi 3",
    perusahaan: "PT. Jaya",
    telepon: "08234567890",
    email: "akbar3@gmail.com",
    productIds: [1, 4],
  },
]

export default function ContactList() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("Semua Product")

  const [showForm, setShowForm] = useState(false)
  const [showContactDetail, setShowContactDetail] = useState(false)
  const [showProductDetail, setShowProductDetail] = useState(false)

  const [selectedContact, setSelectedContact] =
    useState<Contact | null>(null)

  const [selectedProductDetail, setSelectedProductDetail] =
    useState<Product | null>(null)

  const [contacts, setContacts] =
    useState<Contact[]>(initialContacts)

  const [products] =
    useState<Product[]>(initialProducts)

  // FORM CONTACT
  const [nama, setNama] = useState("")
  const [perusahaan, setPerusahaan] = useState("")
  const [telepon, setTelepon] = useState("")
  const [email, setEmail] = useState("")
  const [selectedProductIds, setSelectedProductIds] =
    useState<number[]>([])

  const filteredContacts = contacts.filter((contact) => {
    const keyword = search.toLowerCase()

    const matchesSearch =
      contact.nama.toLowerCase().includes(keyword) ||
      contact.perusahaan.toLowerCase().includes(keyword) ||
      contact.email.toLowerCase().includes(keyword)

    const matchesProduct =
      selectedProduct === "Semua Product" ||
      contact.productIds.some((productId) => {
        const product = products.find(
          (item) => item.id === productId
        )

        return product?.nama === selectedProduct
      })

    return matchesSearch && matchesProduct
  })

  const handleAddContact = () => {
    if (
      !nama ||
      !perusahaan ||
      !telepon ||
      !email
    ) {
      return
    }

    const newContact: Contact = {
      id: Date.now(),
      nama,
      perusahaan,
      telepon,
      email,
      productIds: selectedProductIds,
    }

    setContacts((prev) => [...prev, newContact])

    setNama("")
    setPerusahaan("")
    setTelepon("")
    setEmail("")
    setSelectedProductIds([])

    setShowForm(false)
  }

  const handleDeleteContact = () => {
    if (!selectedContact) {
      return
    }

    setContacts((prev) =>
      prev.filter(
        (contact) => contact.id !== selectedContact.id
      )
    )

    setSelectedContact(null)
    setShowContactDetail(false)
  }

  const openContactDetail = (contact: Contact) => {
    setSelectedContact(contact)
    setShowContactDetail(true)
  }

  const openProductDetail = (product: Product) => {
    setSelectedProductDetail(product)
    setShowProductDetail(true)
  }

  const toggleProductSelection = (productId: number) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <main className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="flex w-68 flex-col bg-[#10052D] px-5 py-6 text-white">

        {/* LOGO */}
        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-[#10052D]">
            RnD
          </div>

          <h2 className="text-xl font-bold">
            Divisi RnD
          </h2>

        </div>

        {/* MENU */}
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

        <Link
           href="/products"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm hover:bg-[#211344]"
        >
          <FileText size={18} />
          Products
        </Link>

        {/* PROFILE */}
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
                onClick={() => router.push("/")}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </aside>

      {/* MAIN */}
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

        {/* CONTENT */}
        <div className="p-8">

          {/* TOP ACTION */}
          <div className="mb-4 flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-72 items-center gap-2 rounded-full bg-white px-4 shadow-md">

                <Search
                  size={18}
                  className="text-gray-700"
                />

                <input
                  type="text"
                  placeholder="Find nama, perusahaan, atau email..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
                />

              </div>
              <div className="relative">

                <select
                  value={selectedProduct}
                  onChange={(e) =>
                    setSelectedProduct(e.target.value)
                  }
                  className="h-11 appearance-none rounded-full border-none bg-white pl-11 pr-10 text-sm font-medium text-gray-700 shadow-md outline-none"
                >

                  <option>
                    Semua Product
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.nama}
                    >
                      {product.nama}
                    </option>
                  ))}

                </select>

                <Filter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

              </div>

            </div>
            <div className="flex items-center gap-3">

              <button
                onClick={handleDeleteContact}
                disabled={!selectedContact}
                className="flex h-11 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Trash2 size={21} />
              </button>

              <button
                onClick={() => setShowForm(true)}
                className="flex h-11 items-center gap-2 rounded-2xl bg-[#33245A] px-5 text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46]"
              >
                <Plus size={18} />
                Add Contact
              </button>

            </div>

          </div>
          <div className="min-h-[520px] rounded-2xl bg-white p-5 shadow-md">

            <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1.3fr] border-b border-gray-400 pb-3 text-sm font-bold text-black">

              <div>
                Nama
              </div>

              <div>
                Perusahaan
              </div>

              <div>
                No.Telfon
              </div>

              <div>
                Email
              </div>

            </div>
            {filteredContacts.map((contact) => (

              <button
                key={contact.id}
                onClick={() =>
                  openContactDetail(contact)
                }
                className="grid w-full grid-cols-[1.2fr_1.2fr_1fr_1.3fr] border-b border-gray-300 py-4 text-left text-sm transition hover:bg-[#f8f6fc]"
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

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl">

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

              {/* NAMA */}
              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nama
                </label>

                <input
                  value={nama}
                  onChange={(e) =>
                    setNama(e.target.value)
                  }
                  placeholder="Nama contact"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-[#33245A]"
                />

              </div>

              {/* PERUSAHAAN */}
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-[#33245A]"
                />

              </div>

              {/* TELEPON */}
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-[#33245A]"
                />

              </div>

              {/* EMAIL */}
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-[#33245A]"
                />

              </div>

              {/* PRODUCT */}
              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product
                </label>

                <div className="grid max-h-36 grid-cols-2 gap-2 overflow-y-auto">

                  {products.map((product) => {

                    const selected =
                      selectedProductIds.includes(
                        product.id
                      )

                    return (

                      <button
                        type="button"
                        key={product.id}
                        onClick={() =>
                          toggleProductSelection(
                            product.id
                          )
                        }
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                          selected
                            ? "border-[#33245A] bg-[#f1edfa] text-[#33245A]"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >

                        <p className="font-semibold">
                          {product.nama}
                        </p>

                        <p className="text-xs text-gray-500">
                          {product.brand}
                        </p>

                      </button>

                    )
                  })}

                </div>

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

      {/* ========================= */}
      {/* CONTACT DETAIL DRAWER */}
      {/* ========================= */}

      {showContactDetail && selectedContact && (

        <div className="fixed inset-0 z-40">

          {/* BACKDROP */}
          <button
            aria-label="Close detail"
            onClick={() =>
              setShowContactDetail(false)
            }
            className="absolute inset-0 bg-black/30"
          />

          {/* DRAWER */}
          <aside className="absolute right-0 top-0 flex h-full w-[430px] flex-col bg-white shadow-2xl">

            {/* DRAWER HEADER */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Contact Detail
                </p>

                <h2 className="mt-1 text-xl font-bold text-black">
                  {selectedContact.nama}
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowContactDetail(false)
                }
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* DRAWER CONTENT */}
            <div className="flex-1 overflow-y-auto p-6">

              {/* PROFILE */}
              <div className="mb-6 flex items-center gap-4">

                <Avatar className="h-16 w-16">

                  <AvatarFallback className="bg-[#33245A] text-lg font-bold text-white">
                    {selectedContact.nama
                      .split(" ")
                      .map((item) => item[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>

                </Avatar>

                <div>

                  <h3 className="font-bold text-black">
                    {selectedContact.nama}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {selectedContact.perusahaan}
                  </p>

                </div>

              </div>

              {/* CONTACT INFO */}
              <div className="space-y-3">

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">

                  <Building2
                    size={18}
                    className="text-[#33245A]"
                  />

                  <div>

                    <p className="text-xs text-gray-400">
                      Perusahaan
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {selectedContact.perusahaan}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">

                  <Phone
                    size={18}
                    className="text-[#33245A]"
                  />

                  <div>

                    <p className="text-xs text-gray-400">
                      No. Telepon
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {selectedContact.telepon}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">

                  <Mail
                    size={18}
                    className="text-[#33245A]"
                  />

                  <div>

                    <p className="text-xs text-gray-400">
                      Email
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {selectedContact.email}
                    </p>

                  </div>

                </div>

              </div>

              {/* PRODUCT */}
              <div className="mt-7">

                <div className="mb-3 flex items-center justify-between">

                  <div>

                    <h3 className="font-bold text-black">
                      Product
                    </h3>

                    <p className="text-xs text-gray-500">
                      Product yang digunakan contact
                    </p>

                  </div>

                  <Package
                    size={19}
                    className="text-[#33245A]"
                  />

                </div>

                <div className="space-y-3">

                  {selectedContact.productIds.length === 0 && (

                    <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center">

                      <p className="text-sm text-gray-400">
                        Belum ada product.
                      </p>

                    </div>

                  )}

                  {selectedContact.productIds.map(
                    (productId) => {

                      const product =
                        products.find(
                          (item) =>
                            item.id === productId
                        )

                      if (!product) return null

                      return (

                        <button
                          key={product.id}
                          onClick={() =>
                            openProductDetail(product)
                          }
                          className="group flex w-full items-center gap-3 rounded-2xl border border-gray-200 p-3 text-left transition hover:border-[#33245A] hover:bg-[#f8f6fc]"
                        >

                          <img
                            src={product.images[0]}
                            alt={product.nama}
                            className="h-16 w-20 rounded-xl object-cover"
                          />

                          <div className="flex-1">

                            <p className="text-sm font-bold text-black">
                              {product.nama}
                            </p>

                            <p className="text-xs text-gray-500">
                              {product.brand} •{" "}
                              {product.model}
                            </p>

                          </div>

                          <ChevronRight
                            size={18}
                            className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#33245A]"
                          />

                        </button>

                      )
                    }
                  )}

                </div>

              </div>

            </div>

          </aside>

        </div>

      )}

      {/* ========================= */}
      {/* PRODUCT DETAIL */}
      {/* ========================= */}

      {showProductDetail && selectedProductDetail && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6">

          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-7 py-5">

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    setShowProductDetail(false)
                  }
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <ArrowLeft size={19} />
                </button>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Product Detail
                  </p>

                  <h2 className="text-xl font-bold text-black">
                    {selectedProductDetail.nama}
                  </h2>

                </div>

              </div>

              <button
                onClick={() =>
                  setShowProductDetail(false)
                }
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            {/* PRODUCT CONTENT */}
            <div className="grid gap-8 p-7 lg:grid-cols-[1.15fr_0.85fr]">

              {/* GALLERY */}
              <div>

                <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-100">

                  <img
                    src={selectedProductDetail.images[0]}
                    alt={selectedProductDetail.nama}
                    className="h-full w-full object-cover"
                  />

                </div>

                <div className="grid grid-cols-5 gap-3">

                  {selectedProductDetail.images
                    .slice(0, 5)
                    .map((image, index) => (

                      <div
                        key={image}
                        className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
                      >

                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="h-full w-full object-cover"
                        />

                        <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                          {index + 1}
                        </span>

                      </div>

                    ))}

                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">

                  <ImageIcon size={14} />

                  Maksimal 5 gambar product

                </div>

              </div>

              {/* INFO */}
              <div>

                <div className="mb-6">

                  <p className="text-sm font-medium text-gray-400">
                    Brand
                  </p>

                  <p className="mt-1 text-lg font-bold text-black">
                    {selectedProductDetail.brand}
                  </p>

                </div>

                <div className="mb-6">

                  <p className="text-sm font-medium text-gray-400">
                    Model
                  </p>

                  <p className="mt-1 text-lg font-bold text-black">
                    {selectedProductDetail.model}
                  </p>

                </div>

                <div>

                  <p className="mb-2 text-sm font-medium text-gray-400">
                    Deskripsi
                  </p>

                  <div className="rounded-2xl bg-gray-50 p-4">

                    <p className="text-sm leading-6 text-gray-700">
                      {selectedProductDetail.deskripsi}
                    </p>

                  </div>

                </div>

                <div className="mt-7 rounded-2xl bg-[#f1edfa] p-4">

                  <div className="flex items-center gap-3">

                    <Package
                      size={20}
                      className="text-[#33245A]"
                    />

                    <div>

                      <p className="text-sm font-bold text-[#33245A]">
                        Product Information
                      </p>

                      <p className="text-xs text-gray-600">
                        Detail product dapat dikembangkan
                        lagi ketika backend sudah dibuat.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}