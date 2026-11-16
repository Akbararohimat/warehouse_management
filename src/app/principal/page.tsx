
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
    Package,
    Bell,
    Eye,
    ArrowRight,
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
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

    const [form, setForm] = useState<PrincipalForm>({
        name: "",
        phone: "",
        brand: "",
        address: "",
        website: "",
    })

    async function fetchCompanies() {
        try {
            setLoading(true)
            setError("")

            const response = await fetch(`${API_URL}/companies`)
            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengambil data Principal")
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
                    company.brands?.map((brand) => brand.name).join(" ") ?? ""

                return (
                    company.name.toLowerCase().includes(keyword) ||
                    company.email?.toLowerCase().includes(keyword) ||
                    company.phone?.toLowerCase().includes(keyword) ||
                    company.address?.toLowerCase().includes(keyword) ||
                    brandValue.toLowerCase().includes(keyword)
                )
            })
    }, [companies, search])

    const totalBrands = useMemo(
        () =>
            companies
                .filter((company) => company.type === "PRINCIPAL")
                .reduce(
                    (total, company) => total + (company.brands?.length ?? 0),
                    0
                ),
        [companies]
    )

    const totalProducts = useMemo(
        () =>
            companies
                .filter((company) => company.type === "PRINCIPAL")
                .reduce(
                    (total, company) => total + (company._count?.products ?? 0),
                    0
                ),
        [companies]
    )

    const principalCount = companies.filter(
        (company) => company.type === "PRINCIPAL"
    ).length

    function handleFormChange(field: keyof PrincipalForm, value: string) {
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
                    brands: form.brand.trim() ? [form.brand.trim()] : [],
                    address: form.address.trim() || null,
                    website: form.website.trim() || null,
                }),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal menambahkan Principal")
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
        const confirmed = window.confirm(`Hapus Principal "${company.name}"?`)

        if (!confirmed) return

        try {
            setDeleteLoading(company.id)

            const response = await fetch(
                `${API_URL}/companies/${company.id}`,
                { method: "DELETE" }
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal menghapus Principal")
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
        <main className="flex min-h-screen bg-[#F3F6FC] text-[#102B50]">

            {/* SIDEBAR */}
            <aside className="flex w-[250px] shrink-0 flex-col bg-[#0E1D38] px-2.5 py-5 text-white">

                <div className="mb-4 flex items-center gap-2.5 px-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
                        <img
                            src="/OIP.webp"
                            alt="Comtronics Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <div className="min-w-0">
                        <h2 className="whitespace-nowrap text-[15px] font-bold tracking-tight">
                            Dashboard RnD
                        </h2>
                        <p className="mt-0.5 text-[9px] tracking-[1.5px] text-[#91A7C8]">
                            MANAGEMENT PORTAL
                        </p>
                    </div>
                </div>

                <div className="mb-6 flex items-center gap-1.5 px-2">
                    <span className="h-[3px] w-3.5 rounded-full bg-[#2878FF]" />
                    <span className="h-[3px] w-3.5 rounded-full bg-[#FFD43B]" />
                    <span className="h-[3px] w-3.5 rounded-full bg-[#F05A75]" />
                </div>

                <p className="mb-2.5 px-2 text-[10px] font-semibold tracking-[1.5px] text-[#7188AB]">
                    WORKSPACE
                </p>

                <nav className="space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex h-10 items-center gap-3 rounded-md px-3 text-[13px] text-[#D2DCEC] transition hover:bg-[#1C3558]"
                    >
                        <LayoutDashboard size={17} />
                        Dashboard
                    </Link>

                    <Link
                        href="/contact-list"
                        className="flex h-10 items-center gap-3 rounded-md px-3 text-[13px] text-[#D2DCEC] transition hover:bg-[#1C3558]"
                    >
                        <Users size={17} />
                        Contact List
                    </Link>

                    <Link
                        href="/products"
                        className="flex h-10 items-center gap-3 rounded-md px-3 text-[13px] text-[#D2DCEC] transition hover:bg-[#1C3558]"
                    >
                        <Package size={17} />
                        Product Item
                    </Link>

                    <Link
                        href="/principal"
                        className="relative flex h-10 items-center gap-3 rounded-md bg-[#203C62] px-3 text-[13px] font-semibold text-white"
                    >
                        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#FFD43B]" />
                        <Building2 size={17} />
                        Vendor/Principal
                    </Link>

                    <Link
                        href="/product-solution"
                        className="flex h-10 items-center gap-3 rounded-md px-3 text-[13px] text-[#D2DCEC] transition hover:bg-[#1C3558]"
                    >
                        <Package size={17} />
                        Product Solution
                    </Link>
                </nav>

                <div className="mx-2 mb-4 mt-6 border-t border-[#263956] pt-5">
                    <p className="text-[11px] font-medium text-[#DCE7F8]">
                        Data yang terhubung
                    </p>
                    <p className="mt-1.5 text-[10px] leading-4 text-[#7188AB]">
                        Keputusan yang lebih baik.
                    </p>
                </div>

                <div className="mx-1 mb-4 rounded-lg bg-[#1A3152] px-3 py-3">
                    <p className="text-[11px] font-semibold text-white">
                        Satu portal, semua data.
                    </p>
                    <p className="mt-1.5 text-[10px] leading-4 text-[#9DB1CE]">
                        Kelola relasi dan katalog produk dalam satu tempat.
                    </p>
                </div>

                <div className="mt-auto border-t border-[#263956] pt-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="w-full rounded-lg outline-none">
                            <div className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2 text-left transition hover:bg-white/5">
                                <Avatar className="h-9 w-9 border border-white/70">
                                    <AvatarFallback className="bg-[#202A3A] text-sm text-white">
                                        N
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1">
                                    <p className="text-[12px] font-semibold text-white">
                                        RnD Workspace
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-[#91A7C8]">
                                        Management Portal
                                    </p>
                                </div>

                                <ChevronDown size={15} className="text-[#91A7C8]" />
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

            {/* MAIN AREA */}
            <section className="min-w-0 flex-1">

                {/* TOPBAR */}
                <header className="flex h-16 items-center justify-between border-b border-[#E4EAF3] bg-white px-7">
                    <div className="flex items-center gap-3 text-[12px]">
                        <span className="text-[#8B9DB9]">Workspace</span>
                        <span className="text-[#B7C4D7]">/</span>
                        <span className="font-semibold text-[#102B50]">
                            Vendor/Principal
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#91A5C3]"
                            />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search principal..."
                                className="h-9 w-[230px] rounded-lg border border-[#DCE5F1] bg-white pl-9 pr-3 text-[11px] text-[#243D5E] outline-none placeholder:text-[#91A5C3] focus:border-[#2864FF] focus:ring-2 focus:ring-[#2864FF]/10"
                            />
                        </div>

                        <button
                            type="button"
                            aria-label="Notifications"
                            className="flex h-9 w-8 items-center justify-center text-[#647C9D] transition hover:text-[#2161F5]"
                        >
                            <Bell size={17} />
                        </button>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <div className="p-7">

                    {/* PAGE TITLE */}
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <p className="mb-2 text-[10px] font-semibold tracking-[1.5px] text-[#2864FF]">
                                WORKSPACE / DATA MANAGEMENT
                            </p>

                            <h1 className="text-[24px] font-bold tracking-tight text-[#102B50]">
                                Vendor / Principal
                            </h1>

                            <p className="mt-1 text-[12px] text-[#8296B4]">
                                Kelola informasi perusahaan Principal dan brand.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                resetForm()
                                setShowAddModal(true)
                            }}
                            className="flex h-9 shrink-0 items-center gap-2 rounded-lg bg-[#2161F5] px-4 text-[12px] font-semibold text-white transition hover:bg-[#174FDC]"
                        >
                            <Plus size={16} />
                            Add Principal
                        </button>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="mb-5 grid grid-cols-3 gap-4">
                        <div className="flex h-[82px] items-center gap-3 rounded-lg border border-[#DFE7F2] bg-white px-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#2161F5]">
                                <Building2 size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#8296B4]">
                                    Total Principal
                                </p>
                                <p className="mt-0.5 text-[21px] font-bold text-[#102B50]">
                                    {loading ? "—" : principalCount}
                                </p>
                            </div>
                        </div>

                        <div className="flex h-[82px] items-center gap-3 rounded-lg border border-[#DFE7F2] bg-white px-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E9FBF3] text-[#00A878]">
                                <Package size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#8296B4]">
                                    Total Brand
                                </p>
                                <p className="mt-0.5 text-[21px] font-bold text-[#102B50]">
                                    {loading ? "—" : totalBrands}
                                </p>
                            </div>
                        </div>

                        <div className="flex h-[82px] items-center gap-3 rounded-lg border border-[#DFE7F2] bg-white px-4">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF0F2] text-[#F04465]">
                                <Package size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] text-[#8296B4]">
                                    Connected Products
                                </p>
                                <p className="mt-0.5 text-[21px] font-bold text-[#102B50]">
                                    {loading ? "—" : totalProducts}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* PRINCIPAL TABLE */}
                    <div className="overflow-hidden rounded-lg border border-[#DFE7F2] bg-white">

                        <div className="flex items-center justify-between border-b border-[#EDF1F7] px-5 py-4">
                            <div>
                                <h2 className="text-[14px] font-semibold text-[#102B50]">
                                    Principal List
                                </h2>
                                <p className="mt-1 text-[11px] text-[#91A5C3]">
                                    Daftar perusahaan Principal yang tersimpan di sistem.
                                </p>
                            </div>

                            <p className="text-[10px] text-[#91A5C3]">
                                Menampilkan{" "}
                                <span className="font-semibold text-[#526B8C]">
                                    {principals.length}
                                </span>{" "}
                                dari{" "}
                                <span className="font-semibold text-[#526B8C]">
                                    {principalCount}
                                </span>{" "}
                                principal
                            </p>
                        </div>

                        {error ? (
                            <div className="p-8 text-center">
                                <p className="text-[12px] text-red-600">{error}</p>
                                <button
                                    onClick={fetchCompanies}
                                    className="mt-3 text-[11px] font-semibold text-[#2161F5] hover:underline"
                                >
                                    Coba lagi
                                </button>
                            </div>
                        ) : loading ? (
                            <div className="flex min-h-[240px] items-center justify-center">
                                <p className="text-[12px] text-[#8296B4]">
                                    Memuat data Principal...
                                </p>
                            </div>
                        ) : principals.length === 0 ? (
                            <div className="flex min-h-[240px] flex-col items-center justify-center px-5 text-center">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#EEF4FF] text-[#2161F5]">
                                    <Building2 size={22} />
                                </div>

                                <h3 className="text-[14px] font-semibold text-[#102B50]">
                                    {search
                                        ? "Principal tidak ditemukan"
                                        : "Belum ada Principal"}
                                </h3>

                                <p className="mt-1.5 max-w-sm text-[11px] leading-5 text-[#91A5C3]">
                                    {search
                                        ? "Coba gunakan kata kunci pencarian yang berbeda."
                                        : "Tambahkan Principal untuk mulai mengelola perusahaan dan brand."}
                                </p>

                                {!search && (
                                    <button
                                        onClick={() => {
                                            resetForm()
                                            setShowAddModal(true)
                                        }}
                                        className="mt-4 flex h-8 items-center gap-2 rounded-lg bg-[#2161F5] px-3 text-[11px] font-semibold text-white transition hover:bg-[#174FDC]"
                                    >
                                        <Plus size={14} />
                                        Add Principal
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[820px] border-collapse text-left">
                                    <thead>
                                        <tr className="h-10 border-b border-[#EDF1F7] bg-[#FAFBFD]">
                                            <th className="px-5 text-[9px] font-semibold uppercase tracking-[1px] text-[#91A5C3]">
                                                Company
                                            </th>
                                            <th className="px-3 text-[9px] font-semibold uppercase tracking-[1px] text-[#91A5C3]">
                                                Brand
                                            </th>
                                            <th className="px-3 text-[9px] font-semibold uppercase tracking-[1px] text-[#91A5C3]">
                                                Address
                                            </th>
                                            <th className="px-3 text-[9px] font-semibold uppercase tracking-[1px] text-[#91A5C3]">
                                                Products
                                            </th>
                                            <th className="px-5 text-right text-[9px] font-semibold uppercase tracking-[1px] text-[#91A5C3]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {principals.map((principal) => (
                                            <tr
                                                key={principal.id}
                                                className="h-[68px] border-b border-[#EDF1F7] transition last:border-b-0 hover:bg-[#FAFBFE]"
                                            >
                                                <td className="px-5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DFE7F2] bg-[#F8FAFD] text-[#7189AC]">
                                                            <Building2 size={16} />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-[12px] font-semibold text-[#102B50]">
                                                                {principal.name}
                                                            </p>
                                                            <p className="mt-0.5 text-[10px] text-[#91A5C3]">
                                                                {principal.email || principal.phone || "Principal"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-3">
                                                    <div className="flex max-w-[200px] flex-wrap gap-1">
                                                        {principal.brands && principal.brands.length > 0 ? (
                                                            principal.brands.map((brand) => (
                                                                <span
                                                                    key={brand.id}
                                                                    className="rounded bg-[#EEF4FF] px-1.5 py-1 text-[9px] font-medium text-[#285BAA]"
                                                                >
                                                                    {brand.name}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-[11px] text-[#A2B1C6]">
                                                                —
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-3">
                                                    <span className="block max-w-[200px] truncate text-[11px] text-[#526B8C]">
                                                        {principal.address || "—"}
                                                    </span>
                                                </td>

                                                <td className="px-3">
                                                    <span className="text-[11px] text-[#526B8C]">
                                                        {principal._count?.products ?? 0}
                                                    </span>
                                                </td>

                                                <td className="px-5">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() =>
                                                                router.push(`/principal/${principal.id}`)
                                                            }
                                                            className="flex h-8 items-center gap-1.5 rounded-md border border-[#DFE7F2] bg-white px-2.5 text-[10px] font-medium text-[#526B8C] transition hover:border-[#2161F5] hover:text-[#2161F5]"
                                                        >
                                                            <Eye size={13} />
                                                            Detail
                                                            <ArrowRight size={11} />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDeletePrincipal(principal)
                                                            }
                                                            disabled={deleteLoading === principal.id}
                                                            title="Hapus Principal"
                                                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#DFE7F2] bg-white text-[#91A5C3] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && !error && principals.length > 0 && (
                            <div className="flex h-10 items-center justify-between border-t border-[#EDF1F7] px-5">
                                <p className="text-[10px] text-[#91A5C3]">
                                    Data principal terhubung dengan perusahaan dan contact.
                                </p>
                                <p className="text-[10px] text-[#526B8C]">
                                    {principals.length} data ditampilkan
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ADD PRINCIPAL MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E1D38]/40 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#DFE7F2] bg-white">

                        <div className="flex items-center justify-between border-b border-[#EDF1F7] px-5 py-4">
                            <div>
                                <h3 className="text-[14px] font-semibold text-[#102B50]">
                                    Add Principal
                                </h3>
                                <p className="mt-1 text-[11px] text-[#91A5C3]">
                                    Tambahkan data Principal baru.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowAddModal(false)}
                                disabled={submitting}
                                className="rounded-md p-1.5 text-[#91A5C3] transition hover:bg-[#F3F6FC] hover:text-[#102B50] disabled:opacity-50"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <div className="space-y-3.5 px-5 py-4">
                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold text-[#526B8C]">
                                    Nama Principal
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <input
                                    value={form.name}
                                    onChange={(e) =>
                                        handleFormChange("name", e.target.value)
                                    }
                                    placeholder="Contoh: PT ABC Indonesia"
                                    className="h-9 w-full rounded-lg border border-[#DFE7F2] px-3 text-[11px] text-[#102B50] outline-none placeholder:text-[#A2B1C6] focus:border-[#2161F5] focus:ring-2 focus:ring-[#2161F5]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold text-[#526B8C]">
                                    Brand
                                </label>
                                <input
                                    value={form.brand}
                                    onChange={(e) =>
                                        handleFormChange("brand", e.target.value)
                                    }
                                    placeholder="Contoh: Huawei eKit"
                                    className="h-9 w-full rounded-lg border border-[#DFE7F2] px-3 text-[11px] text-[#102B50] outline-none placeholder:text-[#A2B1C6] focus:border-[#2161F5] focus:ring-2 focus:ring-[#2161F5]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold text-[#526B8C]">
                                    Address
                                </label>
                                <input
                                    value={form.address}
                                    onChange={(e) =>
                                        handleFormChange("address", e.target.value)
                                    }
                                    placeholder="Contoh: Bandung"
                                    className="h-9 w-full rounded-lg border border-[#DFE7F2] px-3 text-[11px] text-[#102B50] outline-none placeholder:text-[#A2B1C6] focus:border-[#2161F5] focus:ring-2 focus:ring-[#2161F5]/10"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-[11px] font-semibold text-[#526B8C]">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) =>
                                        handleFormChange("website", e.target.value)
                                    }
                                    placeholder="https://contoh.com"
                                    className="h-9 w-full rounded-lg border border-[#DFE7F2] px-3 text-[11px] text-[#102B50] outline-none placeholder:text-[#A2B1C6] focus:border-[#2161F5] focus:ring-2 focus:ring-[#2161F5]/10"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-[#EDF1F7] px-5 py-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                disabled={submitting}
                                className="h-8 rounded-lg border border-[#DFE7F2] px-3.5 text-[11px] font-medium text-[#526B8C] transition hover:bg-[#F3F6FC] disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleAddPrincipal}
                                disabled={submitting}
                                className="h-8 rounded-lg bg-[#2161F5] px-4 text-[11px] font-semibold text-white transition hover:bg-[#174FDC] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? "Saving..." : "Save Principal"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
