"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Trash2,
  X,
  Building2,
  Tag,
  FileText,
  ListChecks,
  Pencil,
  Check,
  ExternalLink,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";
const API_SERVER_URL = "http://localhost:5000";

type ProductSolutionDocument = {
  id: string;
  name: string;
  fileUrl: string;
};

type ProductSolution = {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  image: string;
  description: string;
  specification: string;
  companyId: string;
  contactId: string | null;
  principalId: string | null;
  principal: {
    id: string;
    name: string;
  } | null;
  principals: {
    id: string;
    name: string;
  }[];
  documents: ProductSolutionDocument[];
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

  principals?: {
    id: string;
    name: string;
  }[];

  documents?: ProductSolutionDocument[];
};

export default function ProductSolutionDetailPage() {
  const router = useRouter();
  const params = useParams();

  const productSolutionId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [productSolution, setProductSolution] =
    useState<ProductSolution | null>(null);

  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [editingDescription, setEditingDescription] =
    useState(false);

  const [description, setDescription] = useState("");

  const [editingSpecification, setEditingSpecification] =
    useState(false);

  const [specification, setSpecification] = useState("");

  const [savingDescription, setSavingDescription] =
    useState(false);

  const [savingSpecification, setSavingSpecification] =
    useState(false);

  const [deleting, setDeleting] = useState(false);

  const [uploadingPdf, setUploadingPdf] =
    useState(false);

  const [deletingDocumentId, setDeletingDocumentId] =
    useState<string | null>(null);

  const loadProductSolution = async () => {
    if (!productSolutionId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/product-solutions/${productSolutionId}`
      );

      const result = await response.json();

      if (!response.ok || !result.success || !result.data) {
        setProductSolution(null);
        return;
      }

      const apiProductSolution: ApiProductSolution =
        result.data;

      const mappedProductSolution: ProductSolution = {
        id: apiProductSolution.id,
        code: apiProductSolution.code,
        name: apiProductSolution.name,
        category: apiProductSolution.category,
        brand: apiProductSolution.brand,
        image: apiProductSolution.imageUrl ?? "",
        description:
          apiProductSolution.description ?? "",
        specification:
          apiProductSolution.specification ?? "",
        companyId: apiProductSolution.companyId,
        contactId: apiProductSolution.contactId,
        principalId: apiProductSolution.principalId,
        principal:
          apiProductSolution.principal ?? null,
        principals:
          apiProductSolution.principals ?? [],
        documents:
          apiProductSolution.documents ?? [],
      };

      setProductSolution(mappedProductSolution);

      setDescription(
        apiProductSolution.description ?? ""
      );

      setSpecification(
        apiProductSolution.specification ?? ""
      );
    } catch (error) {
      console.error(
        "Load product solution detail error:",
        error
      );

      setProductSolution(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!productSolutionId) return;

    loadProductSolution();
  }, [productSolutionId]);

  const handleSaveDescription = async () => {
    if (
      !productSolution ||
      savingDescription
    ) {
      return;
    }

    try {
      setSavingDescription(true);

      const trimmedDescription =
        description.trim();

      const response = await fetch(
        `${API_BASE_URL}/product-solutions/${productSolution.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: trimmedDescription,
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

      const apiProductSolution: ApiProductSolution =
        result.data;

      setProductSolution((current) => {
        if (!current) return current;

        return {
          ...current,
          description:
            apiProductSolution.description ?? "",
        };
      });

      setDescription(
        apiProductSolution.description ?? ""
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
    if (!productSolution) return;

    setDescription(
      productSolution.description ?? ""
    );

    setEditingDescription(false);
  };

  const handleSaveSpecification = async () => {
    if (
      !productSolution ||
      savingSpecification
    ) {
      return;
    }

    try {
      setSavingSpecification(true);

      const trimmedSpecification =
        specification.trim();

      const response = await fetch(
        `${API_BASE_URL}/product-solutions/${productSolution.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            specification: trimmedSpecification,
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

      const apiProductSolution: ApiProductSolution =
        result.data;

      setProductSolution((current) => {
        if (!current) return current;

        return {
          ...current,
          specification:
            apiProductSolution.specification ?? "",
        };
      });

      setSpecification(
        apiProductSolution.specification ?? ""
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
    if (!productSolution) return;

    setSpecification(
      productSolution.specification ?? ""
    );

    setEditingSpecification(false);
  };

  const handleUploadPdf = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!productSolution) return;

    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) return;

    if (files.length > 10) {
      alert(
        "Maksimal 10 PDF dalam sekali upload"
      );

      event.target.value = "";
      return;
    }

    const invalidFile = files.find(
      (file) =>
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    );

    if (invalidFile) {
      alert(
        `File "${invalidFile.name}" bukan PDF`
      );

      event.target.value = "";
      return;
    }

    const oversizedFile = files.find(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFile) {
      alert(
        `File "${oversizedFile.name}" melebihi ukuran maksimal 10 MB`
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingPdf(true);

      const formData = new FormData();

      files.forEach((file) => {
        formData.append("pdfs", file);
      });

      const response = await fetch(
        `${API_BASE_URL}/product-solutions/${productSolution.id}/documents`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal mengupload PDF"
        );
        return;
      }

      await loadProductSolution();

      alert(
        `${files.length} PDF berhasil diupload`
      );
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

  const handleDeleteDocument = async (
    documentId: string
  ) => {
    if (
      !productSolution ||
      deletingDocumentId
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Apakah anda yakin mau menghapus dokumen PDF ini?"
    );

    if (!confirmed) return;

    try {
      setDeletingDocumentId(documentId);

      const response = await fetch(
        `${API_BASE_URL}/product-solutions/${productSolution.id}/documents/${documentId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menghapus dokumen PDF"
        );
        return;
      }

      setProductSolution((current) => {
        if (!current) return current;

        return {
          ...current,
          documents: current.documents.filter(
            (document) =>
              document.id !== documentId
          ),
        };
      });
    } catch (error) {
      console.error(
        "Delete document error:",
        error
      );

      alert(
        "Terjadi kesalahan saat menghapus dokumen PDF"
      );
    } finally {
      setDeletingDocumentId(null);
    }
  };

  const handleDeleteProductSolution = async () => {
    if (
      !productSolution ||
      deleting
    ) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_BASE_URL}/product-solutions/${productSolution.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menghapus product solution"
        );
        return;
      }

      setShowDeleteModal(false);

      router.push("/product-solution");
      router.refresh();
    } catch (error) {
      console.error(
        "Delete product solution error:",
        error
      );

      alert(
        "Terjadi kesalahan saat menghapus product solution"
      );
    } finally {
      setDeleting(false);
    }
  };

  const getFileUrl = (fileUrl: string) => {
    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    return `${API_SERVER_URL}${fileUrl}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">
          Loading product solution...
        </div>
      </div>
    );
  }

  if (!productSolution) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex h-16 items-center">
              <Link
                href="/product-solution"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-[#0D0628]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div className="ml-4">
                <h1 className="text-xl font-semibold text-slate-900">
                  Product Solution Detail
                </h1>

                <p className="text-sm text-slate-500">
                  Product solution tidak ditemukan
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto flex max-w-7xl items-center justify-center px-6 py-20">
          <div className="text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
              Product solution tidak ditemukan
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Product solution mungkin sudah
              dihapus atau belum tersimpan.
            </p>

            <Link
              href="/product-solution"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#010736] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#02094d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Product Solution List
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/product-solution"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-[#010736]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-slate-900">
                    Product Solution Detail
                  </h1>

                  <span className="text-slate-300">
                    /
                  </span>

                  <span className="text-sm font-medium text-slate-500">
                    {productSolution.code}
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  Detail informasi product solution
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
              Delete Product Solution
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* SUMMARY */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {productSolution.image ? (
                  <img
                    src={productSolution.image}
                    alt={productSolution.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-10 w-10 text-slate-300" />
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-[#0D0628]/10 px-3 py-1 text-xs font-medium text-[#0D0628]">
                    {productSolution.code}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {productSolution.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {productSolution.brand} •{" "}
                  {productSolution.category}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            {/* PRODUCT INFORMATION */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#0D0628]" />

                  <h2 className="font-semibold text-slate-900">
                    Product Solution Information
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">
                <InfoItem
                  icon={
                    <Package className="h-4 w-4" />
                  }
                  label="Product Solution Name"
                  value={
                    productSolution.name
                  }
                />

                <InfoItem
                  icon={
                    <Tag className="h-4 w-4" />
                  }
                  label="Product Solution Code"
                  value={
                    productSolution.code
                  }
                />

                <InfoItem
                  icon={
                    <Tag className="h-4 w-4" />
                  }
                  label="Category"
                  value={
                    productSolution.category ||
                    "Belum ada category"
                  }
                />

                <InfoItem
                  icon={
                    <Tag className="h-4 w-4" />
                  }
                  label="Brand"
                  value={
                    productSolution.brand ||
                    "Belum ada brand"
                  }
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#0D0628]" />

                  <h2 className="font-semibold text-slate-900">
                    Deskripsi
                  </h2>
                </div>

                {!editingDescription && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingDescription(true)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#0D0628]/20 hover:bg-[#0D0628]/5 hover:text-[#0D0628]"
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
                      placeholder="Tambahkan deskripsi product solution..."
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
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0D0628] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1A0D45] disabled:cursor-not-allowed disabled:opacity-50"
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
                      {productSolution.description?.trim() ||
                        "Belum ada deskripsi"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SPECIFICATION */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-[#0D0628]" />

                  <h2 className="font-semibold text-slate-900">
                    Spesifikasi
                  </h2>
                </div>

                {!editingSpecification && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingSpecification(true)
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#0D0628]/20 hover:bg-[#0D0628]/5 hover:text-[#0D0628]"
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
                      placeholder="Tambahkan spesifikasi product solution..."
                      rows={8}
                      autoFocus
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
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
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0D0628] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1A0D45] disabled:cursor-not-allowed disabled:opacity-50"
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
                      {productSolution.specification?.trim() ||
                        "Belum ada spesifikasi"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* MULTIPLE PDF */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#0D0628]" />

                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Dokumen PDF
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Upload satu atau beberapa dokumen PDF
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
                    multiple
                    className="hidden"
                    onChange={handleUploadPdf}
                    disabled={uploadingPdf}
                  />

                  <FileText className="h-3.5 w-3.5" />

                  {uploadingPdf
                    ? "Uploading..."
                    : "Upload PDF"}
                </label>
              </div>

              <div className="p-6">
                {productSolution.documents.length >
                0 ? (
                  <div className="space-y-3">
                    {productSolution.documents.map(
                      (document) => {
                        const fileUrl =
                          getFileUrl(
                            document.fileUrl
                          );

                        return (
                          <div
                            key={document.id}
                            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#0D0628]/20 hover:bg-[#0D0628]/5"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                              <FileText className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {document.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Dokumen PDF
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#0D0628]/20 hover:bg-[#0D0628]/5 hover:text-[#0D0628]"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteDocument(
                                    document.id
                                  )
                                }
                                disabled={
                                  deletingDocumentId ===
                                  document.id
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />

                                {deletingDocumentId ===
                                document.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl bg-slate-50 p-5 text-center">
                    <FileText className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-2 text-sm font-medium text-slate-500">
                      Belum ada dokumen PDF
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Upload PDF untuk menyimpan dokumen
                      product solution
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* PHOTO */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-slate-900">
                  Product Solution Photo
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Foto product solution yang tersimpan
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {productSolution.image ? (
                  <img
                    src={productSolution.image}
                    alt={productSolution.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center">
                    <Package className="h-16 w-16 text-slate-300" />
                  </div>
                )}
              </div>
            </div>

            {/* PRINCIPAL */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#0D0628]" />

                <h2 className="font-semibold text-slate-900">
                  Principal
                </h2>
              </div>

              <p className="text-xs text-slate-500">
                Principal Product Solution ini
              </p>

              <div className="mt-3 rounded-xl bg-slate-50 p-4">
                {productSolution.principals.length >
                0 ? (
                  <div className="space-y-2">
                    {productSolution.principals.map(
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
                ) : productSolution.principal ? (
                  <p className="text-sm font-medium text-slate-800">
                    {productSolution.principal.name}
                  </p>
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
                  Delete Product Solution
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Hapus product solution dari Product
                  Solution List
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
                  product solution{" "}
                  <span className="font-semibold">
                    {productSolution.name}
                  </span>
                  ?
                </p>

                <p className="mt-2 text-xs leading-5 text-red-500">
                  Product solution akan dihapus dari
                  Product Solution List beserta dokumen
                  PDF-nya.
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
                  handleDeleteProductSolution
                }
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />

                {deleting
                  ? "Deleting..."
                  : "Delete Product Solution"}
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
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0D0628]/10 text-[#0D0628]">
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