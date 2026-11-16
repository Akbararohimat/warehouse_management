"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  Building2,
  Layers3,
  Search,
  Plus,
  Eye,
  ImagePlus,
  ChevronDown,
  ChevronRight,
  X,
  Filter,
  ArrowLeftRight,
  ArrowLeft,
  Bell,
  Trash2,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";
const API_SERVER_URL = "http://localhost:5000";

type Product = {
  id: string;
  code: string;
  name: string;
  vendor: string;
  vendorContactId: string | null;
  companyId: string;
  category: string;
  brand: string;
  price: string;
  status: "Active" | "Inactive";
  images: {
    id: string;
    imageUrl: string;
  }[];
  description: string;
  specification: string;
  principals: {
    id: string;
    name: string;
  }[];
};

type Contact = {
  id: string;
  nama: string;
  perusahaan: string;
  telepon: string;
  email: string;
  companyId: string;
  productIds: string[];
};

type ApiProduct = {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  price: string | number;
  status: string;
  images?: {
    id: string;
    imageUrl: string;
  }[];
  description: string | null;
  specification: string | null;
  companyId: string;
  contactId: string | null;
  principalId: string | null;
  company?: {
    id: string;
    name: string;
  } | null;
  contact?: {
    id: string;
    name: string;
  } | null;
  principals?: {
    id: string;
    name: string;
  }[];
};

type ApiContact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  companyId: string;
  company?: {
    id: string;
    name: string;
  } | null;
  products?: {
    id: string;
  }[];
};

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Contact List",
    href: "/contact-list",
    icon: Users,
  },
  {
    label: "Product Item",
    href: "/products",
    icon: Package,
  },
  {
    label: "Vendor / Principal",
    href: "/principal",
    icon: Building2,
  },
  {
    label: "Product Solution",
    href: "/product-solution",
    icon: Layers3,
  },
];

function getImageUrl(imageUrl?: string) {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_SERVER_URL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
}

function formatPrice(price: string | number) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return `Rp ${price}`;
  }

  return `Rp ${numericPrice.toLocaleString("id-ID")}`;
}

function getNextProductCode(products: Product[]) {
  const numbers = products
    .map((product) => {
      const match = product.code.match(/^PRD-(\d+)$/);
      return match ? Number(match[1]) : 0;
    })
    .filter(Number.isFinite);

  const nextNumber =
    numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return `PRD-${String(nextNumber).padStart(3, "0")}`;
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
        onChange={(event) => onChange(event.target.value)}
        className="h-9 min-w-[155px] appearance-none rounded-md border border-slate-200 bg-white pl-3 pr-9 text-xs text-slate-600 outline-none transition focus:border-blue-400"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

function ProductComparisonCard({
  product,
}: {
  product: Product;
}) {
  const principalText =
    product.principals.length > 0
      ? product.principals.map((item) => item.name).join(", ")
      : "-";

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center gap-4 border-b border-slate-100 p-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          {product.images[0] ? (
            <img
              src={getImageUrl(product.images[0].imageUrl)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlus size={23} className="text-slate-300" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {product.code}
          </p>
          <h3 className="mt-1 text-sm font-bold text-[#172B4D]">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {product.brand || "-"}
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {[
          ["Perusahaan", product.vendor],
          ["Principal", principalText],
          ["Category", product.category],
          ["Brand", product.brand],
          ["Price", formatPrice(product.price)],
          ["Status", product.status],
        ].map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[115px_1fr] gap-3 px-5 py-3"
          >
            <p className="text-[11px] text-slate-400">{label}</p>
            <p className="break-words text-[11px] font-medium text-slate-700">
              {value || "-"}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 p-5">
        <p className="mb-2 text-[11px] font-semibold text-[#172B4D]">
          Description
        </p>
        <p className="whitespace-pre-wrap text-[11px] leading-5 text-slate-500">
          {product.description || "Tidak ada description."}
        </p>

        <p className="mb-2 mt-5 text-[11px] font-semibold text-[#172B4D]">
          Specification
        </p>
        <p className="whitespace-pre-wrap text-[11px] leading-5 text-slate-500">
          {product.specification || "Tidak ada specification."}
        </p>
      </div>
    </article>
  );
}

function ComparisonView({
  products,
  onClose,
}: {
  products: Product[];
  onClose: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#F3F6FB]">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            aria-label="Kembali ke Product Item"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <p className="text-[10px] text-slate-400">
              Workspace / Product Item / Comparison
            </p>
            <h1 className="text-sm font-bold text-[#172B4D]">
              Product Comparison
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <X size={14} />
          Close
        </button>
      </header>

      <div className="mx-auto max-w-[1500px] p-6 lg:p-8">
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">
            Product Analysis
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#172B4D]">
            Compare Products
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Bandingkan informasi produk yang telah dipilih.
          </p>
        </div>

        {products.length < 2 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <Package size={28} className="mx-auto text-slate-300" />
            <p className="mt-3 text-sm font-semibold text-[#172B4D]">
              Minimal 2 product diperlukan
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Kembali ke Product List
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 gap-5 ${
              products.length === 2
                ? "lg:grid-cols-2"
                : products.length === 3
                  ? "xl:grid-cols-3"
                  : "xl:grid-cols-2"
            }`}
          >
            {products.map((product) => (
              <ProductComparisonCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState("All Perusahaan");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [products, setProducts] = useState<Product[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const [productName, setProductName] = useState("");
  const [vendorContactId, setVendorContactId] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, contactsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/contacts`),
      ]);

      if (!productsResponse.ok) {
        throw new Error("Gagal mengambil data product");
      }

      if (!contactsResponse.ok) {
        throw new Error("Gagal mengambil data contact");
      }

      const productsResult = await productsResponse.json();
      const contactsResult = await contactsResponse.json();

      if (!productsResult.success) {
        throw new Error(
          productsResult.message || "Gagal mengambil data product"
        );
      }

      if (!contactsResult.success) {
        throw new Error(
          contactsResult.message || "Gagal mengambil data contact"
        );
      }

      const mappedProducts: Product[] = (
        productsResult.data as ApiProduct[]
      ).map((product) => ({
        id: product.id,
        code: product.code,
        name: product.name,
        vendor: product.company?.name ?? "-",
        vendorContactId: product.contactId,
        companyId: product.companyId,
        category: product.category,
        brand: product.brand,
        price: String(product.price),
        status: product.status === "ACTIVE" ? "Active" : "Inactive",
        images: product.images ?? [],
        description: product.description ?? "",
        specification: product.specification ?? "",
        principals: product.principals ?? [],
      }));

      const mappedContacts: Contact[] = (
        contactsResult.data as ApiContact[]
      ).map((contact) => ({
        id: contact.id,
        nama: contact.name,
        perusahaan: contact.company?.name ?? "-",
        telepon: contact.phone,
        email: contact.email,
        companyId: contact.companyId,
        productIds: contact.products?.map((product) => product.id) ?? [],
      }));

      setProducts(mappedProducts);
      setContacts(mappedContacts);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const vendors = useMemo(
    () => [
      "All Perusahaan",
      ...Array.from(
        new Set(products.map((product) => product.vendor).filter(Boolean))
      ),
    ],
    [products]
  );

  const categories = useMemo(
    () => [
      "All Categories",
      ...Array.from(
        new Set(products.map((product) => product.category).filter(Boolean))
      ),
    ],
    [products]
  );

  const statuses = useMemo(
    () => [
      "All Status",
      ...Array.from(new Set(products.map((product) => product.status))),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.code.toLowerCase().includes(keyword) ||
        product.vendor.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword) ||
        product.specification.toLowerCase().includes(keyword) ||
        product.principals.some((principal) =>
          principal.name.toLowerCase().includes(keyword)
        );

      const matchesVendor =
        vendorFilter === "All Perusahaan" ||
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
  }, [products, search, vendorFilter, categoryFilter, statusFilter]);

  const comparisonProducts = selectedProducts
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  const activeProducts = products.filter(
    (product) => product.status === "Active"
  ).length;

  const inactiveProducts = products.filter(
    (product) => product.status === "Inactive"
  ).length;

  const openAddProduct = () => {
    setError("");
    setShowAddProduct(true);
  };

  const handleComparisonButton = () => {
    if (!comparisonMode) {
      setSelectedProducts([]);
      setShowComparison(false);
      setComparisonMode(true);
      return;
    }

    if (selectedProducts.length >= 2) {
      setShowComparison(true);
      return;
    }

    setSelectedProducts([]);
    setComparisonMode(false);
    setShowComparison(false);
  };

  const closeComparison = () => {
    setShowComparison(false);
    setSelectedProducts([]);
    setComparisonMode(false);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      if (current.length >= 4) {
        return current;
      }

      return [...current, productId];
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFile = files.find(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      setError("File gambar harus berupa JPG, PNG, atau WEBP");
      event.target.value = "";
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      setError("Ukuran setiap gambar maksimal 5 MB");
      event.target.value = "";
      return;
    }

    if (files.length > 5) {
      setError("Product hanya boleh memiliki maksimal 5 gambar");
      event.target.value = "";
      return;
    }

    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    setError("");

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    const preview = imagePreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImageFiles((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );

    setImagePreviews((current) =>
      current.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const resetForm = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setProductName("");
    setVendorContactId(null);
    setCategory("");
    setBrand("");
    setPrice("");
    setImageFiles([]);
    setImagePreviews([]);
  };

  const closeModal = () => {
    if (saving) return;

    setShowAddProduct(false);
    resetForm();
  };

  const handleAddProduct = async () => {
    if (
      !productName.trim() ||
      vendorContactId === null ||
      !category.trim() ||
      !brand.trim() ||
      !price.trim()
    ) {
      return;
    }

    const selectedContact = contacts.find(
      (contact) => contact.id === vendorContactId
    );

    if (!selectedContact) {
      setError("Contact yang dipilih tidak ditemukan.");
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Price harus berupa angka yang valid.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: getNextProductCode(products),
          name: productName.trim(),
          category: category.trim(),
          brand: brand.trim(),
          price: numericPrice,
          companyId: selectedContact.companyId,
          contactId: selectedContact.id,
          status: "ACTIVE",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal menambahkan product");
      }

      const createdProductId = result.data.id;

      if (imageFiles.length > 0) {
        const formData = new FormData();

        imageFiles.forEach((file) => {
          formData.append("images", file);
        });

        const imageResponse = await fetch(
          `${API_BASE_URL}/products/${createdProductId}/images`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok || !imageResult.success) {
          throw new Error(
            imageResult.message ||
              "Product berhasil dibuat, tetapi gambar gagal diupload."
          );
        }
      }

      await loadData();
      setShowAddProduct(false);
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menambahkan product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (showComparison) {
    return (
      <ComparisonView
        products={comparisonProducts}
        onClose={closeComparison}
      />
    );
  }

  return (
    <main className="flex min-h-screen bg-[#F3F6FB] text-[#172B4D]">
      {/* SIDEBAR */}
      <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col bg-[#0E1D38] text-white">
        <div className="px-5 pb-7 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
              <img
                src="/OIP.webp"
                alt="Comtronics Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h2 className="whitespace-nowrap text-[16px] font-bold tracking-tight">
                Dashboard RnD
              </h2>
              <p className="mt-1 text-[8px] font-medium tracking-[0.22em] text-slate-400">
                MANAGEMENT PORTAL
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1">
            <span className="h-[3px] w-3 rounded-full bg-blue-500" />
            <span className="h-[3px] w-3 rounded-full bg-yellow-400" />
            <span className="h-[3px] w-3 rounded-full bg-rose-400" />
          </div>
        </div>

        <div className="px-3">
          <p className="mb-3 px-2 text-[9px] font-semibold tracking-[0.18em] text-slate-500">
            WORKSPACE
          </p>

          <nav className="space-y-1">
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = href === "/products";

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex items-center gap-3 rounded-md px-3 py-3 text-xs transition ${
                    active
                      ? "bg-[#203B61] font-semibold text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active && (
                    <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-yellow-400" />
                  )}

                  <Icon size={17} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mx-5 mt-6 border-t border-white/10" />

        <div className="px-5 pt-5">
          <p className="text-[10px] font-medium text-slate-300">
            Data yang terhubung.
          </p>
          <p className="mt-1 text-[9px] leading-4 text-slate-500">
            Keputusan yang lebih baik.
          </p>
        </div>

        <div className="mt-auto px-2 pb-5">
          <div className="mb-4 rounded-lg bg-[#192E4C] p-3">
            <p className="text-[10px] font-semibold text-white">
              Satu portal, semua data.
            </p>
            <p className="mt-1 text-[9px] leading-4 text-slate-400">
              Kelola relasi dan katalog produk dalam satu tempat.
            </p>
          </div>

          <div className="border-t border-white/10 px-2 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-[#0E1D38]">
                RnD
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  RnD Workspace
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Management Portal
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="min-w-0 flex-1">
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-5 border-b border-slate-200 bg-white px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-3 text-[11px]">
            <span className="text-slate-400">Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-[#172B4D]">
              Product Item
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search product..."
                className="h-9 w-[220px] rounded-md border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300"
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((value) => !value)}
                aria-label="Notifications"
                className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100"
              >
                <Bell size={17} />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-11 z-50 w-64 rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
                  <p className="text-xs font-semibold text-[#172B4D]">
                    Notifications
                  </p>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Belum ada notifikasi.
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] p-5 lg:p-6 xl:p-8">
          {/* PAGE HEADING */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Workspace / Data Management
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#172B4D]">
                Product Item
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Kelola katalog produk, informasi, dan perbandingan produk.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleComparisonButton}
                disabled={comparisonMode && selectedProducts.length < 2}
                className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition ${
                  comparisonMode && selectedProducts.length >= 2
                    ? "border-[#0E1D38] bg-[#0E1D38] text-white hover:bg-[#203B61]"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {comparisonMode ? (
                  <ArrowLeftRight size={14} />
                ) : (
                  <ArrowLeftRight size={14} />
                )}
                {comparisonMode &&
                selectedProducts.length >= 2
                  ? `Compare (${selectedProducts.length})`
                  : comparisonMode
                    ? `Selected ${selectedProducts.length}/4`
                    : "Comparison"}
              </button>

              <button
                type="button"
                onClick={openAddProduct}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                <Plus size={15} />
                Add Product
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#EEF4FF] text-blue-600">
                <Package size={17} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Total Product</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-[#172B4D]">
                  {loading ? "—" : products.length.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                <Package size={17} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Active Product</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-[#172B4D]">
                  {loading ? "—" : activeProducts.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-rose-50 text-rose-600">
                <Package size={17} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Inactive Product</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-[#172B4D]">
                  {loading ? "—" : inactiveProducts.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* COMPARISON MODE INFO */}
          {comparisonMode && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-[#172B4D]">
                  Comparison mode aktif
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Pilih minimal 2 dan maksimal 4 produk untuk dibandingkan.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-md bg-white px-3 py-1.5 text-[10px] font-semibold text-blue-700">
                  {selectedProducts.length}/4 selected
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setComparisonMode(false);
                    setSelectedProducts([]);
                  }}
                  className="text-[10px] font-semibold text-slate-500 hover:text-rose-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* PRODUCT TABLE */}
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-[#172B4D]">
                  Product List
                </h2>
                <p className="mt-1 text-[11px] text-slate-400">
                  Daftar produk yang tersimpan di sistem.
                </p>
              </div>

              <p className="text-[10px] text-slate-400">
                Menampilkan{" "}
                <span className="font-semibold text-slate-600">
                  {filteredProducts.length}
                </span>{" "}
                dari {products.length} product
              </p>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-[#FBFCFE] px-5 py-4">
              <div className="relative min-w-[220px] flex-1 md:hidden">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari product..."
                  className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-blue-300"
                />
              </div>

              <div className="relative">
                <Building2
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <div className="pl-8">
                  <FilterSelect
                    value={vendorFilter}
                    onChange={setVendorFilter}
                    options={vendors}
                  />
                </div>
              </div>

              <div className="relative">
                <Filter
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <div className="pl-8">
                  <FilterSelect
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    options={categories}
                  />
                </div>
              </div>

              <FilterSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={statuses}
              />

              {(search ||
                vendorFilter !== "All Perusahaan" ||
                categoryFilter !== "All Categories" ||
                statusFilter !== "All Status") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setVendorFilter("All Perusahaan");
                    setCategoryFilter("All Categories");
                    setStatusFilter("All Status");
                  }}
                  className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-slate-500 hover:bg-slate-100"
                >
                  <X size={13} />
                  Reset
                </button>
              )}
            </div>

            {error && !showAddProduct && (
              <div className="flex items-center justify-between gap-3 border-b border-rose-100 bg-rose-50 px-5 py-3">
                <p className="text-xs text-rose-600">{error}</p>
                <button
                  type="button"
                  onClick={loadData}
                  className="text-xs font-semibold text-rose-700 underline"
                >
                  Coba lagi
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="bg-white text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {comparisonMode && (
                      <th className="w-12 px-4 py-3.5 text-center">
                        Select
                      </th>
                    )}
                    <th className="w-[75px] px-5 py-3.5">Photo</th>
                    <th className="px-5 py-3.5">Product</th>
                    <th className="px-5 py-3.5">Perusahaan</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Brand</th>
                    <th className="px-5 py-3.5">Price</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={comparisonMode ? 9 : 8}
                        className="h-48 text-center text-xs text-slate-400"
                      >
                        <Package
                          size={24}
                          className="mx-auto mb-3 animate-pulse text-slate-300"
                        />
                        Memuat data product...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={comparisonMode ? 9 : 8}
                        className="h-56 px-5 text-center"
                      >
                        <div className="mx-auto flex max-w-xs flex-col items-center">
                          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                            <Package size={20} />
                          </span>
                          <p className="mt-3 text-sm font-semibold text-[#172B4D]">
                            {products.length === 0
                              ? "Belum ada product"
                              : "Product tidak ditemukan"}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {products.length === 0
                              ? "Tambahkan product untuk mulai mengelola katalog."
                              : "Coba ubah kata kunci pencarian atau filter."}
                          </p>
                          {products.length === 0 && (
                            <button
                              type="button"
                              onClick={openAddProduct}
                              className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              <Plus size={14} />
                              Add Product
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => {
                      const selected = selectedProducts.includes(product.id);

                      return (
                        <tr
                          key={product.id}
                          className={`group border-t border-slate-100 transition hover:bg-[#F8FAFD] ${
                            selected ? "bg-blue-50/60" : ""
                          }`}
                        >
                          {comparisonMode && (
                            <td className="px-4 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() =>
                                  toggleProductSelection(product.id)
                                }
                                disabled={
                                  !selected && selectedProducts.length >= 4
                                }
                                aria-label={`Pilih ${product.name} untuk comparison`}
                                className="h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                              />
                            </td>
                          )}

                          <td className="px-5 py-3.5">
                            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                              {product.images[0] ? (
                                <img
                                  src={getImageUrl(
                                    product.images[0].imageUrl
                                  )}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImagePlus
                                  size={17}
                                  className="text-slate-300"
                                />
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-3.5">
                            <p className="max-w-[230px] truncate text-xs font-semibold text-[#172B4D]">
                              {product.name}
                            </p>
                            <p className="mt-1 text-[10px] text-slate-400">
                              {product.code}
                            </p>
                          </td>

                          <td className="px-5 py-3.5 text-xs text-slate-600">
                            {product.vendor}
                          </td>

                          <td className="px-5 py-3.5 text-xs text-slate-600">
                            {product.category || "-"}
                          </td>

                          <td className="px-5 py-3.5 text-xs font-medium text-slate-700">
                            {product.brand || "-"}
                          </td>

                          <td className="whitespace-nowrap px-5 py-3.5 text-xs text-slate-600">
                            {formatPrice(product.price)}
                          </td>

                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${
                                product.status === "Active"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  product.status === "Active"
                                    ? "bg-emerald-500"
                                    : "bg-rose-500"
                                }`}
                              />
                              {product.status}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-5 py-3.5 text-right">
                            <Link
                              href={`/products/${product.id}`}
                              className="inline-flex h-8 items-center gap-2 rounded-md border border-slate-200 px-3 text-[10px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye size={13} />
                              Detail
                              <ChevronRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-[#FBFCFE] px-5 py-3">
              <p className="text-[10px] text-slate-400">
                Data product terhubung dengan perusahaan dan contact.
              </p>
              <p className="text-[10px] font-medium text-slate-500">
                {filteredProducts.length} data ditampilkan
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* ADD PRODUCT MODAL */}
      {showAddProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/40 p-4"
          onClick={closeModal}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-600">
                  Product Management
                </p>
                <h2 className="mt-1 text-base font-bold text-[#172B4D]">
                  Add Product
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Tambahkan informasi produk baru ke katalog.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {error && (
                <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
                  {error}
                </div>
              )}

              <div>
                <h3 className="mb-3 text-xs font-bold text-[#172B4D]">
                  Product Photo
                </h3>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="group relative aspect-square overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={preview}
                        alt={`Product preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Hapus gambar ${index + 1}`}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 text-white transition hover:bg-rose-600"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}

                  {imageFiles.length < 5 && (
                    <label
                      htmlFor="product-image"
                      className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-[#FBFCFE] text-slate-400 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <ImagePlus size={22} />
                      <span className="mt-2 text-[10px] font-medium">
                        Upload Photo
                      </span>
                    </label>
                  )}
                </div>

                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

                <p className="mt-2 text-[10px] text-slate-400">
                  JPG, PNG, WEBP. Maksimal 5 gambar, masing-masing 5 MB.
                  <span className="ml-1 font-semibold text-slate-500">
                    {imageFiles.length}/5
                  </span>
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="mb-4 text-xs font-bold text-[#172B4D]">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                      Product Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(event) =>
                        setProductName(event.target.value)
                      }
                      placeholder="Contoh: Huawei Router AX3"
                      className="h-10 w-full rounded-md border border-slate-200 px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                      Contact / Perusahaan{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={vendorContactId ?? ""}
                        onChange={(event) =>
                          setVendorContactId(
                            event.target.value || null
                          )
                        }
                        className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-8 text-xs text-slate-700 outline-none focus:border-blue-400"
                      >
                        <option value="">Pilih contact</option>
                        {contacts.map((contact) => (
                          <option
                            key={contact.id}
                            value={contact.id}
                          >
                            {contact.nama} — {contact.perusahaan}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                    {contacts.length === 0 && (
                      <p className="mt-1.5 text-[10px] text-rose-500">
                        Belum ada contact. Tambahkan contact terlebih dahulu.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      placeholder="Contoh: Network"
                      className="h-10 w-full rounded-md border border-slate-200 px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                      Brand <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(event) => setBrand(event.target.value)}
                      placeholder="Contoh: Mikrotik"
                      className="h-10 w-full rounded-md border border-slate-200 px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold text-slate-600">
                      Price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                        Rp
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        placeholder="150000"
                        className="h-10 w-full rounded-md border border-slate-200 pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400">
                <span className="text-rose-500">*</span> Wajib diisi.
                Product akan otomatis disimpan dengan status Active.
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-white px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="h-9 rounded-md border border-slate-200 px-4 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddProduct}
                disabled={
                  saving ||
                  !productName.trim() ||
                  vendorContactId === null ||
                  !category.trim() ||
                  !brand.trim() ||
                  !price.trim() ||
                  contacts.length === 0
                }
                className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Plus size={14} />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}