"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Trash2,
  X,
  Building2,
  Tag,
  CreditCard,
  FileText,
  ListChecks,
  Pencil,
  Check,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";
const API_SERVER_URL = "http://localhost:5000";

type Product = {
  id: string;
  code: string;
  name: string;
  vendor: string;
  principals: {
    id: string;
    name: string;
  }[];
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
  pdfUrl: string | null;
  description?: string;
  specification?: string;
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

  pdfUrl: string | null;
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

  principals?: {
    id: string;
    name: string;
  }[];
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();

  const productId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showImagePreview, setShowImagePreview] =
    useState(false);

  const [editingDescription, setEditingDescription] =
    useState(false);

  const [description, setDescription] =
    useState("");

  const [editingSpecification, setEditingSpecification] =
    useState(false);

  const [specification, setSpecification] =
    useState("");

  const [savingDescription, setSavingDescription] =
    useState(false);

  const [savingSpecification, setSavingSpecification] =
    useState(false);

  const [editingStatus, setEditingStatus] =
    useState(false);

  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  const [savingStatus, setSavingStatus] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [uploadingPdf, setUploadingPdf] =
    useState(false);

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  const [uploadingImages, setUploadingImages] =
    useState(false);

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/products/${productId}`
        );

        const result = await response.json();

        if (
          !response.ok ||
          !result.success ||
          !result.data
        ) {
          setProduct(null);
          return;
        }

        const apiProduct: ApiProduct =
          result.data;

        const mappedProduct: Product = {
          id: apiProduct.id,
          code: apiProduct.code,
          name: apiProduct.name,

          vendor:
            apiProduct.company?.name ??
            "Belum ada perusahaan",

          principals:
            apiProduct.principals ??
            (apiProduct.principal
              ? [apiProduct.principal]
              : []),

          vendorContactId:
            apiProduct.contactId,

          companyId:
            apiProduct.companyId,

          category:
            apiProduct.category,

          brand:
            apiProduct.brand,

          price:
            String(apiProduct.price),

          status:
            apiProduct.status === "ACTIVE"
              ? "Active"
              : "Inactive",

          images:
            apiProduct.images ?? [],

          pdfUrl:
            apiProduct.pdfUrl ?? null,

          description:
            apiProduct.description ?? "",

          specification:
            apiProduct.specification ?? "",
        };

        setProduct(mappedProduct);

        setDescription(
          apiProduct.description ?? ""
        );

        setSpecification(
          apiProduct.specification ?? ""
        );

        setStatus(
          apiProduct.status === "ACTIVE"
            ? "Active"
            : "Inactive"
        );

        setCurrentImageIndex(0);
      } catch (error) {
        console.error(
          "Load product detail error:",
          error
        );

        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleSaveStatus = async () => {
    if (!product || savingStatus) return;

    try {
      setSavingStatus(true);

      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status:
              status === "Active"
                ? "ACTIVE"
                : "INACTIVE",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menyimpan status product"
        );
        return;
      }

      const apiProduct: ApiProduct =
        result.data;

      const updatedStatus =
        apiProduct.status === "ACTIVE"
          ? "Active"
          : "Inactive";

      setProduct((currentProduct) => {
        if (!currentProduct)
          return currentProduct;

        return {
          ...currentProduct,
          status: updatedStatus,
        };
      });

      setStatus(updatedStatus);
      setEditingStatus(false);
    } catch (error) {
      console.error(
        "Save product status error:",
        error
      );

      alert(
        "Terjadi kesalahan saat menyimpan status product"
      );
    } finally {
      setSavingStatus(false);
    }
  };

  const handleCancelStatus = () => {
    if (!product) return;

    setStatus(product.status);
    setEditingStatus(false);
  };

  const handleSaveDescription = async () => {
    if (!product || savingDescription) return;

    try {
      setSavingDescription(true);

      const trimmedDescription =
        description.trim();

      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            description:
              trimmedDescription,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menyimpan deskripsi"
        );
        return;
      }

      const apiProduct: ApiProduct =
        result.data;

      setProduct((currentProduct) => {
        if (!currentProduct)
          return currentProduct;

        return {
          ...currentProduct,
          description:
            apiProduct.description ?? "",
        };
      });

      setDescription(
        apiProduct.description ?? ""
      );

      setEditingDescription(false);
    } catch (error) {
      console.error(
        "Save description error:",
        error
      );

      alert(
        "Terjadi kesalahan saat menyimpan deskripsi"
      );
    } finally {
      setSavingDescription(false);
    }
  };

  const handleCancelDescription = () => {
    if (!product) return;

    setDescription(
      product.description ?? ""
    );

    setEditingDescription(false);
  };

  const handleSaveSpecification = async () => {
    if (
      !product ||
      savingSpecification
    )
      return;

    try {
      setSavingSpecification(true);

      const trimmedSpecification =
        specification.trim();

      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            specification:
              trimmedSpecification,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menyimpan spesifikasi"
        );
        return;
      }

      const apiProduct: ApiProduct =
        result.data;

      setProduct((currentProduct) => {
        if (!currentProduct)
          return currentProduct;

        return {
          ...currentProduct,
          specification:
            apiProduct.specification ?? "",
        };
      });

      setSpecification(
        apiProduct.specification ?? ""
      );

      setEditingSpecification(false);
    } catch (error) {
      console.error(
        "Save specification error:",
        error
      );

      alert(
        "Terjadi kesalahan saat menyimpan spesifikasi"
      );
    } finally {
      setSavingSpecification(false);
    }
  };

  const handleCancelSpecification = () => {
    if (!product) return;

    setSpecification(
      product.specification ?? ""
    );

    setEditingSpecification(false);
  };

  const handleReplaceImages = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!product) return;

    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (files.length > 5) {
      alert(
        "Product maksimal memiliki 5 gambar"
      );

      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type)
    );

    if (invalidFile) {
      alert(
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
      alert(
        "Ukuran setiap gambar maksimal 5 MB"
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingImages(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append(
          "images",
          file
        );
      });

      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}/images`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal mengganti gambar product"
        );
        return;
      }

      const apiProduct: ApiProduct =
        result.data;

      setProduct((currentProduct) => {
        if (!currentProduct)
          return currentProduct;

        return {
          ...currentProduct,
          images:
            apiProduct.images ?? [],
        };
      });

      setCurrentImageIndex(0);
      setShowImagePreview(false);

      alert(
        "Gambar product berhasil diganti"
      );
    } catch (error) {
      console.error(
        "Replace product images error:",
        error
      );

      alert(
        "Terjadi kesalahan saat mengganti gambar product"
      );
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  };

  const handleUploadPdf = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!product) return;

    const file =
      event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("File harus berupa PDF");
      event.target.value = "";
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "Ukuran PDF maksimal 10 MB"
      );
      event.target.value = "";
      return;
    }

    try {
      setUploadingPdf(true);

      const formData =
        new FormData();

      formData.append("pdf", file);

      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}/pdf`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal mengupload PDF"
        );
        return;
      }

      const apiProduct: ApiProduct =
        result.data;

      setProduct((currentProduct) => {
        if (!currentProduct)
          return currentProduct;

        return {
          ...currentProduct,
          pdfUrl:
            apiProduct.pdfUrl ??
            null,
        };
      });

      alert("PDF berhasil diupload");
    } catch (error) {
      console.error(
        "Upload PDF error:",
        error
      );

      alert(
        "Terjadi kesalahan saat mengupload PDF"
      );
    } finally {
      setUploadingPdf(false);
      event.target.value = "";
    }
  };

  const handleDeleteProduct = async () => {
    if (!product || deleting) return;

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menghapus product"
        );
        return;
      }

      setShowDeleteModal(false);

      router.push("/products");
      router.refresh();
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        "Terjadi kesalahan saat menghapus product"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex h-16 items-center">
              <Link
                href="/products"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#010736] hover:bg-[#010736] hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="ml-4">
                <h1 className="text-xl font-semibold text-slate-900">
                  Product Detail
                </h1>

                <p className="text-sm text-slate-500">
                  Product tidak ditemukan
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto flex max-w-7xl items-center justify-center px-6 py-20">
          <div className="text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
              Product tidak ditemukan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Product mungkin sudah dihapus
              atau belum tersimpan.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#010736] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#02094d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Product List
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const activeImage =
    product.images.length > 0
      ? product.images[
          Math.min(
            currentImageIndex,
            product.images.length - 1
          )
        ]
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#010736] hover:bg-[#010736] hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-slate-900">
                    Product Detail
                  </h1>

                  <span className="text-slate-300">
                    /
                  </span>

                  <span className="text-sm font-medium text-slate-500">
                    {product.code}
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  Detail informasi product
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowDeleteModal(true)
              }
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete Product
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {activeImage ? (
                  <button
                    type="button"
                    onClick={() =>
                      setShowImagePreview(true)
                    }
                    className="h-full w-full cursor-zoom-in"
                  >
                    <img
                      src={`${API_SERVER_URL}${activeImage.imageUrl}`}
                      alt={product.name}
                      className="h-full w-full object-cover transition hover:scale-105"
                    />
                  </button>
                ) : (
                  <Package className="h-10 w-10 text-slate-300" />
                )}
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#010736]/10 px-3 py-1 text-xs font-medium text-[#010736]">
                    {product.code}
                  </span>

                  {!editingStatus ? (
                    <>
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

                      <button
                        type="button"
                        onClick={() => {
                          setStatus(
                            product.status
                          );
                          setEditingStatus(
                            true
                          );
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-[#010736]/20 hover:bg-[#010736]/5 hover:text-[#010736]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <select
                        value={status}
                        onChange={(e) =>
                          setStatus(
                            e.target.value as
                              | "Active"
                              | "Inactive"
                          )
                        }
                        disabled={
                          savingStatus
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                      >
                        <option value="Active">
                          Active
                        </option>

                        <option value="Inactive">
                          Inactive
                        </option>
                      </select>

                      <button
                        type="button"
                        onClick={
                          handleCancelStatus
                        }
                        disabled={
                          savingStatus
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleSaveStatus
                        }
                        disabled={
                          savingStatus
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#010736] px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#02094d] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" />

                        {savingStatus
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {product.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {product.brand} •{" "}
                  {product.category}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#010736]" />

                  <h2 className="font-semibold text-slate-900">
                    Product Information
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">
                <InfoItem
                  icon={
                    <Package className="h-4 w-4" />
                  }
                  label="Product Name"
                  value={product.name}
                />

                <InfoItem
                  icon={
                    <Tag className="h-4 w-4" />
                  }
                  label="Product Code"
                  value={product.code}
                />

                <InfoItem
                  icon={
                    <Tag className="h-4 w-4" />
                  }
                  label="Category"
                  value={
                    product.category ||
                    "Belum ada category"
                  }
                />

                <InfoItem
                  icon={
                    <Tag className="h-4 w-4" />
                  }
                  label="Brand"
                  value={
                    product.brand ||
                    "Belum ada brand"
                  }
                />

                <InfoItem
                  icon={
                    <CreditCard className="h-4 w-4" />
                  }
                  label="Price"
                  value={`Rp ${
                    product.price || "0"
                  }`}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#010736]" />

                  <h2 className="font-semibold text-slate-900">
                    Deskripsi
                  </h2>
                </div>

                {!editingDescription && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingDescription(
                        true
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#010736]/20 hover:bg-[#010736]/5 hover:text-[#010736]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}
              </div>

              <div className="p-6">
                {editingDescription ? (
                  <div>
                    <textarea
                      value={description}
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      placeholder="Tambahkan deskripsi product..."
                      rows={6}
                      autoFocus
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={
                          handleCancelDescription
                        }
                        disabled={
                          savingDescription
                        }
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleSaveDescription
                        }
                        disabled={
                          savingDescription
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#010736] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#02094d] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />

                        {savingDescription
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                      {product.description?.trim() ||
                        "Belum ada deskripsi"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-[#010736]" />

                  <h2 className="font-semibold text-slate-900">
                    Spesifikasi
                  </h2>
                </div>

                {!editingSpecification && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingSpecification(
                        true
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#010736]/20 hover:bg-[#010736]/5 hover:text-[#010736]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                )}
              </div>

              <div className="p-6">
                {editingSpecification ? (
                  <div>
                    <textarea
                      value={specification}
                      onChange={(e) =>
                        setSpecification(
                          e.target.value
                        )
                      }
                      placeholder="Tambahkan spesifikasi product..."
                      rows={8}
                      autoFocus
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#010736] focus:ring-1 focus:ring-[#010736]"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={
                          handleCancelSpecification
                        }
                        disabled={
                          savingSpecification
                        }
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleSaveSpecification
                        }
                        disabled={
                          savingSpecification
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#010736] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#02094d] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />

                        {savingSpecification
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                      {product.specification?.trim() ||
                        "Belum ada spesifikasi"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#010736]" />

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Dokumen PDF
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Upload dokumen PDF untuk
                      product ini
                    </p>
                  </div>
                </div>

                <label
                  className={`inline-flex items-center gap-2 rounded-lg bg-[#010736] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#02094d] ${
                    uploadingPdf
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={handleUploadPdf}
                    disabled={uploadingPdf}
                  />

                  <FileText className="h-3.5 w-3.5" />

                  {uploadingPdf
                    ? "Uploading..."
                    : product.pdfUrl
                      ? "Ganti PDF"
                      : "Upload PDF"}
                </label>
              </div>

              <div className="p-6">
                {product.pdfUrl ? (
                  <a
                    href={`${API_SERVER_URL}${product.pdfUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#010736]/20 hover:bg-[#010736]/5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        Dokumen Product PDF
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Klik untuk membuka PDF
                        di tab baru
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-5 text-center">
                    <FileText className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Belum ada dokumen PDF
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Upload PDF untuk menyimpan
                      dokumen product
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Product Photo
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {product.images.length}{" "}
                    foto tersimpan
                  </p>
                </div>

                <label
                  className={`inline-flex items-center gap-2 rounded-lg bg-[#010736] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#02094d] ${
                    uploadingImages
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={
                      handleReplaceImages
                    }
                    disabled={uploadingImages}
                  />

                  <Pencil className="h-3.5 w-3.5" />

                  {uploadingImages
                    ? "Uploading..."
                    : "Ganti Foto"}
                </label>
              </div>

              {product.images.length > 0 &&
              activeImage ? (
                <div>
                  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() =>
                        setShowImagePreview(
                          true
                        )
                      }
                      className="block w-full cursor-zoom-in"
                    >
                      <img
                        src={`${API_SERVER_URL}${activeImage.imageUrl}`}
                        alt={`${product.name} ${
                          currentImageIndex + 1
                        }`}
                        className="aspect-square w-full object-cover transition duration-200 hover:scale-[1.02]"
                      />
                    </button>

                    {product.images.length >
                      1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentImageIndex(
                              (
                                currentImageIndex -
                                1 +
                                product.images
                                  .length
                              ) %
                                product.images
                                  .length
                            )
                          }
                          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentImageIndex(
                              (
                                currentImageIndex +
                                1
                              ) %
                                product.images
                                  .length
                            )
                          }
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 rotate-180 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                          {currentImageIndex + 1}{" "}
                          /{" "}
                          {product.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {product.images.length >
                    1 && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      {product.images.map(
                        (image, index) => (
                          <button
                            type="button"
                            key={image.id}
                            onClick={() => {
                              setCurrentImageIndex(
                                index
                              );
                              setShowImagePreview(
                                true
                              );
                            }}
                            className={`overflow-hidden rounded-lg border-2 transition ${
                              currentImageIndex ===
                              index
                                ? "border-[#010736]"
                                : "border-transparent hover:border-slate-300"
                            }`}
                          >
                            <img
                              src={`${API_SERVER_URL}${image.imageUrl}`}
                              alt={`${product.name} thumbnail ${
                                index + 1
                              }`}
                              className="aspect-square w-full object-cover"
                            />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-center">
                    <Package className="mx-auto h-16 w-16 text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-500">
                      Belum ada foto
                    </p>
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Ganti dengan 1–5 gambar JPG, PNG,
                atau WEBP. Maksimal 5 MB per gambar.
                Klik foto untuk melihat ukuran besar.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#010736]" />

                <h2 className="font-semibold text-slate-900">
                  Principal
                </h2>
              </div>

              <p className="text-xs text-slate-500">
                Principal Product ini
              </p>

              <div className="mt-3 rounded-xl bg-slate-50 p-4">
                {product.principals.length >
                0 ? (
                  <div className="space-y-2">
                    {product.principals.map(
                      (principal) => (
                        <p
                          key={principal.id}
                          className="text-sm font-medium text-slate-800"
                        >
                          {principal.name}
                        </p>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-500">
                    Belum ada principal
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* IMAGE PREVIEW MODAL */}
      {showImagePreview &&
        activeImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() =>
              setShowImagePreview(false)
            }
          >
            <div
              className="relative flex h-[92vh] w-[94vw] items-center justify-center"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="flex h-[90vh] w-[90vw] items-center justify-center">
                <img
                  src={`${API_SERVER_URL}${activeImage.imageUrl}`}
                  alt={`${product.name} ${
                    currentImageIndex + 1
                  }`}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                />
              </div>

              {/* CLOSE */}
              <button
                type="button"
                onClick={() =>
                  setShowImagePreview(false)
                }
                className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>

              {/* PREVIOUS */}
              {product.images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex(
                      (
                        currentImageIndex -
                        1 +
                        product.images.length
                      ) %
                        product.images.length
                    )
                  }
                  className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}

              {/* NEXT */}
              {product.images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentImageIndex(
                      (currentImageIndex + 1) %
                        product.images.length
                    )
                  }
                  className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 rotate-180 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                  aria-label="Next image"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
              )}

              {/* COUNTER */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  {currentImageIndex + 1} /{" "}
                  {product.images.length}
                </div>
              )}
            </div>
          </div>
        )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
          onClick={() =>
            setShowDeleteModal(false)
          }
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Delete Product
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Hapus product dari Product List
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-sm leading-6 text-red-700">
                  Apakah anda yakin mau menghapus
                  product{" "}
                  <span className="font-semibold">
                    {product.name}
                  </span>
                  ?
                </p>

                <p className="mt-2 text-xs leading-5 text-red-500">
                  Product akan dihapus dari Product
                  List.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(false)
                }
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteProduct
                }
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />

                {deleting
                  ? "Deleting..."
                  : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#010736]/10 text-[#010736]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}