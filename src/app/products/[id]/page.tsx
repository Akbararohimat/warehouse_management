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

  description?: string;
  specification?: string;
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();

  const productCode = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [product, setProduct] =
    useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [editingDescription, setEditingDescription] =
    useState(false);

  const [description, setDescription] =
    useState("");

  const [editingSpecification, setEditingSpecification] =
    useState(false);

  const [specification, setSpecification] =
    useState("");

  useEffect(() => {
    if (!productCode) return;

    const loadProduct = () => {
      const storedProducts =
        localStorage.getItem("rnd_products");

      if (!storedProducts) {
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        const products: Product[] =
          JSON.parse(storedProducts);

        const foundProduct =
          products.find(
            (item) => item.code === productCode
          );

        if (!foundProduct) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(foundProduct);

        setDescription(
          foundProduct.description ?? ""
        );

        setSpecification(
          foundProduct.specification ?? ""
        );
      } catch {
        setProduct(null);
      }

      setLoading(false);
    };

    loadProduct();
  }, [productCode]);


  const saveProduct = (
    updatedProduct: Product
  ) => {
    const storedProducts =
      localStorage.getItem("rnd_products");

    if (!storedProducts) return;

    try {
      const products: Product[] =
        JSON.parse(storedProducts);

      const updatedProducts =
        products.map((item) =>
          item.id === updatedProduct.id
            ? updatedProduct
            : item
        );

      localStorage.setItem(
        "rnd_products",
        JSON.stringify(updatedProducts)
      );

      setProduct(updatedProduct);
    } catch {
      
    }
  };


  const handleSaveDescription = () => {
    if (!product) return;

    const updatedProduct: Product = {
      ...product,
      description: description.trim(),
    };

    saveProduct(updatedProduct);

    setDescription(
      description.trim()
    );

    setEditingDescription(false);
  };

  const handleCancelDescription = () => {
    if (!product) return;

    setDescription(
      product.description ?? ""
    );

    setEditingDescription(false);
  };

  const handleSaveSpecification = () => {
    if (!product) return;

    const updatedProduct: Product = {
      ...product,
      specification:
        specification.trim(),
    };

    saveProduct(updatedProduct);

    setSpecification(
      specification.trim()
    );

    setEditingSpecification(false);
  };

  const handleCancelSpecification = () => {
    if (!product) return;

    setSpecification(
      product.specification ?? ""
    );

    setEditingSpecification(false);
  };

  const handleDeleteProduct = () => {
    if (!product) return;

    const storedProducts =
      localStorage.getItem("rnd_products");

    if (storedProducts) {
      try {
        const products: Product[] =
          JSON.parse(storedProducts);

        const updatedProducts =
          products.filter(
            (item) =>
              item.id !== product.id
          );

        localStorage.setItem(
          "rnd_products",
          JSON.stringify(updatedProducts)
        );
      } catch {
      }
    }

    setShowDeleteModal(false);

    router.push("/products");
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-[#0D0628]"
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
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0D0628] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1A0D45]"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Product List
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
                href="/products"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-[#0D0628]"
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
              {/* IMAGE */}

              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-10 w-10 text-slate-300" />
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-[#0D0628]/10 px-3 py-1 text-xs font-medium text-[#0D0628]">
                    {product.code}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {product.status}
                  </span>
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
                  <Package className="h-5 w-5 text-[#0D0628]" />

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
                    <Building2 className="h-4 w-4" />
                  }
                  label="Perusahaan"
                  value={
                    product.vendor ||
                    "Belum ada perusahaan"
                  }
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
                      placeholder="Tambahkan deskripsi product..."
                      rows={6}
                      autoFocus
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0D0628] focus:ring-1 focus:ring-[#0D0628]"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={
                          handleCancelDescription
                        }
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleSaveDescription
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0D0628] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1A0D45]"
                      >
                        <Check className="h-4 w-4" />
                        Save
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
                      placeholder="Tambahkan spesifikasi product..."
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
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleSaveSpecification
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0D0628] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1A0D45]"
                      >
                        <Check className="h-4 w-4" />
                        Save
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
          </div>

          <div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-slate-900">
                  Product Photo
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Foto product yang tersimpan
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center">
                    <Package className="h-16 w-16 text-slate-300" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

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
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteProduct
                }
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Delete Product
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