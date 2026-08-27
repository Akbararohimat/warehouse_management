"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ChevronDown,
    Eye,
    ImagePlus,
    Package,
    Plus,
    Search,
    X,
} from "lucide-react";

type Product = {
    code: string;
    name: string;
    vendor: string;
    category: string;
    stock: number;
    status: "Active" | "Inactive";
    image: string;
};

const initialProducts: Product[] = [
    {
        code: "PRD-001",
        name: "Fiber Optic Cable 12 Core",
        vendor: "Vendor A",
        category: "Fiber Optic",
        stock: 28,
        status: "Active",
        image: "https://placehold.co/100x100?text=FO",
    },
    {
        code: "PRD-002",
        name: "Router Mikrotik",
        vendor: "Vendor B",
        category: "Network",
        stock: 15,
        status: "Active",
        image: "https://placehold.co/100x100?text=RT",
    },
    {
        code: "PRD-003",
        name: "Optical Distribution Box",
        vendor: "Vendor A",
        category: "Fiber Optic",
        stock: 8,
        status: "Active",
        image: "https://placehold.co/100x100?text=OD",
    },
    {
        code: "PRD-004",
        name: "Network Switch 24 Port",
        vendor: "Vendor C",
        category: "Network",
        stock: 12,
        status: "Inactive",
        image: "https://placehold.co/100x100?text=SW",
    },
];

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [vendorFilter, setVendorFilter] = useState("All Vendors");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const [products, setProducts] =
        useState<Product[]>(initialProducts);

    const [showAddProduct, setShowAddProduct] = useState(false);

    // FORM
    const [productName, setProductName] = useState("");
    const [vendor, setVendor] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [imageName, setImageName] = useState("");

    const vendors = useMemo(
        () => [
            "All Vendors",
            ...Array.from(
                new Set(products.map((product) => product.vendor))
            ),
        ],
        [products]
    );

    const categories = useMemo(
        () => [
            "All Categories",
            ...Array.from(
                new Set(products.map((product) => product.category))
            ),
        ],
        [products]
    );

    const statuses = useMemo(
        () => [
            "All Status",
            ...Array.from(
                new Set(products.map((product) => product.status))
            ),
        ],
        [products]
    );

    const filteredProducts = products.filter((product) => {
        const keyword = search.toLowerCase().trim();

        const matchesSearch =
            !keyword ||
            product.name.toLowerCase().includes(keyword) ||
            product.code.toLowerCase().includes(keyword) ||
            product.vendor.toLowerCase().includes(keyword) ||
            product.category.toLowerCase().includes(keyword);

        const matchesVendor =
            vendorFilter === "All Vendors" ||
            product.vendor === vendorFilter;

        const matchesCategory =
            categoryFilter === "All Categories" ||
            product.category === categoryFilter;

        const matchesStatus =
            statusFilter === "All Status" ||
            product.status === statusFilter;

        return (
            matchesSearch &&
            matchesVendor &&
            matchesCategory &&
            matchesStatus
        );
    });

    const handleImageChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setImage(previewUrl);
        setImageName(file.name);
    };

    const resetForm = () => {
        setProductName("");
        setVendor("");
        setCategory("");
        setStock("");
        setImage(null);
        setImageName("");
    };

    const closeModal = () => {
        setShowAddProduct(false);
        resetForm();
    };

    const handleAddProduct = () => {
        if (
            !productName.trim() ||
            !vendor.trim() ||
            !category.trim() ||
            !stock.trim()
        ) {
            return;
        }

        const newProduct: Product = {
            code: `PRD-${String(products.length + 1).padStart(
                3,
                "0"
            )}`,
            name: productName.trim(),
            vendor: vendor.trim(),
            category: category.trim(),
            stock: Number(stock),
            status: "Active",
            image:
                image ??
                "https://placehold.co/100x100?text=Product",
        };

        setProducts((currentProducts) => [
            ...currentProducts,
            newProduct,
        ]);

        closeModal();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-[#0D0628]"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>

                            <div>
                                <h1 className="text-xl font-semibold text-slate-900">
                                    Product List
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Manage products and product
                                    information
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setShowAddProduct(true)
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-[#0D0628] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A0D45]"
                        >
                            <Plus className="h-4 w-4" />
                            Add Product
                        </button>
                    </div>
                </div>
            </header>


            <main className="mx-auto max-w-7xl px-6 py-8">
               
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row">
                       
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search product, vendor, category..."
                                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
                            />
                        </div>

                        <FilterSelect
                            value={vendorFilter}
                            onChange={setVendorFilter}
                            options={vendors}
                        />

                        <FilterSelect
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            options={categories}
                        />

                        <FilterSelect
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statuses}
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-[#0D0628]" />

                            <h2 className="font-semibold text-slate-900">
                                Products
                            </h2>

                            <span className="rounded-full bg-[#0D0628]/10 px-2.5 py-1 text-xs font-medium text-[#0D0628]">
                                {filteredProducts.length}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="w-20 px-5 py-3 text-left font-medium text-slate-500">
                                        Photo
                                    </th>

                                    <th className="px-5 py-3 text-left font-medium text-slate-500">
                                        Product
                                    </th>

                                    <th className="px-5 py-3 text-left font-medium text-slate-500">
                                        Vendor
                                    </th>

                                    <th className="px-5 py-3 text-left font-medium text-slate-500">
                                        Category
                                    </th>

                                    <th className="px-5 py-3 text-left font-medium text-slate-500">
                                        Stock
                                    </th>

                                    <th className="px-5 py-3 text-left font-medium text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 text-right font-medium text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map(
                                        (product) => (
                                            <tr
                                                key={product.code}
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4">
                                                    <img
                                                        src={
                                                            product.image
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div>
                                                        <p className="font-medium text-slate-900">
                                                            {
                                                                product.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                product.code
                                                            }
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-slate-700">
                                                    {
                                                        product.vendor
                                                    }
                                                </td>

                                                <td className="px-5 py-4 text-slate-500">
                                                    {
                                                        product.category
                                                    }
                                                </td>

                                                <td className="px-5 py-4 font-medium text-slate-700">
                                                    {
                                                        product.stock
                                                    }
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                            product.status ===
                                                            "Active"
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : "bg-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        {
                                                            product.status
                                                        }
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <Link
                                                        href={`/products/${product.code}`}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-[#0D0628]/20 px-3 py-2 text-xs font-medium text-[#0D0628] transition hover:bg-[#0D0628] hover:text-white"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-12 text-center"
                                        >
                                            <Package className="mx-auto h-8 w-8 text-slate-300" />

                                            <p className="mt-3 text-sm font-medium text-slate-700">
                                                Product tidak
                                                ditemukan
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                Coba ubah search atau
                                                filter yang digunakan.
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {showAddProduct && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="text-xl font-semibold text-[#0D0628]">
                                    Add Product
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Tambahkan product baru ke
                                    Product List.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#0D0628]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Product Photo
                                    </label>

                                    <label
                                        htmlFor="product-image"
                                        className="group flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-[#0D0628] hover:bg-[#0D0628]/5"
                                    >
                                        {image ? (
                                            <img
                                                src={image}
                                                alt="Product preview"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <>
                                                <ImagePlus className="h-9 w-9 text-slate-400 transition group-hover:text-[#0D0628]" />

                                                <p className="mt-3 text-sm font-medium text-slate-600">
                                                    Upload Photo
                                                </p>

                                                <p className="mt-1 px-4 text-center text-xs text-slate-400">
                                                    PNG, JPG atau
                                                    JPEG
                                                </p>
                                            </>
                                        )}
                                    </label>

                                    <input
                                        id="product-image"
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="hidden"
                                    />

                                    {imageName && (
                                        <p className="mt-2 truncate text-xs text-slate-500">
                                            {imageName}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Product Name
                                        </label>

                                        <input
                                            type="text"
                                            value={productName}
                                            onChange={(e) =>
                                                setProductName(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Contoh: Huawei Router AX3"
                                            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Vendor
                                        </label>

                                        <input
                                            type="text"
                                            value={vendor}
                                            onChange={(e) =>
                                                setVendor(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Contoh: Huawei"
                                            className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Category
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    category
                                                }
                                                onChange={(e) =>
                                                    setCategory(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                placeholder="Contoh: Network"
                                                className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                                Stock
                                            </label>

                                            <input
                                                type="number"
                                                min="0"
                                                value={stock}
                                                onChange={(e) =>
                                                    setStock(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                placeholder="0"
                                                className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleAddProduct}
                                disabled={
                                    !productName.trim() ||
                                    !vendor.trim() ||
                                    !category.trim() ||
                                    !stock.trim()
                                }
                                className="rounded-lg bg-[#0D0628] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A0D45] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterSelect({
    value,
    onChange,
    options,
}: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="h-10 min-w-[160px] appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
            >
                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
    );
}