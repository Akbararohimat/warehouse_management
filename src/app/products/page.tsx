"use client";

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  Filter,
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

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] =
    useState("All Perusahaan");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [products, setProducts] =
    useState<Product[]>([]);

  const [contacts, setContacts] =
    useState<Contact[]>([]);

  const [hydrated, setHydrated] =
    useState(false);

  const [showAddProduct, setShowAddProduct] =
    useState(false);

  const [comparisonMode, setComparisonMode] =
    useState(false);

  const [showComparison, setShowComparison] =
    useState(false);

  const [selectedProducts, setSelectedProducts] =
    useState<string[]>([]);

  const [productName, setProductName] =
    useState("");

  const [vendor, setVendor] =
    useState("");

  const [vendorContactId, setVendorContactId] =
    useState<string | null>(null);

  const [category, setCategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [imageFiles, setImageFiles] =
    useState<File[]>([]);

  const [imagePreviews, setImagePreviews] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productsResponse,
        contactsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/contacts`),
      ]);

      if (!productsResponse.ok) {
        throw new Error(
          "Gagal mengambil data product"
        );
      }

      if (!contactsResponse.ok) {
        throw new Error(
          "Gagal mengambil data contact"
        );
      }

      const productsResult =
        await productsResponse.json();

      const contactsResult =
        await contactsResponse.json();

      if (!productsResult.success) {
        throw new Error(
          productsResult.message ||
            "Gagal mengambil data product"
        );
      }

      if (!contactsResult.success) {
        throw new Error(
          contactsResult.message ||
            "Gagal mengambil data contact"
        );
      }

      const mappedProducts: Product[] =
        (
          productsResult.data as ApiProduct[]
        ).map((product) => ({
          id: product.id,
          code: product.code,
          name: product.name,
          vendor:
            product.company?.name ?? "-",
          vendorContactId:
            product.contactId,
          companyId:
            product.companyId,
          category:
            product.category,
          brand:
            product.brand,
          price:
            String(product.price),
          status:
            product.status === "ACTIVE"
              ? "Active"
              : "Inactive",
          images:
            product.images ?? [],
          description:
            product.description ?? "",
          specification:
            product.specification ?? "",
          principals:
            product.principals ?? [],
        }));

      const mappedContacts: Contact[] =
        (
          contactsResult.data as ApiContact[]
        ).map((contact) => ({
          id: contact.id,
          nama: contact.name,
          perusahaan:
            contact.company?.name ?? "-",
          telepon:
            contact.phone,
          email:
            contact.email,
          companyId:
            contact.companyId,
          productIds:
            contact.products?.map(
              (product) => product.id
            ) ?? [],
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
      setHydrated(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddProduct = () => {
    setError("");
    setShowAddProduct(true);
  };

  const vendors = useMemo(
    () => [
      "All Perusahaan",
      ...Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.vendor
            )
            .filter(Boolean)
        )
      ),
    ],
    [products]
  );

  const categories = useMemo(
    () => [
      "All Categories",
      ...Array.from(
        new Set(
          products
            .map(
              (product) =>
                product.category
            )
            .filter(Boolean)
        )
      ),
    ],
    [products]
  );

  const statuses = useMemo(
    () => [
      "All Status",
      ...Array.from(
        new Set(
          products.map(
            (product) =>
              product.status
          )
        )
      ),
    ],
    [products]
  );

  const filteredProducts = products.filter(
    (product) => {
      const keyword =
        search.toLowerCase().trim();

      const matchesSearch =
        !keyword ||
        product.name
          .toLowerCase()
          .includes(keyword) ||
        product.code
          .toLowerCase()
          .includes(keyword) ||
        product.vendor
          .toLowerCase()
          .includes(keyword) ||
        product.category
          .toLowerCase()
          .includes(keyword) ||
        product.brand
          .toLowerCase()
          .includes(keyword) ||
        product.description
          .toLowerCase()
          .includes(keyword) ||
        product.specification
          .toLowerCase()
          .includes(keyword) ||
        product.principals.some(
          (principal) =>
            principal.name
              .toLowerCase()
              .includes(keyword)
        );

      const matchesVendor =
        vendorFilter ===
          "All Perusahaan" ||
        product.vendor ===
          vendorFilter;

      const matchesCategory =
        categoryFilter ===
          "All Categories" ||
        product.category ===
          categoryFilter;

      const matchesStatus =
        statusFilter ===
          "All Status" ||
        product.status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesVendor &&
        matchesCategory &&
        matchesStatus
      );
    }
  );

  const comparisonProducts =
    selectedProducts
      .map((id) =>
        products.find(
          (product) =>
            product.id === id
        )
      )
      .filter(
        (
          product
        ): product is Product =>
          Boolean(product)
      );

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

  const toggleProductSelection = (
    productId: string
  ) => {
    setSelectedProducts(
      (current) => {
        if (
          current.includes(productId)
        ) {
          return current.filter(
            (id) => id !== productId
          );
        }

        if (current.length >= 4) {
          return current;
        }

        return [
          ...current,
          productId,
        ];
      }
    );
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      setError(
        "File gambar harus berupa JPG, PNG, atau WEBP"
      );

      event.target.value = "";
      return;
    }

    const oversizedFile = files.find(
      (file) =>
        file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      setError(
        "Ukuran setiap gambar maksimal 5 MB"
      );

      event.target.value = "";
      return;
    }

    if (files.length > 5) {
      setError(
        "Product hanya boleh memiliki maksimal 5 gambar"
      );

      event.target.value = "";
      return;
    }

    imagePreviews.forEach((url) =>
      URL.revokeObjectURL(url)
    );

    const previews = files.map(
      (file) =>
        URL.createObjectURL(file)
    );

    setImageFiles(files);
    setImagePreviews(previews);
    setError("");

    event.target.value = "";
  };

  const removeImage = (index: number) => {
    const preview =
      imagePreviews[index];

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImageFiles((current) =>
      current.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );

    setImagePreviews((current) =>
      current.filter(
        (_, currentIndex) =>
          currentIndex !== index
      )
    );
  };

  const resetForm = () => {
    imagePreviews.forEach((url) =>
      URL.revokeObjectURL(url)
    );

    setProductName("");
    setVendor("");
    setVendorContactId(null);
    setCategory("");
    setBrand("");
    setPrice("");
    setImageFiles([]);
    setImagePreviews([]);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowAddProduct(false);
    resetForm();
  };

  const generateProductCode = () => {
    const numbers = products
      .map((product) => {
        const match =
          product.code.match(
            /^PRD-(\d+)$/
          );

        return match
          ? Number(match[1])
          : 0;
      })
      .filter((number) =>
        Number.isFinite(number)
      );

    const nextNumber =
      numbers.length > 0
        ? Math.max(...numbers) + 1
        : 1;

    return `PRD-${String(
      nextNumber
    ).padStart(3, "0")}`;
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

    const selectedContact =
      contacts.find(
        (contact) =>
          contact.id ===
          vendorContactId
      );

    if (!selectedContact) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newProductCode =
        generateProductCode();

      const response =
        await fetch(
          `${API_BASE_URL}/products`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              code: newProductCode,
              name: productName.trim(),
              category:
                category.trim(),
              brand: brand.trim(),
              price: Number(price),
              companyId:
                selectedContact.companyId,
              contactId:
                selectedContact.id,
              status: "ACTIVE",
            }),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Gagal menambahkan product"
        );
      }

      const createdProductId =
        result.data.id;

      if (imageFiles.length > 0) {
        const formData =
          new FormData();

        imageFiles.forEach(
          (file) => {
            formData.append(
              "images",
              file
            );
          }
        );

        const imageResponse =
          await fetch(
            `${API_BASE_URL}/products/${createdProductId}/images`,
            {
              method: "POST",
              body: formData,
            }
          );

        const imageResult =
          await imageResponse.json();

        if (
          !imageResponse.ok ||
          !imageResult.success
        ) {
          throw new Error(
            imageResult.message ||
              "Product berhasil dibuat, tetapi gambar gagal diupload"
          );
        }
      }

      await loadData();

      closeModal();
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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#010736] hover:bg-[#010736] hover:text-white"
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  handleComparisonButton
                }
                disabled={
                  comparisonMode &&
                  selectedProducts.length <
                    2
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  comparisonMode &&
                  selectedProducts.length >=
                    2
                    ? "bg-[#010736] text-white hover:bg-[#02094d]"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#010736] hover:bg-[#010736] hover:text-white"
                } ${
                  comparisonMode &&
                  selectedProducts.length <
                    2
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {comparisonMode &&
                selectedProducts.length >=
                  2
                  ? "Compare"
                  : "Comparison"}
              </button>

              <button
                type="button"
                onClick={openAddProduct}
                className="inline-flex items-center gap-2 rounded-lg bg-[#010736] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#02094d]"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {comparisonMode && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-[#010736]/10 bg-[#010736]/5 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Comparison mode aktif
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Pilih 2 sampai 4 product untuk
                dibandingkan.
              </p>
            </div>

            <span className="rounded-full bg-[#010736] px-3 py-1 text-xs font-medium text-white">
              {selectedProducts.length}/4
            </span>
          </div>
        )}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search product, description, specification, principal..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
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
              <Package className="h-5 w-5 text-slate-600" />

              <h2 className="font-semibold text-slate-900">
                Products
              </h2>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {filteredProducts.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {comparisonMode && (
                    <th className="w-14 px-3 py-3 text-center font-medium text-slate-500">
                      <span className="sr-only">
                        Compare
                      </span>
                    </th>
                  )}

                  <th className="w-20 px-5 py-3 text-left font-medium text-slate-500">
                    Photo
                  </th>

                  <th className="px-5 py-3 text-left font-medium text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-3 text-left font-medium text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-3 text-left font-medium text-slate-500">
                    Brand
                  </th>

                  <th className="px-5 py-3 text-left font-medium text-slate-500">
                    Price
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
                {loading ? (
                  <tr>
                    <td
                      colSpan={
                        comparisonMode
                          ? 8
                          : 7
                      }
                      className="px-5 py-12 text-center"
                    >
                      <Package className="mx-auto h-8 w-8 animate-pulse text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Memuat product...
                      </p>
                    </td>
                  </tr>
                ) : filteredProducts.length >
                  0 ? (
                  filteredProducts.map(
                    (product) => (
                      <tr
                        key={product.id}
                        className={`border-b border-slate-100 last:border-0 transition hover:bg-slate-50 ${
                          selectedProducts.includes(
                            product.id
                          )
                            ? "bg-[#010736]/5"
                            : ""
                        }`}
                      >
                        {comparisonMode && (
                          <td className="px-3 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(
                                product.id
                              )}
                              onChange={() =>
                                toggleProductSelection(
                                  product.id
                                )
                              }
                              disabled={
                                !selectedProducts.includes(
                                  product.id
                                ) &&
                                selectedProducts.length >=
                                  4
                              }
                              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#010736] disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Pilih ${product.name} untuk comparison`}
                            />
                          </td>
                        )}

                        <td className="px-5 py-4">
                          {product.images.length >
                          0 ? (
                            <img
                              src={`${API_SERVER_URL}${product.images[0].imageUrl}`}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                              <ImagePlus className="h-5 w-5 text-slate-300" />
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {product.code}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {product.category}
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-700">
                          {product.brand}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          Rp {product.price}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              product.status ===
                              "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-3 text-right">
                          <Link
                            href={`/products/${product.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#010736] hover:bg-[#010736] hover:text-white"
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
                      colSpan={
                        comparisonMode
                          ? 8
                          : 7
                      }
                      className="px-5 py-12 text-center"
                    >
                      <Package className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Product tidak ditemukan
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
                <h2 className="text-xl font-semibold text-slate-900">
                  Add Product
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tambahkan product baru ke Product
                  List.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-[#010736] hover:text-white"
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
                    className="group flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-[#010736] hover:bg-[#010736]/5"
                  >
                    {imagePreviews.length >
                    0 ? (
                      <div className="grid h-full w-full grid-cols-2 gap-1 p-1">
                        {imagePreviews
                          .slice(0, 4)
                          .map(
                            (
                              preview,
                              index
                            ) => (
                              <div
                                key={
                                  preview
                                }
                                className="relative overflow-hidden rounded-lg"
                              >
                                <img
                                  src={
                                    preview
                                  }
                                  alt={`Product preview ${
                                    index +
                                    1
                                  }`}
                                  className="h-full w-full object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={(
                                    event
                                  ) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    removeImage(
                                      index
                                    );
                                  }}
                                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            )
                          )}

                        {imagePreviews.length >
                          4 && (
                          <div className="flex items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-500">
                            +
                            {imagePreviews.length -
                              4}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <ImagePlus className="h-9 w-9 text-slate-400 transition group-hover:text-[#010736]" />

                        <p className="mt-3 text-sm font-medium text-slate-600">
                          Upload Photo
                        </p>

                        <p className="mt-1 px-4 text-center text-xs text-slate-400">
                          JPG, PNG atau WEBP
                        </p>
                      </>
                    )}
                  </label>

                  <input
                    id="product-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Maksimal 5 gambar
                    </p>

                    <p className="text-xs font-medium text-slate-500">
                      {imageFiles.length}/5
                    </p>
                  </div>
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
                      className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Perusahaan
                      </label>

                      <div className="relative">
                        <select
                          value={
                            vendorContactId ??
                            ""
                          }
                          onChange={(e) => {
                            const contactId =
                              e.target.value
                                ? e.target.value
                                : null;

                            setVendorContactId(
                              contactId
                            );

                            const selectedContact =
                              contacts.find(
                                (
                                  contact
                                ) =>
                                  contact.id ===
                                  contactId
                              );

                            setVendor(
                              selectedContact?.perusahaan ??
                                ""
                            );
                          }}
                          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                        >
                          <option value="">
                            Pilih contact vendor
                          </option>

                          {contacts.map(
                            (contact) => (
                              <option
                                key={
                                  contact.id
                                }
                                value={
                                  contact.id
                                }
                              >
                                {
                                  contact.nama
                                }{" "}
                                —{" "}
                                {
                                  contact.perusahaan
                                }
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Category
                      </label>

                      <input
                        type="text"
                        value={category}
                        onChange={(e) =>
                          setCategory(
                            e.target.value
                          )
                        }
                        placeholder="Contoh: Network"
                        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Brand
                      </label>

                      <input
                        type="text"
                        value={brand}
                        onChange={(e) =>
                          setBrand(
                            e.target.value
                          )
                        }
                        placeholder="Contoh: Mikrotik"
                        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) =>
                          setPrice(
                            e.target.value
                          )
                        }
                        placeholder="Contoh: 150000"
                        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
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
                disabled={saving}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-[#010736] hover:bg-[#010736] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleAddProduct
                }
                disabled={
                  saving ||
                  !productName.trim() ||
                  vendorContactId === null ||
                  !category.trim() ||
                  !brand.trim() ||
                  !price.trim()
                }
                className="rounded-lg bg-[#010736] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#02094d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Adding..."
                  : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-5 right-5 z-[60] max-w-md rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-600 shadow-lg">
          {error}
        </div>
      )}
    </div>
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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#010736] hover:bg-[#010736] hover:text-white"
                title="Back to Product List"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Product Comparison
                </h1>

                <p className="text-sm text-slate-500">
                  Compare selected product information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-[#010736] hover:bg-[#010736] hover:text-white"
              title="Close comparison"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {products.length < 2 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Package className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-700">
              Minimal 2 product diperlukan
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-lg bg-[#010736] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#02094d]"
            >
              Kembali ke Product List
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Product Information
                </h2>
              </div>

              <div
                className={`grid gap-5 ${
                  products.length === 2
                    ? "grid-cols-1 lg:grid-cols-2"
                    : products.length === 3
                    ? "grid-cols-1 lg:grid-cols-2"
                    : "grid-cols-1 lg:grid-cols-2"
                }`}
              >
                {products.map(
                  (product) => (
                    <ProductComparisonCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}
              </div>
            </section>
          </div>
        )}
      </main>
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
      ? product.principals
          .map(
            (principal) =>
              principal.name
          )
          .join(", ")
      : "-";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Product
        </p>

        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          {product.name}
        </h3>

        <p className="mt-1 text-xs text-slate-400">
          {product.code}
        </p>
      </div>

      <div className="space-y-6 p-5">
        <section>
          <h4 className="mb-4 text-sm font-semibold text-slate-900">
            Product Information
          </h4>

          <div className="space-y-4">
            <ComparisonField
              label="Product Name"
              value={product.name}
            />

            <ComparisonField
              label="Product Code"
              value={product.code}
            />

            <ComparisonField
              label="Category"
              value={product.category}
            />

            <ComparisonField
              label="Brand"
              value={product.brand}
            />

            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-400">
                Status
              </p>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  product.status ===
                  "Active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-slate-700"
                }`}
              >
                {product.status}
              </span>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">
            Description
          </h4>

          <div className="min-h-[100px] rounded-xl bg-slate-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {product.description ||
                "Tidak ada description."}
            </p>
          </div>
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">
            Specification
          </h4>

          <div className="min-h-[100px] rounded-xl bg-slate-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {product.specification ||
                "Tidak ada specification."}
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}

function ComparisonField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-800">
        {value || "-"}
      </p>
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
        className="h-10 min-w-[160px] appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
      >
        {options.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}