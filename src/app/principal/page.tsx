"use client"

import { useEffect, useState } from "react"
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
  Package,
  Building2,
  Upload,
  File,
  Eye,
  ExternalLink,
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

export default function PrincipalPage() {
  const router = useRouter()
  const [principals, setPrincipals] =
    useState<Principal[]>([])

  const [search, setSearch] = useState("")

  const [showForm, setShowForm] =
    useState(false)

  const [showDetail, setShowDetail] =
    useState(false)

  const [selectedPrincipal, setSelectedPrincipal] =
    useState<Principal | null>(null)

  const [hydrated, setHydrated] =
    useState(false)
  const [principalName, setPrincipalName] =
    useState("")

  const [brands, setBrands] =
    useState("")

  const [catalogueName, setCatalogueName] =
    useState("")

  const [catalogueData, setCatalogueData] =
    useState("")

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          "rnd_principals"
        )

      if (stored) {
        const parsed =
          JSON.parse(stored)

        if (Array.isArray(parsed)) {
          setPrincipals(parsed)
        }
      }
    } catch (error) {
      console.error(
        "Gagal membaca data principal:",
        error
      )
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    localStorage.setItem(
      "rnd_principals",
      JSON.stringify(principals)
    )
  }, [principals, hydrated])

  useEffect(() => {
    const syncData = () => {
      try {
        const stored =
          localStorage.getItem(
            "rnd_principals"
          )

        if (!stored) return

        const parsed =
          JSON.parse(stored)

        if (Array.isArray(parsed)) {
          setPrincipals(parsed)
        }
      } catch (error) {
        console.error(
          "Gagal sync principal:",
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

  const resetForm = () => {
    setPrincipalName("")
    setBrands("")
    setCatalogueName("")
    setCatalogueData("")
  }

  const openAddForm = () => {
    resetForm()
    setShowForm(true)
  }

  const handleCatalogueUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) return

    if (file.type !== "application/pdf") {
      alert(
        "Catalogue harus berupa file PDF."
      )

      event.target.value = ""
      return
    }

    setCatalogueName(file.name)

    const reader = new FileReader()

    reader.onload = () => {
      if (
        typeof reader.result ===
        "string"
      ) {
        setCatalogueData(
          reader.result
        )
      }
    }

    reader.readAsDataURL(file)
  }

  const handleAddPrincipal = () => {
    const trimmedName =
      principalName.trim()

    if (!trimmedName) return

    const brandList =
      brands
        .split(",")
        .map((brand) =>
          brand.trim()
        )
        .filter(Boolean)

    const newPrincipal: Principal = {
      id: Date.now(),
      principal: trimmedName,
      brands: brandList,
      catalogue:
        catalogueData || "",
      catalogueName:
        catalogueName || "",
    }

    const updated = [
      ...principals,
      newPrincipal,
    ]

    setPrincipals(updated)

    localStorage.setItem(
      "rnd_principals",
      JSON.stringify(updated)
    )

    resetForm()
    setShowForm(false)
  }

  const handleDeletePrincipal = () => {
    if (!selectedPrincipal) return

    const confirmed =
      window.confirm(
        `Hapus Principal "${selectedPrincipal.principal}"?`
      )

    if (!confirmed) return

    const updated =
      principals.filter(
        (item) =>
          item.id !==
          selectedPrincipal.id
      )

    setPrincipals(updated)

    localStorage.setItem(
      "rnd_principals",
      JSON.stringify(updated)
    )

    setSelectedPrincipal(null)
    setShowDetail(false)
  }

  const openDetail = (
    principal: Principal
  ) => {
    setSelectedPrincipal(
      principal
    )

    setShowDetail(true)
  }
  const goToContact = (
    principal: Principal
  ) => {
    router.push(
      `/contact-list?principal=${principal.id}`
    )
  }
  const filteredPrincipals =
    principals.filter(
      (principal) => {
        const keyword =
          search
            .toLowerCase()
            .trim()

        if (!keyword) return true

        const matchName =
          principal.principal
            .toLowerCase()
            .includes(keyword)

        const matchBrand =
          principal.brands.some(
            (brand) =>
              brand
                .toLowerCase()
                .includes(keyword)
          )

        return (
          matchName ||
          matchBrand
        )
      }
    )

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
          className="mt-3 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm hover:bg-[#211344]"
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
          className="mt-1 flex items-center gap-3 rounded-full bg-[#33245A] px-4 py-2.5 text-sm"
        >
          <Building2 size={18} />
          Vendor/Principal
        </Link>

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
                Vendor / Principal
              </h2>

            </div>

            <p className="text-sm text-gray-500">
              Kelola data vendor atau principal
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
          <div className="mb-5 flex items-center justify-between">

            <div className="flex h-11 w-80 items-center gap-2 rounded-full bg-white px-4 shadow-md">

              <Search
                size={18}
                className="text-gray-600"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari principal atau brand..."
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
              />

            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="flex h-11 items-center gap-2 rounded-2xl bg-[#33245A] px-5 text-sm font-semibold text-white shadow-md transition hover:bg-[#271b46]"
            >

              <Plus size={18} />

              Add Principal

            </button>

          </div>
          <div className="min-h-[520px] rounded-2xl bg-white p-5 shadow-md">

            <div className="mb-3 grid grid-cols-[1.2fr_1.5fr_1fr_160px] border-b border-gray-400 pb-3 text-sm font-bold text-black">

              <div>
                Principal
              </div>

              <div>
                Brand yang di-provide
              </div>

              <div>
                Catalogue
              </div>

              <div>
                Action
              </div>

            </div>

            {filteredPrincipals.map(
              (principal) => (

                <div
                  key={principal.id}
                  className="grid grid-cols-[1.2fr_1.5fr_1fr_160px] items-center border-b border-gray-200 py-4 text-sm"
                >

                  <button
                    type="button"
                    onClick={() =>
                      openDetail(
                        principal
                      )
                    }
                    className="flex items-center gap-3 text-left"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1edfa] text-[#33245A]">

                      <Building2
                        size={19}
                      />

                    </div>

                    <div>

                      <p className="font-semibold text-gray-900">
                        {
                          principal.principal
                        }
                      </p>

                      <p className="text-xs text-gray-400">
                        {
                          principal.brands
                            .length
                        }{" "}
                        brand
                      </p>

                    </div>

                  </button>
                  <div className="flex flex-wrap gap-2 pr-5">

                    {principal.brands
                      .length > 0 ? (
                      principal.brands.map(
                        (
                          brand,
                          index
                        ) => (

                          <span
                            key={`${brand}-${index}`}
                            className="rounded-full bg-[#f1edfa] px-3 py-1 text-xs font-medium text-[#33245A]"
                          >
                            {brand}
                          </span>

                        )
                      )
                    ) : (

                      <span className="text-gray-400">
                        -
                      </span>

                    )}

                  </div>
                  <div>

                    {principal.catalogueName ? (

                      <button
                        type="button"
                        onClick={() => {

                          if (
                            principal.catalogue
                          ) {
                            window.open(
                              principal.catalogue,
                              "_blank"
                            )
                          }

                        }}
                        className="flex max-w-[180px] items-center gap-2 text-left text-xs text-[#33245A] hover:underline"
                      >

                        <File
                          size={17}
                        />

                        <span className="truncate">
                          {
                            principal.catalogueName
                          }
                        </span>

                        <ExternalLink
                          size={13}
                        />

                      </button>

                    ) : (

                      <span className="text-xs text-gray-400">
                        Belum ada catalogue
                      </span>

                    )}

                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openDetail(
                          principal
                        )
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                      title="Detail"
                    >

                      <Eye
                        size={17}
                      />

                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        goToContact(
                          principal
                        )
                      }
                      className="flex h-9 items-center gap-1.5 rounded-xl bg-[#33245A] px-3 text-xs font-semibold text-white transition hover:bg-[#271b46]"
                    >

                      <Users
                        size={15}
                      />

                      Contact

                    </button>

                  </div>

                </div>

              )
            )}

            {filteredPrincipals.length ===
              0 && (

              <div className="flex h-64 flex-col items-center justify-center">

                <Building2
                  size={40}
                  className="mb-3 text-gray-300"
                />

                <p className="text-sm font-medium text-gray-500">
                  Belum ada Principal
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Tambahkan Principal
                  untuk mulai mengelola
                  vendor.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-black">
                  Add Principal
                </h2>

                <p className="text-sm text-gray-500">
                  Tambahkan vendor atau principal baru
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >

                <X size={20} />

              </button>

            </div>

            <div className="space-y-5">
              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Principal
                </label>

                <input
                  value={principalName}
                  onChange={(e) =>
                    setPrincipalName(
                      e.target.value
                    )
                  }
                  placeholder="Contoh: PT ABC Distribution"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-[#33245A]"
                />

              </div>
              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Brand yang di-provide
                </label>

                <input
                  value={brands}
                  onChange={(e) =>
                    setBrands(
                      e.target.value
                    )
                  }
                  placeholder="Contoh: Huawei, Ruijie, H3C"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-[#33245A]"
                />

                <p className="mt-1.5 text-xs text-gray-400">
                  Pisahkan beberapa brand
                  menggunakan koma.
                </p>

              </div>
              <div>

                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Catalogue
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-7 transition hover:border-[#33245A] hover:bg-[#f8f6fc]">

                  <Upload
                    size={25}
                    className="mb-2 text-[#33245A]"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {catalogueName
                      ? catalogueName
                      : "Upload Catalogue PDF"}
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    Format PDF
                  </span>

                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={
                      handleCatalogueUpload
                    }
                    className="hidden"
                  />

                </label>

                {catalogueName && (

                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#f1edfa] px-3 py-2">

                    <File
                      size={16}
                      className="text-[#33245A]"
                    />

                    <span className="flex-1 truncate text-xs text-gray-700">
                      {catalogueName}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setCatalogueName("")
                        setCatalogueData("")
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >

                      <X size={15} />

                    </button>

                  </div>

                )}

              </div>

            </div>
            <div className="mt-7 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={
                  handleAddPrincipal
                }
                disabled={
                  !principalName.trim()
                }
                className="rounded-xl bg-[#33245A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#271b46] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Simpan Principal
              </button>

            </div>

          </div>

        </div>

      )}

      {showDetail &&
        selectedPrincipal && (

        <div className="fixed inset-0 z-40">

          <button
            type="button"
            aria-label="Close detail"
            onClick={() =>
              setShowDetail(false)
            }
            className="absolute inset-0 bg-black/30"
          />

          <aside className="absolute right-0 top-0 flex h-full w-[450px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

              <div>

                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Principal Detail
                </p>

                <h2 className="mt-1 text-xl font-bold text-black">
                  {
                    selectedPrincipal.principal
                  }
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDetail(false)
                }
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >

                <X size={20} />

              </button>

            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#33245A] text-white">

                  <Building2
                    size={29}
                  />

                </div>

                <div>

                  <h3 className="text-lg font-bold text-black">
                    {
                      selectedPrincipal.principal
                    }
                  </h3>

                  <p className="text-sm text-gray-500">
                    Vendor / Principal
                  </p>

                </div>

              </div>
              <div className="mb-7">

                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Brand yang di-provide
                </p>

                {selectedPrincipal
                  .brands.length > 0 ? (

                  <div className="flex flex-wrap gap-2">

                    {selectedPrincipal.brands.map(
                      (
                        brand,
                        index
                      ) => (

                        <span
                          key={`${brand}-${index}`}
                          className="rounded-full bg-[#f1edfa] px-4 py-2 text-sm font-medium text-[#33245A]"
                        >
                          {brand}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-gray-400">
                    Belum ada brand.
                  </p>

                )}

              </div>

              <div className="mb-7">

                <p className="mb-3 text-sm font-semibold text-gray-700">
                  Catalogue
                </p>

                {selectedPrincipal
                  .catalogueName ? (

                  <div className="rounded-2xl border border-gray-200 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">

                        <File
                          size={21}
                          className="text-red-500"
                        />

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-gray-800">
                          {
                            selectedPrincipal.catalogueName
                          }
                        </p>

                        <p className="text-xs text-gray-400">
                          Catalogue PDF
                        </p>

                      </div>

                      {selectedPrincipal
                        .catalogue && (

                        <button
                          type="button"
                          onClick={() =>
                            window.open(
                              selectedPrincipal.catalogue,
                              "_blank"
                            )
                          }
                          className="rounded-xl bg-[#33245A] p-2 text-white hover:bg-[#271b46]"
                          title="Buka Catalogue"
                        >

                          <ExternalLink
                            size={17}
                          />

                        </button>

                      )}

                    </div>

                  </div>

                ) : (

                  <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center">

                    <File
                      size={25}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p className="text-sm text-gray-400">
                      Belum ada catalogue
                    </p>

                  </div>

                )}

              </div>

              <div className="rounded-2xl bg-[#f1edfa] p-5">

                <div className="mb-4 flex items-center gap-3">

                  <Users
                    size={21}
                    className="text-[#33245A]"
                  />

                  <div>

                    <p className="text-sm font-bold text-[#33245A]">
                      Contact Principal
                    </p>

                    <p className="text-xs text-gray-500">
                      Lihat semua contact dari
                      principal ini.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    goToContact(
                      selectedPrincipal
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#33245A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#271b46]"
                >

                  <Users size={17} />

                  Cari Kontak / Go Contact

                </button>

              </div>
              <button
                type="button"
                onClick={
                  handleDeletePrincipal
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >

                <Trash2 size={17} />

                Hapus Principal

              </button>

            </div>

          </aside>

        </div>

      )}

    </main>
  )
}