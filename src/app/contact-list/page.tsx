"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  LayoutDashboard,
  Users,
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

const API_URL = "http://localhost:5000/api"

type Company = {
  id: string
  name: string
  type: "VENDOR" | "PRINCIPAL"
  phone?: string | null
  email?: string | null
  address?: string | null
  description?: string | null
}

type Product = {
  id: string
  code?: string
  name?: string
  category?: string
  brand: string
  price?: string | number
  status?: "ACTIVE" | "INACTIVE"
  imageUrl?: string | null
  companyId: string
  contactId?: string | null
  company?: Company | null
  contact?: Contact | null
}

type Contact = {
  id: string
  name: string
  phone?: string | null
  email?: string | null
  position?: string | null
  companyId: string
  company?: Company | null
  products?: Product[]
}

function getProductName(product?: Product | null) {
  if (!product) {
    return "Unnamed Product"
  }

  return product.name || "Unnamed Product"
}

function getProductImage(product: Product) {
  if (
    product.imageUrl &&
    typeof product.imageUrl === "string" &&
    product.imageUrl.trim()
  ) {
    return product.imageUrl
  }

  return "https://placehold.co/900x600?text=Product"
}

function getProductImages(product: Product) {
  return [getProductImage(product)]
}

export default function ContactList() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] =
    useState("Semua Product")
  const [selectedPrincipal, setSelectedPrincipal] =
    useState("Semua Principal")

  const [showForm, setShowForm] = useState(false)
  const [showContactDetail, setShowContactDetail] =
    useState(false)
  const [showProductDetail, setShowProductDetail] =
    useState(false)

  const [selectedContact, setSelectedContact] =
    useState<Contact | null>(null)

  const [selectedProductDetail, setSelectedProductDetail] =
    useState<Product | null>(null)

  const [contacts, setContacts] = useState<Contact[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [companies, setCompanies] = useState<Company[]>([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [nama, setNama] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [telepon, setTelepon] = useState("")
  const [email, setEmail] = useState("")

  const fetchData = async () => {
    try {
      setLoading(true)

      const [
        contactsResponse,
        companiesResponse,
        productsResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/contacts`),
        fetch(`${API_URL}/companies`),
        fetch(`${API_URL}/products`),
      ])

      if (!contactsResponse.ok) {
        throw new Error("Gagal mengambil data contact")
      }

      if (!companiesResponse.ok) {
        throw new Error("Gagal mengambil data company")
      }

      if (!productsResponse.ok) {
        throw new Error("Gagal mengambil data product")
      }

      const contactsResult =
        await contactsResponse.json()

      const companiesResult =
        await companiesResponse.json()

      const productsResult =
        await productsResponse.json()

      if (contactsResult.success) {
        setContacts(contactsResult.data || [])
      } else {
        setContacts([])
      }

      if (companiesResult.success) {
        const principalCompanies = (
          companiesResult.data || []
        ).filter(
          (company: Company) =>
            company.type === "PRINCIPAL"
        )

        setCompanies(principalCompanies)
      } else {
        setCompanies([])
      }

      if (productsResult.success) {
        setProducts(productsResult.data || [])
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error)

      setContacts([])
      setCompanies([])
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    )

    const principalFromUrl =
      params.get("principal")

    if (!principalFromUrl) return

    const foundCompany = companies.find(
      (company) =>
        String(company.id) === principalFromUrl
    )

    if (foundCompany) {
      setSelectedPrincipal(foundCompany.name)
    }
  }, [companies])

  const handleAddContact = async () => {
    if (
      !nama.trim() ||
      !companyId ||
      !telepon.trim() ||
      !email.trim()
    ) {
      return
    }

    try {
      setSaving(true)

      const response = await fetch(
        `${API_URL}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nama.trim(),
            phone: telepon.trim(),
            email: email.trim(),
            companyId,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menambahkan contact"
        )
        return
      }

      setNama("")
      setCompanyId("")
      setTelepon("")
      setEmail("")

      setShowForm(false)

      await fetchData()
    } catch (error) {
      console.error(
        "Create contact error:",
        error
      )

      alert(
        "Terjadi kesalahan saat menambahkan contact"
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteContact = async () => {
    if (!selectedContact) return

    const confirmed = window.confirm(
      `Hapus contact "${selectedContact.name}"?`
    )

    if (!confirmed) return

    try {
      setDeleting(true)

      const response = await fetch(
        `${API_URL}/contacts/${selectedContact.id}`,
        {
          method: "DELETE",
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menghapus contact"
        )
        return
      }

      setSelectedContact(null)
      setShowContactDetail(false)

      await fetchData()
    } catch (error) {
      console.error(
        "Delete contact error:",
        error
      )

      alert(
        "Terjadi kesalahan saat menghapus contact"
      )
    } finally {
      setDeleting(false)
    }
  }

  const principalOptions = useMemo(() => {
    return [
      "Semua Principal",
      ...companies.map(
        (company) => company.name
      ),
    ]
  }, [companies])

  const productOptions = useMemo(() => {
    const names = products
      .map((product) =>
        getProductName(product)
      )
      .filter(Boolean)

    return [
      "Semua Product",
      ...Array.from(new Set(names)),
    ]
  }, [products])

  const filteredContacts = contacts.filter(
    (contact) => {
      const keyword =
        search.toLowerCase().trim()

      const contactName =
        contact.name?.toLowerCase() || ""

      const companyName =
        contact.company?.name?.toLowerCase() ||
        ""

      const contactEmail =
        contact.email?.toLowerCase() || ""

      const matchesSearch =
        !keyword ||
        contactName.includes(keyword) ||
        companyName.includes(keyword) ||
        contactEmail.includes(keyword)

      const contactProducts = products.filter(
        (product) =>
          product.contactId === contact.id
      )

      const matchesProduct =
        selectedProduct === "Semua Product" ||
        contactProducts.some(
          (product) =>
            getProductName(product) ===
            selectedProduct
        )

      const matchesPrincipal =
        selectedPrincipal ===
          "Semua Principal" ||
        contact.company?.name ===
          selectedPrincipal

      return (
        matchesSearch &&
        matchesProduct &&
        matchesPrincipal
      )
    }
  )

  const openContactDetail = async (
    contact: Contact
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/contacts/${contact.id}`
      )

      const result = await response.json()

      if (response.ok && result.success) {
        setSelectedContact(result.data)
      } else {
        setSelectedContact(contact)
      }
    } catch (error) {
      console.error(
        "Get contact detail error:",
        error
      )

      setSelectedContact(contact)
    }

    setShowContactDetail(true)
  }

  const getContactProducts = (
    contact: Contact
  ) => {
    return products.filter(
      (product) =>
        product.contactId === contact.id
    )
  }

  const openProductDetail = (
    product: Product
  ) => {
    setSelectedProductDetail(product)
    setShowProductDetail(true)
  }

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-[#020617] dark:via-[#07112f] dark:to-[#020617]">

      <aside className="flex w-68 shrink-0 flex-col bg-[#010736] px-5 py-6 text-white">

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
            <img
              src="/OIP.webp"
              alt="RnD Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="text-xl font-bold">
            Dashboard RnD
          </h2>
        </div>

        <p className="mb-3 px-1 text-sm font-semibold text-white/60">
          Menu
        </p>

        <Link
          href="/dashboard"
          className="relative flex items-center gap-3 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          href="/contact-list"
          className="relative mt-1 flex items-center gap-3 px-4 py-3 text-sm font-medium text-white transition"
        >
          <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 bg-yellow-400" />

          <Users size={18} />
          Contact List
        </Link>

        <Link
          href="/products"
          className="relative mt-1 flex items-center gap-3 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <Package size={18} />
          Product Item
        </Link>

        <Link
          href="/principal"
          className="relative mt-1 flex items-center gap-3 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <Building2 size={18} />
          Vendor/Principal
        </Link>

        <Link
          href="/product-solution"
          className="relative mt-1 flex items-center gap-3 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <Package size={18} />
          Product Solution
        </Link>

        <div className="mt-6 border-t border-white/10 pt-5" />

        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full rounded-xl outline-none">

              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/10">

                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white text-[#010736]">
                    AR
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    Akbar arohimat
                  </p>

                  <p className="text-xs text-white/60">
                    RnD Division
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className="text-white/70"
                />

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
                onClick={() =>
                  router.push("/")
                }
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

          <header className="flex h-20 items-center border-b border-slate-200/70 bg-gradient-to-r from-white via-white to-slate-50 px-8 dark:border-white/10 dark:from-[#07112f] dark:via-[#07112f] dark:to-[#0b1738]">

            <div>
              <div className="flex items-center gap-2">

                <h1 className="text-3xl font-bold text-black dark:text-white">
                  Dashboard
                </h1>

                <span className="text-xl text-gray-400 dark:text-white/30">
                  ›
                </span>

                <h2 className="text-xl font-semibold text-black dark:text-white">
                  Contact List
                </h2>

              </div>

              <p className="text-sm text-gray-500 dark:text-white/50">
                Welcome to RnD Web Portal
              </p>
            </div>

          </header>

          <div className="p-8">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-72 items-center gap-2 rounded-full border border-slate-200/70 bg-gradient-to-r from-slate-50 to-white px-4 shadow-sm dark:border-white/10 dark:from-[#0b1738] dark:to-[#101d42]">

                  <Search
                    size={18}
                    className="text-gray-700 dark:text-white/60"
                  />

                  <input
                    type="text"
                    placeholder="Cari nama, perusahaan, atau email..."
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500 dark:text-white dark:placeholder:text-white/40"
                  />

                </div>

                <div className="relative">

                  <select
                    value={selectedPrincipal}
                    onChange={(e) =>
                      setSelectedPrincipal(
                        e.target.value
                      )
                    }
                    className="h-11 appearance-none rounded-full border border-slate-200/70 bg-gradient-to-r from-white to-slate-50 pl-11 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none dark:border-white/10 dark:from-[#0b1738] dark:to-[#101d42] dark:text-white"
                  >
                    {principalOptions.map(
                      (companyName) => (
                        <option
                          key={companyName}
                          value={companyName}
                          className="bg-white text-gray-900 dark:bg-[#0b1738] dark:text-white"
                        >
                          {companyName}
                        </option>
                      )
                    )}
                  </select>

                  <Building2
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50"
                  />

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50"
                  />

                </div>

                <div className="relative">

                  <select
                    value={selectedProduct}
                    onChange={(e) =>
                      setSelectedProduct(
                        e.target.value
                      )
                    }
                    className="h-11 appearance-none rounded-full border border-slate-200/70 bg-gradient-to-r from-white to-slate-50 pl-11 pr-10 text-sm font-medium text-gray-700 shadow-sm outline-none dark:border-white/10 dark:from-[#0b1738] dark:to-[#101d42] dark:text-white"
                  >
                    {productOptions.map(
                      (productName) => (
                        <option
                          key={productName}
                          value={productName}
                          className="bg-white text-gray-900 dark:bg-[#0b1738] dark:text-white"
                        >
                          {productName}
                        </option>
                      )
                    )}
                  </select>

                  <Filter
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50"
                  />

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50"
                  />

                </div>

              </div>

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={handleDeleteContact}
                  disabled={
                    !selectedContact ||
                    deleting
                  }
                  className="flex h-11 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-white/10"
                >
                  <Trash2 size={21} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNama("")
                    setCompanyId("")
                    setTelepon("")
                    setEmail("")
                    setShowForm(true)
                  }}
                  className="flex h-11 items-center gap-2 rounded-2xl bg-[#010736] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020a55]"
                >
                  <Plus size={18} />
                  Add Contact
                </button>

              </div>

            </div>

            <div className="min-h-[520px] rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 p-5 shadow-sm dark:border-white/10 dark:from-[#07112f] dark:via-[#091633] dark:to-[#0b1738]">

              <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1.3fr] border-b border-slate-300 pb-3 text-sm font-bold text-black dark:border-white/10 dark:text-white">

                <div>
                  Nama
                </div>

                <div>
                  Perusahaan
                </div>

                <div>
                  No.Telepon
                </div>

                <div>
                  Email
                </div>

              </div>

              {loading ? (

                <div className="flex h-40 items-center justify-center">
                  <p className="text-sm text-gray-400 dark:text-white/40">
                    Memuat data contact...
                  </p>
                </div>

              ) : (

                <>
                  {filteredContacts.map(
                    (contact) => (
                      <button
                        type="button"
                        key={contact.id}
                        onClick={() =>
                          openContactDetail(
                            contact
                          )
                        }
                        className="grid w-full grid-cols-[1.2fr_1.2fr_1fr_1.3fr] border-b border-slate-200 py-4 text-left text-sm transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/[0.03]"
                      >

                        <div className="font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </div>

                        <div className="text-gray-700 dark:text-white/70">
                          {contact.company?.name ||
                            "-"}
                        </div>

                        <div className="text-gray-700 dark:text-white/70">
                          {contact.phone || "-"}
                        </div>

                        <div className="text-gray-700 dark:text-white/70">
                          {contact.email || "-"}
                        </div>

                      </button>
                    )
                  )}

                  {filteredContacts.length ===
                    0 && (
                    <div className="flex h-40 items-center justify-center">
                      <p className="text-sm text-gray-400 dark:text-white/40">
                        Contact tidak ditemukan.
                      </p>
                    </div>
                  )}
                </>

              )}

            </div>

          </div>

        </section>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 dark:bg-black/60">

          <div className="w-full max-w-[480px] rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-6 shadow-xl dark:border-white/10 dark:from-[#07112f] dark:via-[#091633] dark:to-[#0b1738]">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Add Contact
                </h2>

                <p className="text-sm text-gray-500 dark:text-white/50">
                  Tambahkan contact baru
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-full p-2 text-gray-500 transition hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/10"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-4">

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white/70">
                  Nama
                </label>

                <input
                  value={nama}
                  onChange={(e) =>
                    setNama(e.target.value)
                  }
                  placeholder="Nama contact"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-[#010736] dark:border-white/10 dark:bg-[#0b1738] dark:text-white dark:placeholder:text-white/30 dark:focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white/70">
                  Perusahaan
                </label>

                <div className="relative">

                  <select
                    value={companyId}
                    onChange={(e) =>
                      setCompanyId(
                        e.target.value
                      )
                    }
                    disabled={
                      companies.length === 0
                    }
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-black outline-none transition focus:border-[#010736] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-white/10 dark:bg-[#0b1738] dark:text-white dark:focus:border-blue-400 dark:disabled:bg-white/5"
                  >
                    <option value="">
                      {companies.length ===
                      0
                        ? "Belum ada Principal"
                        : "Pilih perusahaan"}
                    </option>

                    {companies.map(
                      (company) => (
                        <option
                          key={company.id}
                          value={company.id}
                          className="bg-white text-gray-900 dark:bg-[#0b1738] dark:text-white"
                        >
                          {company.name}
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white/50"
                  />

                </div>

                {companies.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    Tambahkan Principal terlebih
                    dahulu melalui Vendor/Principal.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white/70">
                  No. Telepon
                </label>

                <input
                  value={telepon}
                  onChange={(e) =>
                    setTelepon(e.target.value)
                  }
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-[#010736] dark:border-white/10 dark:bg-[#0b1738] dark:text-white dark:placeholder:text-white/30 dark:focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-white/70">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="email@gmail.com"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-[#010736] dark:border-white/10 dark:bg-[#0b1738] dark:text-white dark:placeholder:text-white/30 dark:focus:border-blue-400"
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleAddContact}
                disabled={
                  saving ||
                  !nama.trim() ||
                  !companyId ||
                  !telepon.trim() ||
                  !email.trim()
                }
                className="rounded-xl bg-[#010736] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#020a55] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Menyimpan..."
                  : "Simpan Contact"}
              </button>

            </div>

          </div>

        </div>
      )}

      {showContactDetail &&
        selectedContact && (
          <div className="fixed inset-0 z-40">

            <button
              type="button"
              aria-label="Close detail"
              onClick={() =>
                setShowContactDetail(false)
              }
              className="absolute inset-0 bg-black/30 dark:bg-black/60"
            />

            <aside className="absolute right-0 top-0 flex h-full w-[430px] flex-col border-l border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 shadow-2xl dark:border-white/10 dark:from-[#07112f] dark:via-[#091633] dark:to-[#0b1738]">

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                    Contact Detail
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-black dark:text-white">
                    {selectedContact.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowContactDetail(
                      false
                    )
                  }
                  className="rounded-full p-2 text-gray-500 transition hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/10"
                >
                  <X size={20} />
                </button>

              </div>

              <div className="flex-1 overflow-y-auto p-6">

                <div className="mb-6 flex items-center gap-4">

                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-[#010736] text-lg font-bold text-white">
                      {selectedContact.name
                        .split(" ")
                        .map(
                          (item) =>
                            item[0]
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-bold text-black dark:text-white">
                      {selectedContact.name}
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-white/50">
                      {selectedContact.company
                        ?.name || "-"}
                    </p>
                  </div>

                </div>

                <div className="space-y-3">

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 dark:border-white/10 dark:from-[#0b1738] dark:to-[#101d42]">

                    <Building2
                      size={18}
                      className="text-[#010736] dark:text-blue-300"
                    />

                    <div>
                      <p className="text-xs text-gray-400 dark:text-white/40">
                        Perusahaan
                      </p>

                      <p className="text-sm font-medium text-gray-800 dark:text-white/80">
                        {selectedContact.company
                          ?.name || "-"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 dark:border-white/10 dark:from-[#0b1738] dark:to-[#101d42]">

                    <Phone
                      size={18}
                      className="text-[#010736] dark:text-blue-300"
                    />

                    <div>
                      <p className="text-xs text-gray-400 dark:text-white/40">
                        No. Telepon
                      </p>

                      <p className="text-sm font-medium text-gray-800 dark:text-white/80">
                        {selectedContact.phone ||
                          "-"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 dark:border-white/10 dark:from-[#0b1738] dark:to-[#101d42]">

                    <Mail
                      size={18}
                      className="text-[#010736] dark:text-blue-300"
                    />

                    <div>
                      <p className="text-xs text-gray-400 dark:text-white/40">
                        Email
                      </p>

                      <p className="text-sm font-medium text-gray-800 dark:text-white/80">
                        {selectedContact.email ||
                          "-"}
                      </p>
                    </div>

                  </div>

                </div>
                <div className="mt-7">

                  <div className="mb-3 flex items-center justify-between">

                    <div>
                      <h3 className="font-bold text-black dark:text-white">
                        Product
                      </h3>

                      <p className="text-xs text-gray-500 dark:text-white/50">
                        Product yang digunakan
                        contact
                      </p>
                    </div>

                    <Package
                      size={19}
                      className="text-[#010736] dark:text-blue-300"
                    />

                  </div>

                  {(() => {

                    const contactProducts =
                      getContactProducts(
                        selectedContact
                      )

                    if (
                      contactProducts.length ===
                      0
                    ) {
                      return (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gradient-to-br from-white to-slate-50 p-5 text-center dark:border-white/15 dark:from-[#0b1738] dark:to-[#101d42]">

                          <Package
                            size={24}
                            className="mx-auto mb-2 text-gray-300 dark:text-white/20"
                          />

                          <p className="text-sm font-medium text-gray-500 dark:text-white/50">
                            Belum ada product
                          </p>

                          <p className="mt-1 text-xs text-gray-400 dark:text-white/30">
                            Product dapat
                            ditambahkan melalui
                            halaman Products.
                          </p>

                        </div>
                      )
                    }

                    return (
                      <div className="space-y-3">

                        {contactProducts.map(
                          (product) => (
                            <button
                              type="button"
                              key={product.id}
                              onClick={() =>
                                openProductDetail(
                                  product
                                )
                              }
                              className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left transition hover:border-[#010736] hover:bg-slate-50 dark:border-white/10 dark:bg-[#0b1738] dark:hover:border-blue-400/50 dark:hover:bg-white/[0.03]"
                            >

                              <img
                                src={getProductImage(
                                  product
                                )}
                                alt={getProductName(
                                  product
                                )}
                                className="h-16 w-20 rounded-xl object-cover"
                              />

                              <div className="flex-1">

                                <p className="text-sm font-bold text-black dark:text-white">
                                  {getProductName(
                                    product
                                  )}
                                </p>

                                <p className="text-xs text-gray-500 dark:text-white/50">
                                  {product.brand ||
                                    "-"}
                                </p>

                                {product.code && (
                                  <p className="mt-1 text-[11px] text-gray-400 dark:text-white/30">
                                    {product.code}
                                  </p>
                                )}

                              </div>

                              <ChevronRight
                                size={18}
                                className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#010736] dark:text-white/30 dark:group-hover:text-blue-300"
                              />

                            </button>
                          )
                        )}

                      </div>
                    )
                  })()}

                </div>

              </div>

            </aside>

          </div>
        )}
      {showProductDetail &&
        selectedProductDetail && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6 dark:bg-black/70">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 shadow-2xl dark:border-white/10 dark:from-[#07112f] dark:via-[#091633] dark:to-[#0b1738]">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-white via-white to-slate-50 px-7 py-5 dark:border-white/10 dark:from-[#07112f] dark:via-[#091633] dark:to-[#0b1738]">

                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setShowProductDetail(
                        false
                      )
                    }
                    className="rounded-full p-2 transition hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <ArrowLeft
                      size={19}
                      className="dark:text-white"
                    />
                  </button>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                      Product Detail
                    </p>

                    <h2 className="text-xl font-bold text-black dark:text-white">
                      {getProductName(
                        selectedProductDetail
                      )}
                    </h2>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowProductDetail(
                      false
                    )
                  }
                  className="rounded-full p-2 text-gray-500 transition hover:bg-slate-100 dark:text-white/60 dark:hover:bg-white/10"
                >
                  <X size={20} />
                </button>

              </div>
              <div className="grid gap-8 p-7 lg:grid-cols-[1.15fr_0.85fr]">
                <div>

                  <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-[#0b1738]">

                    <img
                      src={getProductImage(
                        selectedProductDetail
                      )}
                      alt={getProductName(
                        selectedProductDetail
                      )}
                      className="h-full w-full object-cover"
                    />

                  </div>

                  <div className="grid grid-cols-5 gap-3">

                    {getProductImages(
                      selectedProductDetail
                    )
                      .slice(0, 5)
                      .map(
                        (
                          image,
                          index
                        ) => (
                          <div
                            key={`${image}-${index}`}
                            className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-gray-100 dark:border-white/10 dark:bg-[#0b1738]"
                          >

                            <img
                              src={image}
                              alt={`Product ${
                                index + 1
                              }`}
                              className="h-full w-full object-cover"
                            />

                            <span className="absolute bottom-1 left-1 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                              {index + 1}
                            </span>

                          </div>
                        )
                      )}

                  </div>

                  <div className="mt-3 text-xs text-gray-400 dark:text-white/30">
                    Maksimal 5 gambar product
                  </div>

                </div>
                <div>

                  {selectedProductDetail.code && (
                    <div className="mb-5">

                      <p className="text-sm font-medium text-gray-400 dark:text-white/40">
                        Product Code
                      </p>

                      <p className="mt-1 text-lg font-bold text-black dark:text-white">
                        {
                          selectedProductDetail.code
                        }
                      </p>

                    </div>
                  )}

                  {selectedProductDetail.company
                    ?.name && (
                    <div className="mb-6">

                      <p className="text-sm font-medium text-gray-400 dark:text-white/40">
                        Perusahaan
                      </p>

                      <p className="mt-1 text-lg font-bold text-black dark:text-white">
                        {
                          selectedProductDetail
                            .company?.name
                        }
                      </p>

                    </div>
                  )}

                  {selectedProductDetail.category && (
                    <div className="mb-6">

                      <p className="text-sm font-medium text-gray-400 dark:text-white/40">
                        Category
                      </p>

                      <p className="mt-1 text-lg font-bold text-black dark:text-white">
                        {
                          selectedProductDetail.category
                        }
                      </p>

                    </div>
                  )}

                  <div className="mb-6">

                    <p className="text-sm font-medium text-gray-400 dark:text-white/40">
                      Brand
                    </p>

                    <p className="mt-1 text-lg font-bold text-black dark:text-white">
                      {
                        selectedProductDetail.brand
                      }
                    </p>

                  </div>

                  {selectedProductDetail.price !==
                    undefined && (
                    <div className="mb-6">

                      <p className="text-sm font-medium text-gray-400 dark:text-white/40">
                        Price
                      </p>

                      <p className="mt-1 text-lg font-bold text-black dark:text-white">
                        Rp{" "}
                        {
                          selectedProductDetail.price
                        }
                      </p>

                    </div>
                  )}

                  <div className="mt-7 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 dark:border-white/10 dark:from-[#0b1738] dark:to-[#101d42]">

                    <div className="flex items-center gap-3">

                      <Package
                        size={20}
                        className="text-[#010736] dark:text-blue-300"
                      />

                      <div>

                        <p className="text-sm font-bold text-[#010736] dark:text-blue-300">
                          Product Information
                        </p>

                        <p className="text-xs text-gray-600 dark:text-white/50">
                          Product ini terhubung
                          dengan contact
                          berdasarkan contact
                          yang dipilih saat
                          product dibuat.
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