"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    UserRound,
    LogOut,
    ChevronDown,
    Building2,
    Phone,
    Mail,
    MapPin,
    Globe,
    Package,
    ArrowLeft,
    Tag,
    Plus,
    X,
    Loader2,
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

type Contact = {
    id: string
    name?: string | null
    phone?: string | null
    email?: string | null
    position?: string | null
}

type Product = {
    id: string
    name?: string | null
    brand?: string | null
    category?: string | null
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
    description?: string | null
    brands?: Brand[]
    contacts?: Contact[]
    products?: Product[]
    _count?: {
        contacts: number
        products: number
    }
}

export default function PrincipalDetailPage() {
    const router = useRouter()
    const params = useParams()

    const principalId = params.id as string

    const [principal, setPrincipal] = useState<Company | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [brandInput, setBrandInput] = useState("")
    const [addingBrand, setAddingBrand] = useState(false)
    const [removingBrandId, setRemovingBrandId] = useState<string | null>(
        null
    )

    async function fetchPrincipal() {
        try {
            setLoading(true)
            setError("")

            const response = await fetch(
                `${API_URL}/companies/${principalId}`
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                        "Gagal mengambil detail Principal"
                )
            }

            setPrincipal(result.data)
        } catch (err) {
            console.error(err)

            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal mengambil detail Principal"
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (principalId) {
            fetchPrincipal()
        }
    }, [principalId])

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
    }

    async function updateBrands(brands: string[]) {
        const response = await fetch(
            `${API_URL}/companies/${principalId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    brands,
                }),
            }
        )

        const result = await response.json()

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                    "Gagal memperbarui Brand"
            )
        }

        setPrincipal(result.data)
    }

    async function handleAddBrand() {
        if (!principal) return

        const newBrand = brandInput.trim()

        if (!newBrand) return

        const currentBrands = principal.brands ?? []

        const duplicate = currentBrands.some(
            (brand) =>
                brand.name.trim().toLowerCase() ===
                newBrand.toLowerCase()
        )

        if (duplicate) {
            alert("Brand tersebut sudah ada.")
            return
        }

        try {
            setAddingBrand(true)

            const brandNames = [
                ...currentBrands.map(
                    (brand) => brand.name
                ),
                newBrand,
            ]

            await updateBrands(brandNames)

            setBrandInput("")
        } catch (err) {
            console.error(err)

            alert(
                err instanceof Error
                    ? err.message
                    : "Gagal menambahkan Brand"
            )
        } finally {
            setAddingBrand(false)
        }
    }

    async function handleRemoveBrand(brandId: string) {
        if (!principal) return

        const currentBrands = principal.brands ?? []

        if (currentBrands.length <= 1) {
            alert(
                "Principal harus memiliki minimal satu Brand."
            )
            return
        }

        const selectedBrand = currentBrands.find(
            (brand) => brand.id === brandId
        )

        if (!selectedBrand) return

        const confirmed = window.confirm(
            `Hapus Brand "${selectedBrand.name}"?`
        )

        if (!confirmed) return

        try {
            setRemovingBrandId(brandId)

            const remainingBrands = currentBrands
                .filter(
                    (brand) => brand.id !== brandId
                )
                .map((brand) => brand.name)

            await updateBrands(remainingBrands)
        } catch (err) {
            console.error(err)

            alert(
                err instanceof Error
                    ? err.message
                    : "Gagal menghapus Brand"
            )
        } finally {
            setRemovingBrandId(null)
        }
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

                {/* DASHBOARD */}
                <Link
                    href="/dashboard"
                    className="group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>

                {/* CONTACT */}
                <Link
                    href="/contact-list"
                    className="group relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <Users size={18} />
                    Contact List
                </Link>

                {/* REQUEST SALES */}
                <Link
                    href="/request-sales"
                    className="group relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <FileText size={18} />
                    Request Sales
                </Link>

                {/* PRODUCT ITEM */}
                <Link
                    href="/products"
                    className="group relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <Package size={18} />
                    Product Item
                </Link>

                {/* VENDOR / PRINCIPAL ACTIVE */}
                <Link
                    href="/principal"
                    className="relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-yellow-400" />

                    <Building2 size={18} />
                    Vendor/Principal
                </Link>

                {/* PRODUCT SOLUTION */}
                <Link
                    href="/product-solution"
                    className="group relative mt-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-white transition-colors"
                >
                    <span className="absolute left-0 h-6 w-1 rounded-r-full bg-transparent group-hover:bg-yellow-400" />

                    <Package size={18} />
                    Product Solution
                </Link>

                {/* PROFILE */}
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

            {/* MAIN */}
            <section className="flex-1">
                {/* HEADER */}
                <header className="flex h-20 items-center justify-between border-b border-slate-200/70 bg-gradient-to-r from-white via-white to-slate-50 px-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-black">
                                Dashboard
                            </h1>

                            <span className="text-xl text-gray-400">
                                ›
                            </span>

                            <button
                                onClick={() =>
                                    router.push("/principal")
                                }
                                className="text-xl font-semibold text-black transition hover:text-[#010736]"
                            >
                                Principal
                            </button>

                            <span className="text-xl text-gray-400">
                                ›
                            </span>

                            <h2 className="text-xl font-semibold text-black">
                                Detail
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            Welcome to RnD Web Portal
                        </p>
                    </div>
                </header>

                <div className="p-8">
                    {/* BACK */}
                    <button
                        onClick={() =>
                            router.push("/principal")
                        }
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#010736]"
                    >
                        <ArrowLeft size={17} />
                        Kembali ke Principal
                    </button>

                    {/* ERROR */}
                    {error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* LOADING */}
                    {loading ? (
                        <div className="rounded-2xl bg-white p-12 text-center shadow-md">
                            <p className="text-sm text-gray-500">
                                Memuat detail Principal...
                            </p>
                        </div>
                    ) : principal ? (
                        <div className="space-y-5">
                            {/* COMPANY HEADER */}
                            <div className="rounded-2xl bg-white p-6 shadow-md">
                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#010736]/10">
                                            <Building2
                                                size={28}
                                                className="text-[#010736]"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate text-xl font-bold text-gray-900">
                                                {principal.name}
                                            </h3>

                                            <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#010736]">
                                                PRINCIPAL
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl bg-gray-100 px-4 py-2 text-center">
                                            <p className="text-xs text-gray-500">
                                                Contact
                                            </p>

                                            <p className="text-lg font-bold text-gray-900">
                                                {principal._count
                                                    ?.contacts ??
                                                    principal.contacts
                                                        ?.length ??
                                                    0}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-gray-100 px-4 py-2 text-center">
                                            <p className="text-xs text-gray-500">
                                                Product
                                            </p>

                                            <p className="text-lg font-bold text-gray-900">
                                                {principal._count
                                                    ?.products ??
                                                    principal.products
                                                        ?.length ??
                                                    0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* INFORMATION */}
                            <div className="grid gap-5 lg:grid-cols-2">
                                {/* COMPANY INFORMATION */}
                                <div className="rounded-2xl bg-white p-6 shadow-md">
                                    <h3 className="mb-5 text-lg font-semibold text-black">
                                        Informasi Principal
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Phone
                                                size={17}
                                                className="mt-0.5 text-gray-400"
                                            />

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Nomor Telepon
                                                </p>

                                                <p className="mt-0.5 text-sm text-gray-700">
                                                    {principal.phone ||
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Mail
                                                size={17}
                                                className="mt-0.5 text-gray-400"
                                            />

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Email
                                                </p>

                                                <p className="mt-0.5 text-sm text-gray-700">
                                                    {principal.email ||
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <MapPin
                                                size={17}
                                                className="mt-0.5 text-gray-400"
                                            />

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Address
                                                </p>

                                                <p className="mt-0.5 text-sm text-gray-700">
                                                    {principal.address ||
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Globe
                                                size={17}
                                                className="mt-0.5 text-gray-400"
                                            />

                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Website
                                                </p>

                                                <p className="mt-0.5 break-all text-sm text-gray-700">
                                                    {principal.website ||
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* BRAND */}
                                <div className="rounded-2xl bg-white p-6 shadow-md">
                                    <div className="mb-5 flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-black">
                                            Brand
                                        </h3>

                                        <Tag
                                            size={19}
                                            className="text-[#010736]"
                                        />
                                    </div>

                                    {/* ADD BRAND */}
                                    <div className="mb-4 flex gap-2">
                                        <input
                                            type="text"
                                            value={brandInput}
                                            onChange={(e) =>
                                                setBrandInput(
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key ===
                                                    "Enter"
                                                ) {
                                                    e.preventDefault()
                                                    handleAddBrand()
                                                }
                                            }}
                                            placeholder="Masukkan nama brand..."
                                            disabled={
                                                addingBrand
                                            }
                                            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#010736] focus:ring-2 focus:ring-[#010736]/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                handleAddBrand
                                            }
                                            disabled={
                                                addingBrand ||
                                                !brandInput.trim()
                                            }
                                            className="flex shrink-0 items-center justify-center rounded-xl bg-[#010736] px-3 py-2 text-white transition hover:bg-[#02094d] disabled:cursor-not-allowed disabled:opacity-50"
                                            title="Tambah Brand"
                                        >
                                            {addingBrand ? (
                                                <Loader2
                                                    size={17}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Plus size={17} />
                                            )}
                                        </button>
                                    </div>

                                    {principal.brands &&
                                    principal.brands.length >
                                        0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {principal.brands.map(
                                                (brand) => (
                                                    <div
                                                        key={
                                                            brand.id
                                                        }
                                                        className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2"
                                                    >
                                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#010736]/10">
                                                            <Tag
                                                                size={
                                                                    14
                                                                }
                                                                className="text-[#010736]"
                                                            />
                                                        </div>

                                                        <span className="text-sm font-medium text-[#010736]">
                                                            {
                                                                brand.name
                                                            }
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveBrand(
                                                                    brand.id
                                                                )
                                                            }
                                                            disabled={
                                                                removingBrandId !==
                                                                    null ||
                                                                (principal.brands?.length ??
                                                                    0) <=
                                                                    1
                                                            }
                                                            title={
                                                                (principal.brands?.length ??
                                                                    0) <=
                                                                1
                                                                    ? "Principal harus memiliki minimal satu Brand"
                                                                    : "Hapus Brand"
                                                            }
                                                            className="rounded-md p-1 text-gray-400 transition hover:bg-red-100 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                                                        >
                                                            {removingBrandId ===
                                                            brand.id ? (
                                                                <Loader2
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <X
                                                                    size={
                                                                        14
                                                                    }
                                                                />
                                                            )}
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl bg-gray-50 p-5 text-center">
                                            <p className="text-sm text-gray-400">
                                                Belum ada Brand
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* DESCRIPTION */}
                            {principal.description && (
                                <div className="rounded-2xl bg-white p-6 shadow-md">
                                    <h3 className="mb-3 text-lg font-semibold text-black">
                                        Description
                                    </h3>

                                    <p className="text-sm leading-6 text-gray-600">
                                        {
                                            principal.description
                                        }
                                    </p>
                                </div>
                            )}

                            {/* CONTACT */}
                            <div className="rounded-2xl bg-white p-6 shadow-md">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-black">
                                            Contact
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Contact yang terhubung
                                            dengan Principal
                                        </p>
                                    </div>

                                    <Users
                                        size={20}
                                        className="text-[#010736]"
                                    />
                                </div>

                                {principal.contacts &&
                                principal.contacts.length >
                                    0 ? (
                                    <div className="space-y-3">
                                        {principal.contacts.map(
                                            (contact) => (
                                                <div
                                                    key={
                                                        contact.id
                                                    }
                                                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#010736]/10">
                                                            <UserRound
                                                                size={
                                                                    16
                                                                }
                                                                className="text-[#010736]"
                                                            />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                                {contact.name ||
                                                                    "-"}
                                                            </p>

                                                            {contact.position && (
                                                                <p className="text-xs text-gray-500">
                                                                    {
                                                                        contact.position
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="hidden items-center gap-4 text-xs text-gray-500 md:flex">
                                                        {contact.phone && (
                                                            <span className="flex items-center gap-1.5">
                                                                <Phone
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                                {
                                                                    contact.phone
                                                                }
                                                            </span>
                                                        )}

                                                        {contact.email && (
                                                            <span className="flex items-center gap-1.5">
                                                                <Mail
                                                                    size={
                                                                        13
                                                                    }
                                                                />
                                                                {
                                                                    contact.email
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-xl bg-gray-50 p-8 text-center">
                                        <Users
                                            size={24}
                                            className="mx-auto mb-2 text-gray-300"
                                        />

                                        <p className="text-sm text-gray-400">
                                            Belum ada Contact
                                            yang terhubung
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* PRODUCTS */}
                            <div className="rounded-2xl bg-white p-6 shadow-md">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-black">
                                            Products
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Product yang terhubung
                                            dengan Principal
                                        </p>
                                    </div>

                                    <Package
                                        size={20}
                                        className="text-[#010736]"
                                    />
                                </div>

                                {principal.products &&
                                principal.products.length >
                                    0 ? (
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {principal.products.map(
                                            (product) => (
                                                <div
                                                    key={
                                                        product.id
                                                    }
                                                    className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                                                >
                                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#010736]/10">
                                                        <Package
                                                            size={
                                                                18
                                                            }
                                                            className="text-[#010736]"
                                                        />
                                                    </div>

                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                        {product.name ||
                                                            "-"}
                                                    </p>

                                                    {product.brand && (
                                                        <p className="mt-1 truncate text-xs text-gray-500">
                                                            {
                                                                product.brand
                                                            }
                                                        </p>
                                                    )}

                                                    {product.category && (
                                                        <span className="mt-2 inline-flex rounded-full bg-white px-2 py-1 text-[10px] text-gray-500">
                                                            {
                                                                product.category
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-xl bg-gray-50 p-8 text-center">
                                        <Package
                                            size={24}
                                            className="mx-auto mb-2 text-gray-300"
                                        />

                                        <p className="text-sm text-gray-400">
                                            Belum ada Product
                                            yang terhubung
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    )
}