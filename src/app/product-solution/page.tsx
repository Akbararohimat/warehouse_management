"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  Filter,
  ImagePlus,
  Package,
  Plus,
  Search,
  X,
  FileText,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

type ProductSolution = {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  imageUrl: string | null;
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

  principal?: {
    id: string;
    name: string;
  } | null;

  documents?: {
    id: string;
    name: string;
    fileUrl: string;
  }[];

  principals?: {
    id: string;
    name: string;
  }[];
};

type ApiProductSolution = {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  imageUrl: string | null;
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

  principal?: {
    id: string;
    name: string;
  } | null;

  documents?: {
    id: string;
    name: string;
    fileUrl: string;
  }[];

  principals?: {
    id: string;
    name: string;
  }[];
};

type Company = {
  id: string;
  name: string;
  type: "VENDOR" | "PRINCIPAL";
  brands?: {
    id: string;
    name: string;
  }[];
};

type Contact = {
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
};

export default function ProductSolutionsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [brandFilter, setBrandFilter] =
    useState("All Brands");
  const [productSolutions, setProductSolutions] =
    useState<ProductSolution[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddProductSolution, setShowAddProductSolution] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [productSolutionName, setProductSolutionName] =
    useState("");
  const [companyId, setCompanyId] = useState("");
  const [contactId, setContactId] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [specification, setSpecification] =
    useState("");

  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");

  const [pdfFiles, setPdfFiles] = useState<File[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productSolutionsResponse,
        companiesResponse,
        contactsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/product-solutions`),
        fetch(`${API_BASE_URL}/companies`),
        fetch(`${API_BASE_URL}/contacts`),
      ]);

      if (!productSolutionsResponse.ok) {
        throw new Error(
          "Gagal mengambil data Product Solution"
        );
      }

      if (!companiesResponse.ok) {
        throw new Error(
          "Gagal mengambil data perusahaan"
        );
      }

      if (!contactsResponse.ok) {
        throw new Error(
          "Gagal mengambil data contact"
        );
      }

      const productSolutionsResult =
        await productSolutionsResponse.json();

      const companiesResult =
        await companiesResponse.json();

      const contactsResult =
        await contactsResponse.json();

      if (!productSolutionsResult.success) {
        throw new Error(
          productSolutionsResult.message ||
            "Gagal mengambil data Product Solution"
        );
      }

      if (!companiesResult.success) {
        throw new Error(
          companiesResult.message ||
            "Gagal mengambil data perusahaan"
        );
      }

      if (!contactsResult.success) {
        throw new Error(
          contactsResult.message ||
            "Gagal mengambil data contact"
        );
      }

      const mappedProductSolutions: ProductSolution[] =
        (
          productSolutionsResult.data as ApiProductSolution[]
        ).map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          category: item.category,
          brand: item.brand,
          imageUrl: item.imageUrl,
          description: item.description,
          specification: item.specification,
          companyId: item.companyId,
          contactId: item.contactId,
          principalId: item.principalId,
          company: item.company,
          contact: item.contact,
          principal: item.principal,
          documents: item.documents ?? [],
          principals: item.principals ?? [],
        }));

      setProductSolutions(mappedProductSolutions);
      setCompanies(companiesResult.data ?? []);
      setContacts(contactsResult.data ?? []);
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

  const categories = useMemo(
    () => [
      "All Categories",
      ...Array.from(
        new Set(
          productSolutions
            .map(
              (productSolution) =>
                productSolution.category
            )
            .filter(Boolean)
        )
      ),
    ],
    [productSolutions]
  );

  const brands = useMemo(
    () => [
      "All Brands",
      ...Array.from(
        new Set(
          productSolutions
            .map(
              (productSolution) =>
                productSolution.brand
            )
            .filter(Boolean)
        )
      ),
    ],
    [productSolutions]
  );

  const filteredProductSolutions =
    productSolutions.filter(
      (productSolution) => {
        const keyword =
          search.toLowerCase().trim();

        const matchesSearch =
          !keyword ||
          productSolution.name
            .toLowerCase()
            .includes(keyword) ||
          productSolution.code
            .toLowerCase()
            .includes(keyword) ||
          productSolution.category
            .toLowerCase()
            .includes(keyword) ||
          productSolution.brand
            .toLowerCase()
            .includes(keyword) ||
          productSolution.description
            ?.toLowerCase()
            .includes(keyword) ||
          productSolution.specification
            ?.toLowerCase()
            .includes(keyword) ||
          productSolution.company?.name
            ?.toLowerCase()
            .includes(keyword) ||
          productSolution.principal?.name
            ?.toLowerCase()
            .includes(keyword) ||
          productSolution.principals?.some(
            (principal) =>
              principal.name
                .toLowerCase()
                .includes(keyword)
          );

        const matchesCategory =
          categoryFilter === "All Categories" ||
          productSolution.category ===
            categoryFilter;

        const matchesBrand =
          brandFilter === "All Brands" ||
          productSolution.brand === brandFilter;

        return (
          Boolean(matchesSearch) &&
          matchesCategory &&
          matchesBrand
        );
      }
    );

  const getImageUrl = (
    imageUrl: string | null
  ) => {
    if (!imageUrl) {
      return "https://placehold.co/100x100?text=Solution";
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `http://localhost:5000${imageUrl}`;
  };

  /*
   * =========================
   * ADD PRODUCT SOLUTION
   * =========================
   */

  const resetAddForm = () => {
    setProductSolutionName("");
    setCompanyId("");
    setContactId("");
    setCategory("");
    setBrand("");
    setDescription("");
    setSpecification("");
    setImage(null);
    setImageName("");
    setPdfFiles([]);
  };

  const closeAddModal = () => {
    if (saving) return;

    setShowAddProductSolution(false);
    resetAddForm();
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const previewUrl =
      URL.createObjectURL(file);

    setImage(previewUrl);
    setImageName(file.name);
  };

  const handlePdfChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) return;

    const validFiles = files.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name
          .toLowerCase()
          .endsWith(".pdf")
    );

    setPdfFiles((current) => [
      ...current,
      ...validFiles,
    ]);

    event.target.value = "";
  };

  const removePdf = (index: number) => {
    setPdfFiles((current) =>
      current.filter(
        (_, fileIndex) => fileIndex !== index
      )
    );
  };

  const principalCompanies = useMemo(
    () =>
      companies.filter(
        (company) =>
          company.type === "PRINCIPAL"
      ),
    [companies]
  );

  const availableBrands = useMemo(() => {
    const brandMap = new Map<
      string,
      { id: string; name: string }
    >();

    principalCompanies.forEach(
      (company) => {
        company.brands?.forEach((item) => {
          if (!brandMap.has(item.name)) {
            brandMap.set(item.name, item);
          }
        });
      }
    );

    return Array.from(brandMap.values());
  }, [principalCompanies]);

  const selectedPrincipal = useMemo(() => {
    if (!brand) return null;

    return (
      principalCompanies.find(
        (company) =>
          company.brands?.some(
            (item) =>
              item.name.toLowerCase() ===
              brand.toLowerCase()
          )
      ) ?? null
    );
  }, [brand, principalCompanies]);

  const filteredContacts = useMemo(() => {
    if (!companyId) return [];

    return contacts.filter(
      (contact) =>
        contact.companyId === companyId
    );
  }, [contacts, companyId]);

  const generateProductSolutionCode = () => {
    const numbers = productSolutions
      .map((item) => {
        const match =
          item.code.match(
            /^PS-(\d+)$/
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

    return `PS-${String(
      nextNumber
    ).padStart(3, "0")}`;
  };

  const handleAddProductSolution =
    async () => {
      if (
        !productSolutionName.trim() ||
        !companyId ||
        !category.trim() ||
        !brand.trim()
      ) {
        setError(
          "Product Solution Name, Company, Category, dan Brand wajib diisi."
        );
        return;
      }

      if (!selectedPrincipal) {
        setError(
          "Principal untuk brand yang dipilih tidak ditemukan."
        );
        return;
      }

      try {
        setSaving(true);
        setError("");

        const code =
          generateProductSolutionCode();

        const response = await fetch(
          `${API_BASE_URL}/product-solutions`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              code,
              name:
                productSolutionName.trim(),
              category:
                category.trim(),
              brand: brand.trim(),
              imageUrl: null,
              description:
                description.trim() || null,
              specification:
                specification.trim() || null,
              companyId,
              contactId:
                contactId || null,
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
              "Gagal menambahkan Product Solution"
          );
        }

        const createdProductSolution =
          result.data;

        /*
         * Upload multiple PDF
         */
        if (
          pdfFiles.length > 0 &&
          createdProductSolution?.id
        ) {
          const formData =
            new FormData();

          pdfFiles.forEach((file) => {
            formData.append(
              "pdfs",
              file
            );
          });

          const documentResponse =
            await fetch(
              `${API_BASE_URL}/product-solutions/${createdProductSolution.id}/documents`,
              {
                method: "POST",
                body: formData,
              }
            );

          const documentResult =
            await documentResponse.json();

          if (
            !documentResponse.ok ||
            !documentResult.success
          ) {
            throw new Error(
              documentResult.message ||
                "Product Solution berhasil dibuat, tetapi PDF gagal diupload."
            );
          }
        }

        const createdId =
          createdProductSolution?.id;

        resetAddForm();
        setShowAddProductSolution(false);

        await loadData();

        if (createdId) {
          window.location.href =
            `/product-solution/${createdId}`;
        }
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal menambahkan Product Solution"
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-[#010736]"
                title="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Product Solution List
                </h1>

                <p className="text-sm text-slate-500">
                  Manage product solution
                  information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setShowAddProductSolution(
                  true
                );
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#010736] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#02094d]"
            >
              <Plus className="h-4 w-4" />
              Add Product Solution
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
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search product solution, description, specification, principal..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <FilterSelect
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories}
            />

            <FilterSelect
              value={brandFilter}
              onChange={setBrandFilter}
              options={brands}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-[#010736]" />

              <h2 className="font-semibold text-slate-900">
                Product Solutions
              </h2>

              <span className="rounded-full bg-[#010736]/10 px-2.5 py-1 text-xs font-medium text-[#010736]">
                {
                  filteredProductSolutions.length
                }
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
                    Product Solution
                  </th>

                  <th className="px-5 py-3 text-left font-medium text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-3 text-left font-medium text-slate-500">
                    Brand
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
                      colSpan={5}
                      className="px-5 py-12 text-center"
                    >
                      <Package className="mx-auto h-8 w-8 animate-pulse text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Memuat product
                        solution...
                      </p>
                    </td>
                  </tr>
                ) : filteredProductSolutions.length >
                  0 ? (
                  filteredProductSolutions.map(
                    (productSolution) => (
                      <tr
                        key={
                          productSolution.id
                        }
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <img
                            src={getImageUrl(
                              productSolution.imageUrl
                            )}
                            alt={
                              productSolution.name
                            }
                            className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                          />
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {
                                productSolution.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                productSolution.code
                              }
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {
                            productSolution.category
                          }
                        </td>

                        <td className="px-5 py-4 font-medium text-slate-700">
                          {
                            productSolution.brand
                          }
                        </td>

                        <td className="whitespace-nowrap px-5 py-3 text-right">
                          <Link
                            href={`/product-solution/${productSolution.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#010736]/20 px-3 py-2 text-xs font-medium text-[#010736] transition hover:bg-[#010736] hover:text-white"
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
                      colSpan={5}
                      className="px-5 py-12 text-center"
                    >
                      <Package className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        Product Solution
                        tidak ditemukan
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
      {showAddProductSolution && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 px-4 py-6"
          onClick={closeAddModal}
        >
          <div
            className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-[#010736]">
                  Add Product Solution
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tambahkan product solution baru.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-[#010736]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-6">
              <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Solution Photo
                  </label>

                  <label
                    htmlFor="product-solution-image"
                    className="group flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-[#010736] hover:bg-[#010736]/5"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt="Product Solution preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <>
                        <ImagePlus className="h-9 w-9 text-slate-400 transition group-hover:text-[#010736]" />

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
                    id="product-solution-image"
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
                      Product Solution Name
                    </label>

                    <input
                      type="text"
                      value={
                        productSolutionName
                      }
                      onChange={(e) =>
                        setProductSolutionName(
                          e.target.value
                        )
                      }
                      placeholder="Contoh: Smart Classroom Solution"
                      className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Company
                      </label>

                      <div className="relative">
                        <select
                          value={companyId}
                          onChange={(e) => {
                            setCompanyId(
                              e.target.value
                            );
                            setContactId("");
                          }}
                          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                        >
                          <option value="">
                            Pilih company
                          </option>

                          {companies
                            .filter(
                              (company) =>
                                company.type ===
                                "VENDOR"
                            )
                            .map((company) => (
                              <option
                                key={company.id}
                                value={
                                  company.id
                                }
                              >
                                {company.name}
                              </option>
                            ))}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Contact
                      </label>

                      <div className="relative">
                        <select
                          value={contactId}
                          onChange={(e) =>
                            setContactId(
                              e.target.value
                            )
                          }
                          disabled={!companyId}
                          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#010736] focus:ring-1 focus:ring-[#010736] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                        >
                          <option value="">
                            {companyId
                              ? "Pilih contact"
                              : "Pilih company dulu"}
                          </option>

                          {filteredContacts.map(
                            (contact) => (
                              <option
                                key={contact.id}
                                value={
                                  contact.id
                                }
                              >
                                {contact.name}
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                        placeholder="Contoh: Network Solution"
                        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Brand
                      </label>

                      <div className="relative">
                        <select
                          value={brand}
                          onChange={(e) =>
                            setBrand(
                              e.target.value
                            )
                          }
                          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                        >
                          <option value="">
                            Pilih brand
                          </option>

                          {availableBrands.map(
                            (item) => (
                              <option
                                key={item.id}
                                value={
                                  item.name
                                }
                              >
                                {item.name}
                              </option>
                            )
                          )}
                        </select>

                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Principal
                    </label>

                    <input
                      type="text"
                      value={
                        selectedPrincipal?.name ??
                        ""
                      }
                      readOnly
                      placeholder="Principal otomatis berdasarkan brand"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Description
                    </label>

                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="Masukkan description product solution..."
                      className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Specification
                    </label>

                    <textarea
                      value={specification}
                      onChange={(e) =>
                        setSpecification(
                          e.target.value
                        )
                      }
                      rows={4}
                      placeholder="Masukkan specification product solution..."
                      className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Documents / PDF
                    </label>

                    <label
                      htmlFor="product-solution-pdfs"
                      className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-[#010736] hover:bg-[#010736]/5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200">
                        <FileText className="h-5 w-5 text-[#010736]" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          Upload PDF
                        </p>

                        <p className="text-xs text-slate-400">
                          Bisa pilih lebih dari satu file
                        </p>
                      </div>
                    </label>

                    <input
                      id="product-solution-pdfs"
                      type="file"
                      accept="application/pdf,.pdf"
                      multiple
                      onChange={
                        handlePdfChange
                      }
                      className="hidden"
                    />

                    {pdfFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {pdfFiles.map(
                          (file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <FileText className="h-4 w-4 shrink-0 text-red-500" />

                                <p className="truncate text-xs text-slate-600">
                                  {file.name}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removePdf(
                                    index
                                  )
                                }
                                className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleAddProductSolution
                }
                disabled={
                  saving ||
                  !productSolutionName.trim() ||
                  !companyId ||
                  !category.trim() ||
                  !brand.trim()
                }
                className="rounded-lg bg-[#010736] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#02094d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving
                  ? "Adding..."
                  : "Add Product Solution"}
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