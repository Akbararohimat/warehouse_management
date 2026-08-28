"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
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

type Product = {
  id: number;
  code: string;
  name: string;
  vendor: string;
  vendorContactId: number | null;
  category: string;
  brand: string;
  price: string;
  status: "Active" | "Inactive";
  image: string;
};

type Contact = {
  id: number;
  nama: string;
  perusahaan: string;
  telepon: string;
  email: string;
  productIds: number[];
};

const initialProducts: Product[] = [
  {
    id: 1,
    code: "PRD-001",
    name: "Fiber Optic Cable 12 Core",
    vendor: "PT.ABC",
    vendorContactId: null,
    category: "Fiber Optic",
    brand: "Furukawa",
    price: "150000",
    status: "Active",
    image: "https://placehold.co/100x100?text=FO",
  },
  {
    id: 2,
    code: "PRD-002",
    name: "Router Mikrotik",
    vendor: "PT.ACB",
    vendorContactId: null,
    category: "Network",
    brand: "MikroTik",
    price: "2500000",
    status: "Active",
    image: "https://placehold.co/100x100?text=RT",
  },
  {
    id: 3,
    code: "PRD-003",
    name: "Optical Distribution Box",
    vendor: "PT.DCA",
    vendorContactId: null,
    category: "Fiber Optic",
    brand: "CommScope",
    price: "450000",
    status: "Active",
    image: "https://placehold.co/100x100?text=OD",
  },
  {
    id: 4,
    code: "PRD-004",
    name: "Network Switch 24 Port",
    vendor: "PT.CDC",
    vendorContactId: null,
    category: "Network",
    brand: "TP-Link",
    price: "850000",
    status: "Inactive",
    image: "https://placehold.co/100x100?text=SW",
  },
];

const initialContacts: Contact[] = [
  {
    id: 1,
    nama: "Akbar arohimat",
    perusahaan: "PT.PTan",
    telepon: "08888888",
    email: "akbar@gmail.com",
    productIds: [],
  },
  {
    id: 2,
    nama: "Akbar Versi 2",
    perusahaan: "PT. ABC",
    telepon: "08123456789",
    email: "akbar2@gmail.com",
    productIds: [],
  },
  {
    id: 3,
    nama: "Akbar Versi 3",
    perusahaan: "PT. Jaya",
    telepon: "08234567890",
    email: "akbar3@gmail.com",
    productIds: [],
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] =
    useState("All Perusahaan");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [products, setProducts] =
    useState<Product[]>(initialProducts);

  const [contacts, setContacts] =
    useState<Contact[]>(initialContacts);

  const [hydrated, setHydrated] = useState(false);
  const [showAddProduct, setShowAddProduct] =
    useState(false);

  const [productName, setProductName] = useState("");
  const [vendor, setVendor] = useState("");
  const [vendorContactId, setVendorContactId] =
    useState<number | null>(null);

  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] =
    useState<string | null>(null);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedContacts =
      localStorage.getItem("rnd_contacts");

    const storedProducts =
      localStorage.getItem("rnd_products");

    if (storedContacts) {
      try {
        const parsedContacts =
          JSON.parse(storedContacts);

        if (Array.isArray(parsedContacts)) {
          setContacts(parsedContacts);
        } else {
          setContacts(initialContacts);
        }
      } catch {
        setContacts(initialContacts);
      }
    } else {
      localStorage.setItem(
        "rnd_contacts",
        JSON.stringify(initialContacts)
      );

      setContacts(initialContacts);
    }

    if (storedProducts) {
      try {
        const parsedProducts =
          JSON.parse(storedProducts);

        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
        } else {
          setProducts(initialProducts);
        }
      } catch {
        setProducts(initialProducts);
      }
    } else {
      localStorage.setItem(
        "rnd_products",
        JSON.stringify(initialProducts)
      );

      setProducts(initialProducts);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "rnd_products",
      JSON.stringify(products)
    );
  }, [products, hydrated])

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "rnd_contacts",
      JSON.stringify(contacts)
    );
  }, [contacts, hydrated]);

  useEffect(() => {
    const syncData = () => {
      const storedContacts =
        localStorage.getItem("rnd_contacts");

      const storedProducts =
        localStorage.getItem("rnd_products");

      if (storedContacts) {
        try {
          const parsedContacts =
            JSON.parse(storedContacts);

          if (Array.isArray(parsedContacts)) {
            setContacts(parsedContacts);
          }
        } catch {
          // Ignore invalid data
        }
      }

      if (storedProducts) {
        try {
          const parsedProducts =
            JSON.parse(storedProducts);

          if (Array.isArray(parsedProducts)) {
            setProducts(parsedProducts);
          }
        } catch {
          // Ignore invalid data
        }
      }
    };

    window.addEventListener(
      "storage",
      syncData
    );

    window.addEventListener(
      "focus",
      syncData
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncData
      );

      window.removeEventListener(
        "focus",
        syncData
      );
    };
  }, []);

  const openAddProduct = () => {
    const storedContacts =
      localStorage.getItem("rnd_contacts");

    if (storedContacts) {
      try {
        const parsedContacts =
          JSON.parse(storedContacts);

        if (Array.isArray(parsedContacts)) {
          setContacts(parsedContacts);
        }
      } catch {
        setContacts(initialContacts);
      }
    }

    setShowAddProduct(true);
  };

  const vendors = useMemo(
    () => [
      "All Perusahaan",
      ...Array.from(
        new Set(
          products
            .map((product) => product.vendor)
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
            .map((product) => product.category)
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
            (product) => product.status
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
          .includes(keyword);

      const matchesVendor =
        vendorFilter ===
          "All Perusahaan" ||
        product.vendor === vendorFilter;

      const matchesCategory =
        categoryFilter ===
          "All Categories" ||
        product.category ===
          categoryFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        product.status === statusFilter;

      return (
        matchesSearch &&
        matchesVendor &&
        matchesCategory &&
        matchesStatus
      );
    }
  );

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl =
      URL.createObjectURL(file);

    setImage(previewUrl);
    setImageName(file.name);
  };

  const resetForm = () => {
    setProductName("");
    setVendor("");
    setVendorContactId(null);
    setCategory("");
    setBrand("");
    setPrice("");
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
          contact.id === vendorContactId
      );

    if (!selectedContact) {
      return;
    }

    const newProductId =
      products.length > 0
        ? Math.max(
            ...products.map(
              (product) => product.id
            )
          ) + 1
        : 1;

    const newProductCode =
      `PRD-${String(
        newProductId
      ).padStart(3, "0")}`;

    const newProduct: Product = {
      id: newProductId,

      code: newProductCode,

      name: productName.trim(),

      vendor:
        selectedContact.perusahaan,

      vendorContactId:
        selectedContact.id,

      category:
        category.trim(),

      brand:
        brand.trim(),

      price:
        price.trim(),

      status: "Active",

      image:
        image ??
        "https://placehold.co/100x100?text=Product",
    };

    const updatedProducts = [
      ...products,
      newProduct,
    ];

    setProducts(updatedProducts);

    localStorage.setItem(
      "rnd_products",
      JSON.stringify(updatedProducts)
    );

    const updatedContacts =
      contacts.map((contact) => {
        if (
          contact.id !==
          selectedContact.id
        ) {
          return contact;
        }
        const alreadyExists =
          contact.productIds.includes(
            newProduct.id
          );

        return {
          ...contact,

          productIds:
            alreadyExists
              ? contact.productIds
              : [
                  ...contact.productIds,
                  newProduct.id,
                ],
        };
      });

    setContacts(updatedContacts);

    localStorage.setItem(
      "rnd_contacts",
      JSON.stringify(updatedContacts)
    );

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
              onClick={openAddProduct}
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
                placeholder="Search product, perusahaan, category..."
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
                    Perusahaan
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

                {filteredProducts.length > 0 ? (

                  filteredProducts.map(
                    (product) => (

                      <tr
                        key={product.code}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                          />

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

                        <td className="px-5 py-4 text-slate-700">
                          {product.vendor}
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
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {product.status}
                          </span>

                        </td>

                        <td className="whitespace-nowrap px-5 py-3 text-right">

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
                      colSpan={8}
                      className="px-5 py-12 text-center"
                    >

                      <Package className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Product tidak ditemukan
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Coba ubah search atau filter
                        yang digunakan.
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
                  Tambahkan product baru ke Product
                  List.
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
                          PNG, JPG atau JPEG
                        </p>

                      </>

                    )}

                  </label>

                  <input
                    id="product-image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageChange}
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
                                ? Number(
                                    e.target.value
                                  )
                                : null;

                            setVendorContactId(
                              contactId
                            );

                            const selectedContact =
                              contacts.find(
                                (contact) =>
                                  contact.id ===
                                  contactId
                              );

                            setVendor(
                              selectedContact?.perusahaan ??
                                ""
                            );

                          }}
                          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
                        >

                          <option value="">
                            Pilih contact vendor
                          </option>

                          {contacts.map(
                            (contact) => (

                              <option
                                key={contact.id}
                                value={contact.id}
                              >
                                {contact.nama} —{" "}
                                {contact.perusahaan}
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
                        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
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
                        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
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
                  vendorContactId === null ||
                  !category.trim() ||
                  !brand.trim() ||
                  !price.trim()
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