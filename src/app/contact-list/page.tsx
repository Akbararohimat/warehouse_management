"use client"

import { useEffect, useMemo, useState } from "react"
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

type Principal = {
  id: number
  principal: string
  brands: string[]
  catalogue?: string
  catalogueName?: string
}

type Product = {
  id: number
  code?: string
  name?: string
  nama?: string
  vendor?: string
  vendorContactId?: number | null
  principalId?: number | null
  category?: string
  brand: string
  model?: string
  price?: string
  status?: "Active" | "Inactive"
  image?: string
  images?: string[]
  deskripsi?: string
}

type Contact = {
  id: number
  nama: string
  perusahaan: string
  principalId?: number | null
  telepon: string
  email: string
  productIds: number[]
}

const initialContacts: Contact[] = [
  {
    id: 1,
    nama: "Akbar arohimat",
    perusahaan: "PT.PTan",
    principalId: null,
    telepon: "08888888",
    email: "akbar@gmail.com",
    productIds: [],
  },
  {
    id: 2,
    nama: "Akbar Versi 2",
    perusahaan: "PT. ABC",
    principalId: null,
    telepon: "08123456789",
    email: "akbar2@gmail.com",
    productIds: [],
  },
  {
    id: 3,
    nama: "Akbar Versi 3",
    perusahaan: "PT. Jaya",
    principalId: null,
    telepon: "08234567890",
    email: "akbar3@gmail.com",
    productIds: [],
  },
]

const initialProducts: Product[] = [
  {
    id: 1,
    code: "PRD-001",
    name: "Fiber Optic Cable 12 Core",
    vendor: "PT.ABC",
    vendorContactId: null,
    principalId: null,
    category: "Fiber Optic",
    brand: "Furukawa",
    price: "150000",
    status: "Active",
    image:
      "https://placehold.co/900x600?text=Fiber+Optic",
    deskripsi:
      "Fiber optic cable untuk kebutuhan jaringan.",
  },
  {
    id: 2,
    code: "PRD-002",
    name: "Router Mikrotik",
    vendor: "PT.ACB",
    vendorContactId: null,
    principalId: null,
    category: "Network",
    brand: "MikroTik",
    price: "2500000",
    status: "Active",
    image:
      "https://placehold.co/900x600?text=Router",
    deskripsi:
      "Router untuk kebutuhan jaringan perusahaan.",
  },
  {
    id: 3,
    code: "PRD-003",
    name: "Optical Distribution Box",
    vendor: "PT.DCA",
    vendorContactId: null,
    principalId: null,
    category: "Fiber Optic",
    brand: "CommScope",
    price: "450000",
    status: "Active",
    image:
      "https://placehold.co/900x600?text=ODF",
    deskripsi:
      "Optical distribution box untuk jaringan fiber optic.",
  },
  {
    id: 4,
    code: "PRD-004",
    name: "Network Switch 24 Port",
    vendor: "PT.CDC",
    vendorContactId: null,
    principalId: null,
    category: "Network",
    brand: "TP-Link",
    price: "850000",
    status: "Inactive",
    image:
      "https://placehold.co/900x600?text=Switch",
    deskripsi:
      "Network switch 24 port untuk kebutuhan jaringan.",
  },
]

function getProductName(
  product?: Partial<Product> | null
) {
  if (!product || typeof product !== "object") {
    return "Unnamed Product"
  }

  return product.name || product.nama || "Unnamed Product"
}

function getProductImage(product: Product) {
  if (
    product.image &&
    typeof product.image === "string" &&
    product.image.trim()
  ) {
    return product.image
  }

  if (
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    product.images[0]
  ) {
    return product.images[0]
  }

  return "https://placehold.co/900x600?text=Product"
}

function getProductImages(product: Product) {
  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    return product.images
  }

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
  const [contacts, setContacts] =
    useState<Contact[]>(initialContacts)
  const [products, setProducts] =
    useState<Product[]>(initialProducts)
  const [principals, setPrincipals] =
    useState<Principal[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [nama, setNama] = useState("")
  const [principalId, setPrincipalId] = useState("")
  const [telepon, setTelepon] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    try {
      const storedContacts =
        localStorage.getItem("rnd_contacts")

      const storedProducts =
        localStorage.getItem("rnd_products")

      const storedPrincipals =
        localStorage.getItem("rnd_principals")

      if (storedContacts) {
        const parsedContacts =
          JSON.parse(storedContacts)

        if (Array.isArray(parsedContacts)) {
          setContacts(parsedContacts)
        }
      } else {
        localStorage.setItem(
          "rnd_contacts",
          JSON.stringify(initialContacts)
        )
      }

      if (storedProducts) {
        const parsedProducts =
          JSON.parse(storedProducts)

        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts)
        }
      } else {
        localStorage.setItem(
          "rnd_products",
          JSON.stringify(initialProducts)
        )
      }

      if (storedPrincipals) {
        const parsedPrincipals =
          JSON.parse(storedPrincipals)

        if (Array.isArray(parsedPrincipals)) {
          setPrincipals(parsedPrincipals)
        }
      }
    } catch (error) {
      console.error(
        "Gagal membaca localStorage:",
        error
      )
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    const params = new URLSearchParams(
      window.location.search
    )

    const principalFromUrl =
      params.get("principal")

    if (!principalFromUrl) return

    const foundPrincipal =
      principals.find(
        (principal) =>
          String(principal.id) ===
          principalFromUrl
      )

    if (foundPrincipal) {
      setSelectedPrincipal(
        foundPrincipal.principal
      )
    }
  }, [hydrated, principals])

  useEffect(() => {
    if (!hydrated) return

    localStorage.setItem(
      "rnd_contacts",
      JSON.stringify(contacts)
    )
  }, [contacts, hydrated])
  useEffect(() => {
    if (!hydrated) return

    localStorage.setItem(
      "rnd_products",
      JSON.stringify(products)
    )
  }, [products, hydrated])

  useEffect(() => {
    const syncData = () => {
      try {
        const storedContacts =
          localStorage.getItem("rnd_contacts")

        const storedProducts =
          localStorage.getItem("rnd_products")

        const storedPrincipals =
          localStorage.getItem("rnd_principals")

        if (storedContacts) {
          const parsedContacts =
            JSON.parse(storedContacts)

          if (Array.isArray(parsedContacts)) {
            setContacts(parsedContacts)
          }
        }

        if (storedProducts) {
          const parsedProducts =
            JSON.parse(storedProducts)

          if (Array.isArray(parsedProducts)) {
            setProducts(parsedProducts)
          }
        }

        if (storedPrincipals) {
          const parsedPrincipals =
            JSON.parse(storedPrincipals)

          if (Array.isArray(parsedPrincipals)) {
            setPrincipals(parsedPrincipals)
          }
        }
      } catch (error) {
        console.error(
          "Gagal sync localStorage:",
          error
        )
      }
    }

    window.addEventListener(
      "storage",
      syncData
    )

    window.addEventListener(
      "focus",
      syncData
    )

    return () => {
      window.removeEventListener(
        "storage",
        syncData
      )

      window.removeEventListener(
        "focus",
        syncData
      )
    }
  }, [])

  const reloadData = () => {
    try {
      const storedContacts =
        localStorage.getItem("rnd_contacts")

      const storedProducts =
        localStorage.getItem("rnd_products")

      const storedPrincipals =
        localStorage.getItem("rnd_principals")

      if (storedContacts) {
        const parsedContacts =
          JSON.parse(storedContacts)

        if (Array.isArray(parsedContacts)) {
          setContacts(parsedContacts)
        }
      }

      if (storedProducts) {
        const parsedProducts =
          JSON.parse(storedProducts)

        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts)
        }
      }

      if (storedPrincipals) {
        const parsedPrincipals =
          JSON.parse(storedPrincipals)

        if (Array.isArray(parsedPrincipals)) {
          setPrincipals(parsedPrincipals)
        }
      }
    } catch (error) {
      console.error(
        "Gagal reload data:",
        error
      )
    }
  }

  const getPrincipalName = (
    id?: number | null
  ) => {
    if (!id) return ""

    const principal =
      principals.find(
        (item) => item.id === id
      )

    return principal?.principal || ""
  }

  const handleAddContact = () => {
    if (
      !nama.trim() ||
      !principalId ||
      !telepon.trim() ||
      !email.trim()
    ) {
      return
    }

    const selectedPrincipalData =
      principals.find(
        (item) =>
          String(item.id) === principalId
      )

    if (!selectedPrincipalData) {
      return
    }

    const newContact: Contact = {
      id: Date.now(),
      nama: nama.trim(),

      /*
       * Perusahaan tetap disimpan untuk
       * kompatibilitas data lama.
       *
       * Sumber utamanya tetap principalId.
       */
      perusahaan:
        selectedPrincipalData.principal,

      principalId:
        selectedPrincipalData.id,

      telepon: telepon.trim(),
      email: email.trim(),
      productIds: [],
    }

    setContacts((prev) => [
      ...prev,
      newContact,
    ])

    setNama("")
    setPrincipalId("")
    setTelepon("")
    setEmail("")

    setShowForm(false)
  }

  const handleDeleteContact = () => {
    if (!selectedContact) return

    const contactId =
      selectedContact.id

    const updatedContacts =
      contacts.filter(
        (contact) =>
          contact.id !== contactId
      )

    const updatedProducts =
      products.map((product) => {
        if (
          product.vendorContactId ===
          contactId
        ) {
          return {
            ...product,
            vendorContactId: null,
          }
        }

        return product
      })

    setContacts(updatedContacts)
    setProducts(updatedProducts)

    localStorage.setItem(
      "rnd_contacts",
      JSON.stringify(updatedContacts)
    )

    localStorage.setItem(
      "rnd_products",
      JSON.stringify(updatedProducts)
    )

    setSelectedContact(null)
    setShowContactDetail(false)
  }

  const principalOptions = useMemo(() => {
    return [
      "Semua Principal",
      ...principals.map(
        (principal) =>
          principal.principal
      ),
    ]
  }, [principals])

  const productOptions = useMemo(() => {
    const names = products
      .map((product) =>
        getProductName(product)
      )
      .filter(Boolean)

    return [
      "Semua Product",
      ...Array.from(
        new Set(names)
      ),
    ]
  }, [products])

  const filteredContacts =
    contacts.filter((contact) => {
      const keyword =
        search.toLowerCase().trim()

      const matchesSearch =
        !keyword ||
        contact.nama
          .toLowerCase()
          .includes(keyword) ||
        contact.perusahaan
          .toLowerCase()
          .includes(keyword) ||
        contact.email
          .toLowerCase()
          .includes(keyword)

      const matchesProduct =
        selectedProduct ===
          "Semua Product" ||
        contact.productIds?.some(
          (productId) => {
            const product =
              products.find(
                (item) =>
                  item.id === productId
              )

            return (
              getProductName(product || {}) ===
              selectedProduct
            )
          }
        ) ||
        products.some(
          (product) =>
            product.vendorContactId ===
              contact.id &&
            getProductName(product) ===
              selectedProduct
        )

      const matchesPrincipal =
        selectedPrincipal ===
          "Semua Principal" ||
        contact.perusahaan ===
          selectedPrincipal ||
        getPrincipalName(
          contact.principalId
        ) === selectedPrincipal

      return (
        matchesSearch &&
        matchesProduct &&
        matchesPrincipal
      )
    })

  const openContactDetail = (
    contact: Contact
  ) => {
    reloadData()

    const storedContacts =
      localStorage.getItem("rnd_contacts")

    let latestContact = contact

    if (storedContacts) {
      try {
        const parsedContacts =
          JSON.parse(storedContacts)

        if (Array.isArray(parsedContacts)) {
          const found =
            parsedContacts.find(
              (item: Contact) =>
                item.id === contact.id
            )

          if (found) {
            latestContact = found
          }
        }
      } catch {
        // gunakan contact saat ini
      }
    }

    setSelectedContact(
      latestContact
    )

    setShowContactDetail(true)
  }
  const getContactProducts = (
    contact: Contact
  ) => {
    return products.filter(
      (product) => {
        const byProductIds =
          contact.productIds?.includes(
            product.id
          )

        const byVendorContact =
          product.vendorContactId ===
          contact.id

        return (
          byProductIds ||
          byVendorContact
        )
      }
    )
  }

  const openProductDetail = (
    product: Product
  ) => {
    setSelectedProductDetail(product)
    setShowProductDetail(true)
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

        <Link
          href="/products"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm hover:bg-[#211344]"
        >
          <Package size={18} />
          Products
        </Link>

        <Link
          href="/principal"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm hover:bg-[#211344]"
        >
          <FileText size={18} />
          Vendor/Principal
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
                  router.push(
                    "/edit-profile"
                  )
                }
              >
                <UserRound className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    "/settings"
                  )
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

            <button
              type="button"
              className="flex h-9 w-16 items-center justify-center rounded-full bg-gray-100 text-black shadow-sm"
            >

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
                    setSearch(
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
                />

              </div>

              <div className="relative">

                <select
                  value={
                    selectedPrincipal
                  }
                  onChange={(e) =>
                    setSelectedPrincipal(
                      e.target.value
                    )
                  }
                  className="h-11 appearance-none rounded-full border-none bg-white pl-11 pr-10 text-sm font-medium text-gray-700 shadow-md outline-none"
                >

                  {principalOptions.map(
                    (principalName) => (
                      <option
                        key={principalName}
                        value={principalName}
                      >
                        {principalName}
                      </option>
                    )
                  )}

                </select>

                <Building2
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

              </div>

              <div className="relative">

                <select
                  value={
                    selectedProduct
                  }
                  onChange={(e) =>
                    setSelectedProduct(
                      e.target.value
                    )
                  }
                  className="h-11 appearance-none rounded-full border-none bg-white pl-11 pr-10 text-sm font-medium text-gray-700 shadow-md outline-none"
                >

                  {productOptions.map(
                    (productName) => (
                      <option
                        key={productName}
                        value={productName}
                      >
                        {productName}
                      </option>
                    )
                  )}

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
                type="button"
                onClick={
                  handleDeleteContact
                }
                disabled={
                  !selectedContact
                }
                className="flex h-11 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <Trash2 size={21} />
              </button>

              <button
                type="button"
                onClick={() => {
                  reloadData()
                  setShowForm(true)
                }}
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

              )
            )}

            {filteredContacts.length ===
              0 && (

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
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
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
                  onChange={(e) =>
                    setNama(
                      e.target.value
                    )
                  }
                  placeholder="Nama contact"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-[#33245A]"
                />

              </div>

              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Perusahaan
                </label>

                <div className="relative">

                  <select
                    value={principalId}
                    onChange={(e) =>
                      setPrincipalId(
                        e.target.value
                      )
                    }
                    disabled={
                      principals.length === 0
                    }
                    className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-black outline-none focus:border-[#33245A] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                  >

                    <option value="">
                      {principals.length === 0
                        ? "Belum ada Principal"
                        : "Pilih contact vendor"}
                    </option>

                    {principals.map(
                      (principal) => (

                        <option
                          key={principal.id}
                          value={principal.id}
                        >
                          {
                            principal.principal
                          }
                        </option>

                      )
                    )}

                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />

                </div>

                {principals.length ===
                  0 && (

                  <p className="mt-1 text-xs text-red-500">
                    Tambahkan Principal
                    terlebih dahulu di
                    Vendor/Principal.
                  </p>

                )}

              </div>
              <div>

                <label className="mb-1 block text-sm font-medium text-gray-700">
                  No. Telepon
                </label>

                <input
                  value={telepon}
                  onChange={(e) =>
                    setTelepon(
                      e.target.value
                    )
                  }
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-[#33245A]"
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
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="email@gmail.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-black outline-none focus:border-[#33245A]"
                />

              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  handleAddContact
                }
                disabled={
                  !nama.trim() ||
                  !principalId ||
                  !telepon.trim() ||
                  !email.trim()
                }
                className="rounded-xl bg-[#33245A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#271b46] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Simpan Contact
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
              setShowContactDetail(
                false
              )
            }
            className="absolute inset-0 bg-black/30"
          />

          <aside className="absolute right-0 top-0 flex h-full w-[430px] flex-col bg-white shadow-2xl">

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
                type="button"
                onClick={() =>
                  setShowContactDetail(
                    false
                  )
                }
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 flex items-center gap-4">

                <Avatar className="h-16 w-16">

                  <AvatarFallback className="bg-[#33245A] text-lg font-bold text-white">

                    {selectedContact.nama
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

                  <h3 className="font-bold text-black">
                    {selectedContact.nama}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {
                      selectedContact.perusahaan
                    }
                  </p>

                </div>

              </div>
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
                      {
                        selectedContact.perusahaan
                      }
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
                      {
                        selectedContact.telepon
                      }
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
                      {
                        selectedContact.email
                      }
                    </p>

                  </div>

                </div>

              </div>
              <div className="mt-7">

                <div className="mb-3 flex items-center justify-between">

                  <div>

                    <h3 className="font-bold text-black">
                      Product
                    </h3>

                    <p className="text-xs text-gray-500">
                      Product yang digunakan
                      contact
                    </p>

                  </div>

                  <Package
                    size={19}
                    className="text-[#33245A]"
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
                      <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center">

                        <Package
                          size={24}
                          className="mx-auto mb-2 text-gray-300"
                        />

                        <p className="text-sm font-medium text-gray-500">
                          Belum ada product
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
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
                            className="group flex w-full items-center gap-3 rounded-2xl border border-gray-200 p-3 text-left transition hover:border-[#33245A] hover:bg-[#f8f6fc]"
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

                              <p className="text-sm font-bold text-black">
                                {getProductName(
                                  product
                                )}
                              </p>

                              <p className="text-xs text-gray-500">
                                {product.brand ||
                                  "-"}
                                {product.model
                                  ? ` • ${product.model}`
                                  : ""}
                              </p>

                              {product.code && (
                                <p className="mt-1 text-[11px] text-gray-400">
                                  {
                                    product.code
                                  }
                                </p>
                              )}

                            </div>

                            <ChevronRight
                              size={18}
                              className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#33245A]"
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

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6">

          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-7 py-5">

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowProductDetail(
                      false
                    )
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
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>
            <div className="grid gap-8 p-7 lg:grid-cols-[1.15fr_0.85fr]">
              <div>

                <div className="mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gray-100">

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
                          className="relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
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

                <div className="mt-3 text-xs text-gray-400">
                  Maksimal 5 gambar
                  product
                </div>

              </div>
              <div>

                {selectedProductDetail.code && (

                  <div className="mb-5">

                    <p className="text-sm font-medium text-gray-400">
                      Product Code
                    </p>

                    <p className="mt-1 text-lg font-bold text-black">
                      {
                        selectedProductDetail.code
                      }
                    </p>

                  </div>

                )}

                {selectedProductDetail.vendor && (

                  <div className="mb-6">

                    <p className="text-sm font-medium text-gray-400">
                      Perusahaan
                    </p>

                    <p className="mt-1 text-lg font-bold text-black">
                      {
                        selectedProductDetail.vendor
                      }
                    </p>

                  </div>

                )}

                {selectedProductDetail.category && (

                  <div className="mb-6">

                    <p className="text-sm font-medium text-gray-400">
                      Category
                    </p>

                    <p className="mt-1 text-lg font-bold text-black">
                      {
                        selectedProductDetail.category
                      }
                    </p>

                  </div>

                )}

                <div className="mb-6">

                  <p className="text-sm font-medium text-gray-400">
                    Brand
                  </p>

                  <p className="mt-1 text-lg font-bold text-black">
                    {
                      selectedProductDetail.brand
                    }
                  </p>

                </div>

                {selectedProductDetail.model && (

                  <div className="mb-6">

                    <p className="text-sm font-medium text-gray-400">
                      Model
                    </p>

                    <p className="mt-1 text-lg font-bold text-black">
                      {
                        selectedProductDetail.model
                      }
                    </p>

                  </div>

                )}

                {selectedProductDetail.price && (

                  <div className="mb-6">

                    <p className="text-sm font-medium text-gray-400">
                      Price
                    </p>

                    <p className="mt-1 text-lg font-bold text-black">
                      Rp{" "}
                      {
                        selectedProductDetail.price
                      }
                    </p>

                  </div>

                )}

                {selectedProductDetail.deskripsi && (

                  <div>

                    <p className="mb-2 text-sm font-medium text-gray-400">
                      Deskripsi
                    </p>

                    <div className="rounded-2xl bg-gray-50 p-4">

                      <p className="text-sm leading-6 text-gray-700">
                        {
                          selectedProductDetail.deskripsi
                        }
                      </p>

                    </div>

                  </div>

                )}

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
                        Product ini terhubung
                        dengan contact
                        berdasarkan contact
                        vendor yang dipilih
                        saat product dibuat.
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