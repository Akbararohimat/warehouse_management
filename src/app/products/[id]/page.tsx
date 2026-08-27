import Link from "next/link";
import {
    ArrowLeft,
    Package,
    Building2,
    Tag,
    Boxes,
    CheckCircle2,
    FileText,
} from "lucide-react";

type Product = {
    code: string;
    name: string;
    vendor: string;
    category: string;
    stock: number;
    status: string;
    description: string;
    image: string;
    specifications: {
        label: string;
        value: string;
    }[];
};

const products: Product[] = [
    {
        code: "PRD-001",
        name: "Fiber Optic Cable 12 Core",
        vendor: "Vendor A",
        category: "Fiber Optic",
        stock: 28,
        status: "Active",
        description:
            "Fiber optic cable 12 core untuk kebutuhan jaringan dan instalasi komunikasi. Product digunakan untuk kebutuhan koneksi fiber optic dengan kapasitas tinggi.",
        image: "https://placehold.co/1200x800?text=Fiber+Optic+Cable",
        specifications: [
            {
                label: "Core",
                value: "12 Core",
            },
            {
                label: "Type",
                value: "Single Mode",
            },
            {
                label: "Cable Type",
                value: "Outdoor",
            },
            {
                label: "Length",
                value: "1000 Meter",
            },
            {
                label: "Jacket",
                value: "PE",
            },
        ],
    },

    {
        code: "PRD-002",
        name: "Router Mikrotik",
        vendor: "Vendor B",
        category: "Network",
        stock: 15,
        status: "Active",
        description:
            "Router Mikrotik untuk kebutuhan routing, network management, dan konektivitas jaringan perusahaan.",
        image: "https://placehold.co/1200x800?text=Router+Mikrotik",
        specifications: [
            {
                label: "Brand",
                value: "MikroTik",
            },
            {
                label: "Type",
                value: "Router",
            },
            {
                label: "Port",
                value: "10 Gigabit Ethernet",
            },
            {
                label: "Management",
                value: "RouterOS",
            },
            {
                label: "Usage",
                value: "Enterprise Network",
            },
        ],
    },

    {
        code: "PRD-003",
        name: "Optical Distribution Box",
        vendor: "Vendor A",
        category: "Fiber Optic",
        stock: 8,
        status: "Active",
        description:
            "Optical Distribution Box digunakan untuk terminasi dan distribusi kabel fiber optic pada jaringan.",
        image: "https://placehold.co/1200x800?text=Optical+Distribution+Box",
        specifications: [
            {
                label: "Capacity",
                value: "24 Core",
            },
            {
                label: "Material",
                value: "ABS",
            },
            {
                label: "Installation",
                value: "Wall Mount",
            },
            {
                label: "Protection",
                value: "IP65",
            },
            {
                label: "Application",
                value: "Fiber Optic Network",
            },
        ],
    },

    {
        code: "PRD-004",
        name: "Network Switch 24 Port",
        vendor: "Vendor C",
        category: "Network",
        stock: 12,
        status: "Inactive",
        description:
            "Network switch 24 port untuk kebutuhan distribusi jaringan dan konektivitas perangkat dalam satu jaringan lokal.",
        image: "https://placehold.co/1200x800?text=Network+Switch",
        specifications: [
            {
                label: "Port",
                value: "24 Port",
            },
            {
                label: "Port Type",
                value: "Gigabit Ethernet",
            },
            {
                label: "Management",
                value: "Managed",
            },
            {
                label: "Rack Mount",
                value: "Yes",
            },
            {
                label: "Application",
                value: "Enterprise Network",
            },
        ],
    },
];

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const product = products.find(
        (item) => item.code === id
    );

    if (!product) {
        return (
            <main className="min-h-screen bg-slate-50">
                <header className="border-b border-slate-200 bg-white">
                    <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
                        <Link
                            href="/products"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        <div className="ml-4">
                            <h1 className="text-xl font-semibold text-slate-900">
                                Product Detail
                            </h1>
                        </div>
                    </div>
                </header>

                <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-24">
                    <div className="text-center">
                        <Package className="mx-auto h-12 w-12 text-slate-300" />

                        <h2 className="mt-4 text-lg font-semibold text-slate-800">
                            Product tidak ditemukan
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Product yang kamu cari tidak tersedia.
                        </p>

                        <Link
                            href="/products"
                            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke Products
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            {/* HEADER */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        {/* BACK */}
                        <Link
                            href="/products"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            title="Back to Products"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>

                        <div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/products"
                                    className="text-sm text-slate-400 transition hover:text-slate-700"
                                >
                                    Products
                                </Link>

                                <span className="text-slate-300">
                                    /
                                </span>

                                <span className="text-sm font-medium text-slate-700">
                                    Product Detail
                                </span>
                            </div>

                            <h1 className="text-xl font-semibold text-slate-900">
                                {product.name}
                            </h1>
                        </div>
                    </div>

                    <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            product.status === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {product.status}
                    </span>
                </div>
            </header>

            {/* CONTENT */}
            <div className="mx-auto max-w-7xl px-6 py-8">
                {/* PRODUCT HERO */}
                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                    {/* IMAGE */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* BASIC INFO */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Product Information
                        </p>

                        <h2 className="mt-2 text-2xl font-bold text-slate-900">
                            {product.name}
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            {product.code}
                        </p>

                        <div className="my-6 border-t border-slate-100" />

                        {/* VENDOR */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                                <Building2 className="h-5 w-5 text-slate-600" />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Vendor
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {product.vendor}
                                </p>
                            </div>
                        </div>

                        {/* CATEGORY */}
                        <div className="mt-5 flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                                <Tag className="h-5 w-5 text-slate-600" />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Category
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {product.category}
                                </p>
                            </div>
                        </div>

                        {/* STOCK */}
                        <div className="mt-5 flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                                <Boxes className="h-5 w-5 text-slate-600" />
                            </div>

                            <div>
                                <p className="text-xs text-slate-400">
                                    Available Stock
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {product.stock} Unit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                <FileText className="h-5 w-5 text-slate-600" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Description
                                </h3>

                                <p className="text-xs text-slate-400">
                                    Informasi mengenai product
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-xl bg-slate-50 p-5">
                            <p className="text-sm leading-7 text-slate-600">
                                {product.description}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                <Package className="h-5 w-5 text-slate-600" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Specifications
                                </h3>

                                <p className="text-xs text-slate-400">
                                    Spesifikasi product
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 divide-y divide-slate-100">
                            {product.specifications.map(
                                (specification) => (
                                    <div
                                        key={specification.label}
                                        className="flex items-center justify-between gap-4 py-3"
                                    >
                                        <span className="text-sm text-slate-500">
                                            {specification.label}
                                        </span>

                                        <span className="text-right text-sm font-medium text-slate-800">
                                            {specification.value}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </section>
                </div>

                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle2
                                className={`h-5 w-5 ${
                                    product.status === "Active"
                                        ? "text-emerald-600"
                                        : "text-slate-400"
                                }`}
                            />

                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    Product Status
                                </p>

                                <p className="text-xs text-slate-400">
                                    Status product saat ini
                                </p>
                            </div>
                        </div>

                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                product.status === "Active"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                            }`}
                        >
                            {product.status}
                        </span>
                    </div>
                </section>

                {/* BACK */}
                <div className="mt-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Product List
                    </Link>
                </div>
            </div>
        </main>
    );
}