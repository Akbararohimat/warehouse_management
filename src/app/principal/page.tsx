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
    Package,
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

type Brand = {
    id: string
    name: string
    createdAt?: string
    updatedAt?: string
}

type Company = {
    id: string
    name: string
    type: "VENDOR" | "PRINCIPAL"
    phone?: string | null
    email?: string | null
    address?: string | null
    website?: string | null
    brand?: string | null
    brands?: Brand[]
    description?: string | null
    _count?: {
        contacts: number
        products: number
    }
}

type PrincipalForm = {
    name: string
    phone: string
    brand: string
    address: string
    website: string
}

export default function PrincipalPage() {
    const router = useRouter()

    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [search, setSearch] = useState("")

    const [showAddModal, setShowAddModal] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const [form, setForm] = useState<PrincipalForm>({
        name: "",
        phone: "",
        brand: "",
        address: "",
        website: "",
    })

    const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

    async function fetchCompanies() {
        try {
            setLoading(true)
            setError("")

            const response = await fetch(`${API_URL}/companies`)
            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Gagal mengambil data Principal"
                )
            }

            setCompanies(result.data || [])
        } catch (err) {
            console.error(err)

            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil data Principal"
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCompanies()
    }, [])

    const principals = useMemo(() => {
        const keyword = search.trim().toLowerCase()

        return companies
            .filter((company) => company.type === "PRINCIPAL")
            .filter((company) => {
                if (!keyword) return true

                const brandValue =
                    company.brands
                        ?.map((brand) => brand.name)
                        .join(" ") ?? ""

                return (
                    company.name.toLowerCase().includes(keyword) ||
                    company.email?.toLowerCase().includes(keyword) ||
                    company.phone?.toLowerCase().includes(keyword) ||
                    brandValue.toLowerCase().includes(keyword)
                )
            })
    }, [companies, search])

    function handleFormChange(
        field: keyof PrincipalForm,
        value: string
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    function resetForm() {
        setForm({
            name: "",
            phone: "",
            brand: "",
            address: "",
            website: "",
        })
    }

    async function handleAddPrincipal() {
        if (!form.name.trim()) {
            alert("Nama Principal wajib diisi.")
            return
        }

        try {
            setSubmitting(true)

            const response = await fetch(`${API_URL}/companies`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name.trim(),
                    type: "PRINCIPAL",
                    phone: form.phone.trim() || null,
                    brands: form.brand.trim()
                        ? [form.brand.trim()]
                        : [],
                    address: form.address.trim() || null,
                    website: form.website.trim() || null,
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Gagal menambahkan Principal"
                )
            }

            setShowAddModal(false)
            resetForm()

            await fetchCompanies()
        } catch (err) {
            console.error(err)

            alert(
                err instanceof Error
                    ? err.message
                    : "Gagal menambahkan Principal"
            )
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDeletePrincipal(company: Company) {
        const confirmed = window.confirm(
            `Hapus Principal "${company.name}"?`
        )

        if (!confirmed) return

        try {
            setDeleteLoading(company.id)

            const response = await fetch(
                `${API_URL}/companies/${company.id}`,
                {
                    method: "DELETE",
                }
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Gagal menghapus Principal"
                )
            }

            await fetchCompanies()
        } catch (err) {
            console.error(err)

            alert(
                err instanceof Error
                    ? err.message
                    : "Gagal menghapus Principal"
            )
        } finally {
            setDeleteLoading(null)
        }
    }

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
    }

    return (
        <main className="flex min-h-screen bg-slate-100">
            {/* SIDEBAR */}
            <aside className="flex w-68 shrink-0 flex-col bg-[#010736] px-5 py-6 text-white">
                {/* LOGO */}
                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
                        <img
                            src="/OIP.webp"
                            alt="Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <h2 className="text-xl font-bold">
                        Dashboard RnD
                    </h2>
                </div>

                <p className="mb-3 text-sm font-semibold uppercase text-gray-300">
                    Menu
                </p>

            
                <Link
                    href="/dashboard"
                    className="group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>
                <Link
                    href="/contact-list"
                    className="group relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <Users size={18} />
                    Contact List
                </Link>
                <Link
                    href="/products"
                    className="group relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <Package size={18} />
                    Product Item
                </Link>
                <Link
                    href="/principal"
                    className="relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-yellow-400" />

                    <Building2 size={18} />
                    Vendor/Principal
                </Link>

                <Link
                    href="/product-solution"
                    className="group relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <Package size={18} />
                    Product Solution
                </Link>

                <div className="mt-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full rounded-xl outline-none">
                            <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-white transition-colors hover:bg-white/5">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-white text-[#010736]">
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
                <header className="flex h-20 items-center justify-between border-b border-slate-200/70 bg-gradient-to-r from-white via-white to-slate-50 px-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-black">
                                Dashboard
                            </h1>

                            <span className="text-xl text-gray-400">
                                ›
                            </span>

                            <h2 className="text-xl font-semibold text-black">
                                Principal
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            Welcome to RnD Web Portal
                        </p>
                    </div>
                </header>

                <div className="p-8">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-black">
                                Daftar Principal
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                {principals.length} Principal terdaftar
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {/* SEARCH */}
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Cari Principal..."
                                    className="h-11 w-full rounded-full border-none bg-white pl-10 pr-4 text-sm shadow-md outline-none transition focus:ring-2 focus:ring-[#010736]/10 sm:w-[280px]"
                                />
                            </div>

                            <button
                                onClick={() => {
                                    resetForm()
                                    setShowAddModal(true)
                                }}
                                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#010736] px-5 text-sm font-semibold text-white shadow-md transition hover:bg-[#02094d]"
                            >
                                <Plus size={18} />
                                Add Principal
                            </button>
                        </div>
                    </div>

            
                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* LOADING */}
                    {loading ? (
                        <div className="rounded-2xl bg-white p-12 text-center shadow-md">
                            <p className="text-sm text-gray-500">
                                Memuat data Principal...
                            </p>
                        </div>
                    ) : principals.length === 0 ? (
                        /* EMPTY */
                        <div className="rounded-2xl bg-white p-14 text-center shadow-md">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#010736]/10">
                                <Building2
                                    size={26}
                                    className="text-[#010736]"
                                />
                            </div>

                            <h4 className="text-base font-semibold text-gray-900">
                                Belum ada Principal
                            </h4>

                            <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                                Tambahkan Principal pertama untuk mulai
                                mengelola perusahaan Principal.
                            </p>

                            <button
                                onClick={() => {
                                    resetForm()
                                    setShowAddModal(true)
                                }}
                                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#010736] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#02094d]"
                            >
                                <Plus size={17} />
                                Add Principal
                            </button>
                        </div>
                    ) : (
                        <div className="min-h-[520px] overflow-hidden rounded-2xl bg-white p-5 shadow-md">
                            <div className="grid grid-cols-[1.5fr_1fr_1.2fr_100px] border-b border-gray-400 px-0 pb-3 text-sm font-bold text-black">
                                <div>Nama</div>
                                <div>Brand</div>
                                <div>Address</div>
                                <div className="text-right">
                                    Enter
                                </div>
                            </div>

                            {principals.map((principal) => (
                                <div
                                    key={principal.id}
                                    onClick={() =>
                                        router.push(
                                            `/principal/${principal.id}`
                                        )
                                    }
                                    className="grid cursor-pointer grid-cols-[1.5fr_1fr_1.2fr_100px] items-center border-b border-gray-100 px-0 py-4 text-sm last:border-b-0 hover:bg-slate-50"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#010736]/10">
                                            <Building2
                                                size={18}
                                                className="text-[#010736]"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-gray-900">
                                                {principal.name}
                                            </p>

                                            <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-[#010736]">
                                                PRINCIPAL
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        {principal.brands &&
                                        principal.brands.length > 0 ? (
                                            principal.brands.map(
                                                (brand) => (
                                                    <span
                                                        key={brand.id}
                                                        className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-[#010736]"
                                                    >
                                                        {brand.name}
                                                    </span>
                                                )
                                            )
                                        ) : (
                                            <span className="text-gray-400">
                                                -
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        {principal.brand ??
                                        principal.address ? (
                                            <>
                                                <Building2
                                                    size={14}
                                                    className="text-gray-400"
                                                />

                                                <span className="truncate">
                                                    {principal.brand ??
                                                        principal.address}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-gray-400">
                                                -
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeletePrincipal(
                                                    principal
                                                )
                                            }}
                                            disabled={
                                                deleteLoading ===
                                                principal.id
                                            }
                                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                            title="Hapus Principal"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Add Principal
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                    Tambahkan data Principal baru
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-slate-100 hover:text-[#010736]"
                            >
                                <X size={19} />
                            </button>
                        </div>
                        <div className="space-y-4 px-6 py-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Nama Principal
                                    <span className="text-red-500">
                                        {" "}
                                        *
                                    </span>
                                </label>

                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Contoh: PT ABC Indonesia"
                                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#010736] focus:ring-2 focus:ring-[#010736]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Brand
                                </label>

                                <input
                                    value={form.brand}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "brand",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Contoh: Huawei eKit"
                                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#010736] focus:ring-2 focus:ring-[#010736]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Address
                                </label>

                                <input
                                    value={form.address}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "address",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Contoh: Bandung"
                                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#010736] focus:ring-2 focus:ring-[#010736]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                    Website
                                </label>

                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) =>
                                        handleFormChange(
                                            "website",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://contoh.com"
                                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#010736] focus:ring-2 focus:ring-[#010736]/10"
                                />
                            </div>
                        </div>

                        
                        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
                            <button
                                onClick={() =>
                                    setShowAddModal(false)
                                }
                                disabled={submitting}
                                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-[#010736] hover:bg-[#010736] hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddPrincipal}
                                disabled={submitting}
                                className="rounded-xl bg-[#010736] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#02094d] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting
                                    ? "Saving..."
                                    : "Save Principal"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}