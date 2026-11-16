"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  UserRound,
  LogOut,
  Search,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  X,
  Building2,
  Phone,
  Mail, 
  Package,
  ArrowLeft,
  Filter,
  Sun,
  Moon,
  Layers3,
  Bell,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import {
  Avatar,
  AvatarFallback 
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_URL = "http://localhost:5000/api";

type User = { id: string; name: string; email: string; role: string; division: string };
type Company = {
  id: string; name: string; type: "VENDOR" | "PRINCIPAL" | string;
  phone?: string | null; email?: string | null; address?: string | null;
  description?: string | null;
};
type Contact = {
  id: string; name: string; phone?: string | null; email?: string | null;
  position?: string | null; companyId: string; company?: Company | null;
  products?: Product[];
};
type Product = {
  id: string; code?: string; name?: string; category?: string; brand?: string | null;
  price?: string | number; status?: string; imageUrl?: string | null;
  companyId: string; contactId?: string | null; company?: Company | null;
  contact?: Contact | null;
};
type NavItem = { label: string; href: string; icon: LucideIcon };

const navigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Contact List", href: "/contact-list", icon: Users },
  { label: "Product Item", href: "/products", icon: Package },
  { label: "Vendor / Principal", href: "/principal", icon: Building2 },
  { label: "Product Solution", href: "/product-solution", icon: Layers3 },
];

const initials = (name?: string | null) =>
  name?.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "AA";

const divisionName = (division?: string) =>
  division === "RND" ? "RnD Division" :
  division === "SALES" ? "Sales Division" :
  division === "ADMIN" ? "Admin Division" : division || "RnD Division";

const productName = (product?: Product | null) => product?.name || "Unnamed Product";
const productImage = (product?: Product | null) =>
  product?.imageUrl?.trim() || "https://placehold.co/900x600?text=Product";

function SmallIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#EEF4FF] text-[#3970F6]">
      <Icon size={17} />
    </span>
  );
}

export default function ContactList() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("Semua Product");
  const [selectedPrincipal, setSelectedPrincipal] = useState("Semua Principal");
  const [showForm, setShowForm] = useState(false);
  const [showContactDetail, setShowContactDetail] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  const [nama, setNama] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contactRes, companyRes, productRes] = await Promise.all([
        fetch(`${API_URL}/contacts`),
        fetch(`${API_URL}/companies`),
        fetch(`${API_URL}/products`),
      ]);

      if (!contactRes.ok || !companyRes.ok || !productRes.ok) {
        throw new Error("Gagal mengambil data contact, company, atau product.");
      }

      const [contactJson, companyJson, productJson] = await Promise.all([
        contactRes.json(), companyRes.json(), productRes.json(),
      ]);

      setContacts(contactJson.success && Array.isArray(contactJson.data) ? contactJson.data : []);
      setCompanies(
        companyJson.success && Array.isArray(companyJson.data)
          ? companyJson.data.filter((company: Company) => company.type === "PRINCIPAL")
          : []
      );
      setProducts(productJson.success && Array.isArray(productJson.data) ? productJson.data : []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setContacts([]);
      setCompanies([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!token) {
      router.replace("/");
      return;
    }

    const cachedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        // Fetch the current user below.
      }
    }

    async function fetchUser() {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();

        if (!response.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("user");
          router.replace("/");
          return;
        }

        setUser(result.user || null);
      } catch (error) {
        console.error("Get user error:", error);
      }
    }

    fetchUser();
    fetchData();
  }, [router]);

  useEffect(() => {
    const principalId = new URLSearchParams(window.location.search).get("principal");
    if (!principalId) return;

    const company = companies.find((item) => String(item.id) === principalId);
    if (company) setSelectedPrincipal(company.name);
  }, [companies]);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    router.replace("/");
  };

  const principalOptions = useMemo(
    () => ["Semua Principal", ...companies.map((company) => company.name)],
    [companies]
  );

  const productOptions = useMemo(
    () => ["Semua Product", ...Array.from(new Set(products.map(productName)))],
    [products]
  );

  const filteredContacts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return contacts.filter((contact) => {
      const matchesSearch =
        !keyword ||
        contact.name?.toLowerCase().includes(keyword) ||
        contact.company?.name?.toLowerCase().includes(keyword) ||
        contact.email?.toLowerCase().includes(keyword) ||
        contact.phone?.toLowerCase().includes(keyword);

      const linkedProducts = products.filter((item) => item.contactId === contact.id);

      const matchesProduct =
        selectedProduct === "Semua Product" ||
        linkedProducts.some((item) => productName(item) === selectedProduct);

      const matchesPrincipal =
        selectedPrincipal === "Semua Principal" ||
        contact.company?.name === selectedPrincipal;

      return Boolean(matchesSearch && matchesProduct && matchesPrincipal);
    });
  }, [contacts, products, search, selectedProduct, selectedPrincipal]);

  const getContactProducts = (contact: Contact) =>
    products.filter((item) => item.contactId === contact.id);

  const openContactDetail = async (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactDetail(true);

    try {
      const response = await fetch(`${API_URL}/contacts/${contact.id}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setSelectedContact(result.data);
      }
    } catch (error) {
      console.error("Get contact detail error:", error);
    }
  };

  const addContact = async () => {
    if (!nama.trim() || !companyId || !telepon.trim() || !email.trim()) return;

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nama.trim(),
          phone: telepon.trim(),
          email: email.trim(),
          companyId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Gagal menambahkan contact");
        return;
      }

      setNama("");
      setCompanyId("");
      setTelepon("");
      setEmail("");
      setShowForm(false);

      await fetchData();
    } catch (error) {
      console.error("Create contact error:", error);
      alert("Terjadi kesalahan saat menambahkan contact");
    } finally {
      setSaving(false);
    }
  };

  const deleteContact = async () => {
    if (!selectedContact) return;

    if (!window.confirm(`Hapus contact "${selectedContact.name}"?`)) return;

    try {
      setDeleting(true);

      const response = await fetch(`${API_URL}/contacts/${selectedContact.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Gagal menghapus contact");
        return;
      }

      setSelectedContact(null);
      setShowContactDetail(false);

      await fetchData();
    } catch (error) {
      console.error("Delete contact error:", error);
      alert("Terjadi kesalahan saat menghapus contact");
    } finally {
      setDeleting(false);
    }
  };

  const openAddForm = () => {
    setNama("");
    setCompanyId("");
    setTelepon("");
    setEmail("");
    setShowForm(true);
  };

  return (
    <main className="flex min-h-screen bg-[#F3F6FB] text-[#172B4D]">
      {/* SIDEBAR */}
      <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col bg-[#0E1D38] text-white">
        <div className="px-5 pb-7 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
              <img src="/OIP.webp" alt="Comtronics Logo" className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <h2 className="whitespace-nowrap text-[16px] font-bold tracking-tight">Dashboard RnD</h2>
              <p className="mt-1 text-[8px] font-medium tracking-[0.22em] text-slate-400">MANAGEMENT PORTAL</p>
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
              const active = href === "/contact-list";

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
          <p className="text-[10px] font-medium text-slate-300">Data yang terhubung.</p>
          <p className="mt-1 text-[9px] leading-4 text-slate-500">Keputusan yang lebih baik.</p>
        </div>

        <div className="mt-auto px-2 pb-5">
          <div className="mb-4 rounded-lg bg-[#192E4C] p-3">
            <p className="text-[10px] font-semibold text-white">Satu portal, semua data.</p>
            <p className="mt-1 text-[9px] leading-4 text-slate-400">
              Kelola relasi dan katalog produk dalam satu tempat.
            </p>
          </div>

          <div className="border-t border-white/10 pt-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md p-2 text-left outline-none transition hover:bg-white/5">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-white text-xs font-bold text-[#0E1D38]">
                    {initials(user?.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">
                    {user?.name || "Loading..."}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {divisionName(user?.division)}
                  </p>
                </div>

                <ChevronDown size={15} className="text-slate-400" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" side="top" className="mb-2 w-52">
                {user?.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => router.push("/user-management")}>
                    <Users className="mr-2 h-4 w-4" /> User Management
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => router.push("/edit-profile")}>
                  <UserRound className="mr-2 h-4 w-4" /> Edit Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-5 border-b border-slate-200 bg-white px-6 lg:px-8">
          <div className="flex shrink-0 items-center gap-3 text-[11px]">
            <span className="text-slate-400">Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-[#172B4D]">Contact List</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {theme === "light" ? <Sun size={15} /> : <Moon size={15} />}
              <span className="hidden sm:inline">
                {theme === "light" ? "Light mode" : "Dark mode"}
              </span>
            </button>

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
                  <p className="text-xs font-semibold text-[#172B4D]">Notifications</p>
                  <p className="mt-2 text-[11px] text-slate-400">Belum ada notifikasi.</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] p-5 lg:p-6 xl:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                Workspace / Data Management
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#172B4D]">
                Contact List
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Kelola informasi contact dan relasinya dengan perusahaan.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={15} /> Add Contact
            </button>
          </div>

          {/* SUMMARY */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <SmallIcon icon={Users} />
              <div>
                <p className="text-[10px] text-slate-500">Total Contact</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-[#172B4D]">
                  {loading ? "—" : contacts.length.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <SmallIcon icon={Building2} />
              <div>
                <p className="text-[10px] text-slate-500">Principal Terhubung</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-[#172B4D]">
                  {loading
                    ? "—"
                    : new Set(contacts.map((contact) => contact.companyId)).size.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <SmallIcon icon={Package} />
              <div>
                <p className="text-[10px] text-slate-500">Contact dengan Product</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-[#172B4D]">
                  {loading
                    ? "—"
                    : new Set(products.map((product) => product.contactId).filter(Boolean)).size.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-bold text-[#172B4D]">Daftar Contact</h2>
                <p className="mt-1 text-[11px] text-slate-400">
                  Pilih contact untuk melihat informasi dan product terkait.
                </p>
              </div>

              <p className="text-[10px] text-slate-400">
                Menampilkan <span className="font-semibold text-slate-600">{filteredContacts.length}</span> dari {contacts.length} contact
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-[#FBFCFE] px-5 py-4">
              <div className="relative min-w-[220px] flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari nama, perusahaan, email, atau telepon..."
                  className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-9 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-300"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="relative">
                <Building2 size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <select
                  value={selectedPrincipal}
                  onChange={(event) => setSelectedPrincipal(event.target.value)}
                  className="h-9 min-w-[175px] appearance-none rounded-md border border-slate-200 bg-white pl-9 pr-8 text-xs text-slate-600 outline-none focus:border-blue-300"
                >
                  {principalOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>

                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              <div className="relative">
                <Filter size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                <select
                  value={selectedProduct}
                  onChange={(event) => setSelectedProduct(event.target.value)}
                  className="h-9 min-w-[165px] appearance-none rounded-md border border-slate-200 bg-white pl-9 pr-8 text-xs text-slate-600 outline-none focus:border-blue-300"
                >
                  {productOptions.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>

                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              {(search || selectedPrincipal !== "Semua Principal" || selectedProduct !== "Semua Product") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedPrincipal("Semua Principal");
                    setSelectedProduct("Semua Product");
                  }}
                  className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-[11px] font-medium text-slate-500 hover:bg-slate-100"
                >
                  <X size={13} /> Reset
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="bg-white text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    <th className="px-5 py-3.5">Nama Contact</th>
                    <th className="px-5 py-3.5">Perusahaan</th>
                    <th className="px-5 py-3.5">No. Telepon</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Product</th>
                    <th className="px-5 py-3.5 text-right">Detail</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="h-48 text-center text-xs text-slate-400">
                        Memuat data contact...
                      </td>
                    </tr>
                  ) : filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-56 px-5 text-center">
                        <div className="mx-auto flex max-w-xs flex-col items-center">
                          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                            <Users size={20} />
                          </span>

                          <p className="mt-3 text-sm font-semibold text-[#172B4D]">
                            {contacts.length === 0 ? "Belum ada contact" : "Contact tidak ditemukan"}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            {contacts.length === 0
                              ? "Tambahkan contact untuk mulai mengelola relasi perusahaan."
                              : "Coba ubah kata kunci pencarian atau filter yang digunakan."}
                          </p>

                          {contacts.length === 0 && (
                            <button
                              type="button"
                              onClick={openAddForm}
                              className="mt-4 inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
                            >
                              <Plus size={14} /> Add Contact
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact) => {
                      const count = products.filter((product) => product.contactId === contact.id).length;

                      return (
                        <tr
                          key={contact.id}
                          onClick={() => openContactDetail(contact)}
                          className="group cursor-pointer border-t border-slate-100 transition hover:bg-[#F8FAFD]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#EEF4FF] text-[10px] font-bold text-[#3970F6]">
                                {initials(contact.name)}
                              </span>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-[#172B4D]">
                                  {contact.name}
                                </p>
                                {contact.position && (
                                  <p className="mt-1 truncate text-[10px] text-slate-400">
                                    {contact.position}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-600">
                            {contact.company?.name || "-"}
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-600">
                            {contact.phone || "-"}
                          </td>

                          <td className="px-5 py-4 text-xs text-slate-600">
                            {contact.email || "-"}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                              {count} product
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600">
                              <ChevronRight size={15} />
                            </span>
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
                Data contact terhubung dengan Principal dan Product Item.
              </p>
              <p className="text-[10px] font-medium text-slate-500">
                {filteredContacts.length} data ditampilkan
              </p>
            </div>
          </section>
        </div>
      </section>

      {/* ADD CONTACT */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1730]/35 p-4">
          <div className="w-full max-w-[480px] rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-base font-bold text-[#172B4D]">Add Contact</h2>
                <p className="mt-1 text-xs text-slate-400">Tambahkan informasi contact baru.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">Nama</label>
                <input
                  value={nama}
                  onChange={(event) => setNama(event.target.value)}
                  placeholder="Nama contact"
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Perusahaan / Principal
                </label>

                <select
                  value={companyId}
                  onChange={(event) => setCompanyId(event.target.value)}
                  disabled={companies.length === 0}
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="">
                    {companies.length === 0 ? "Belum ada Principal" : "Pilih perusahaan"}
                  </option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>

                {companies.length === 0 && (
                  <p className="mt-1.5 text-[10px] text-rose-500">
                    Tambahkan Principal terlebih dahulu melalui halaman Vendor / Principal.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">No. Telepon</label>
                <input
                  value={telepon}
                  onChange={(event) => setTelepon(event.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@perusahaan.com"
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-9 rounded-md border border-slate-200 px-4 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={addContact}
                disabled={saving || !nama.trim() || !companyId || !telepon.trim() || !email.trim()}
                className="h-9 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? "Menyimpan..." : "Simpan Contact"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT DETAIL */}
      {showContactDetail && selectedContact && (
        <div className="fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Close contact detail"
            onClick={() => setShowContactDetail(false)}
            className="absolute inset-0 bg-[#0B1730]/30"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col border-l border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Contact Detail
                </p>
                <h2 className="mt-1 text-lg font-bold text-[#172B4D]">{selectedContact.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowContactDetail(false)}
                aria-label="Close detail"
                className="rounded-md p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-[#EAF0FF] text-sm font-bold text-[#3970F6]">
                    {initials(selectedContact.name)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-sm font-bold text-[#172B4D]">{selectedContact.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedContact.position || "Contact"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <SmallIcon icon={Building2} />
                  <div>
                    <p className="text-[10px] text-slate-400">Perusahaan</p>
                    <p className="mt-1 text-xs font-medium text-slate-700">
                      {selectedContact.company?.name || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <SmallIcon icon={Phone} />
                  <div>
                    <p className="text-[10px] text-slate-400">No. Telepon</p>
                    <p className="mt-1 text-xs font-medium text-slate-700">
                      {selectedContact.phone || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <SmallIcon icon={Mail} />
                  <div>
                    <p className="text-[10px] text-slate-400">Email</p>
                    <p className="mt-1 text-xs font-medium text-slate-700">
                      {selectedContact.email || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#172B4D]">Product Terkait</h3>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Product yang terhubung dengan contact ini.
                    </p>
                  </div>

                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                    {getContactProducts(selectedContact).length}
                  </span>
                </div>

                {getContactProducts(selectedContact).length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center">
                    <Package size={22} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-xs font-medium text-slate-500">Belum ada product</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Product dapat dihubungkan melalui halaman Product Item.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getContactProducts(selectedContact).map((product) => (
                      <button
                        type="button"
                        key={product.id}
                        onClick={() => {
                          setSelectedProductDetail(product);
                          setShowProductDetail(true);
                        }}
                        className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left hover:border-blue-200 hover:bg-slate-50"
                      >
                        <img
                          src={productImage(product)}
                          alt={productName(product)}
                          className="h-12 w-14 rounded-md border border-slate-100 object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#172B4D]">
                            {productName(product)}
                          </p>
                          <p className="mt-1 truncate text-[10px] text-slate-400">
                            {product.brand || "Brand tidak tersedia"}
                          </p>
                          {product.code && (
                            <p className="mt-1 text-[9px] text-slate-400">{product.code}</p>
                          )}
                        </div>

                        <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-600" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <p className="text-[10px] text-slate-400">Contact ID: {selectedContact.id}</p>

              <button
                type="button"
                onClick={deleteContact}
                disabled={deleting}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 size={14} />
                {deleting ? "Menghapus..." : "Hapus Contact"}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* PRODUCT DETAIL */}
      {showProductDetail && selectedProductDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B1730]/45 p-5">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductDetail(false)}
                  aria-label="Back to contact detail"
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                >
                  <ArrowLeft size={17} />
                </button>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                    Product Detail
                  </p>
                  <h2 className="mt-1 text-base font-bold text-[#172B4D]">
                    {productName(selectedProductDetail)}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowProductDetail(false)}
                aria-label="Close product detail"
                className="rounded-md p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid gap-7 p-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <img
                    src={productImage(selectedProductDetail)}
                    alt={productName(selectedProductDetail)}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="mt-2 text-[10px] text-slate-400">Gambar product</p>
              </div>

              <div className="space-y-5">
                {[
                  ["Product Code", selectedProductDetail.code],
                  ["Perusahaan", selectedProductDetail.company?.name],
                  ["Category", selectedProductDetail.category],
                  ["Brand", selectedProductDetail.brand],
                  ["Price", selectedProductDetail.price !== undefined
                    ? `Rp ${selectedProductDetail.price}`
                    : undefined],
                  ["Status", selectedProductDetail.status],
                ].filter((item) => item[1]).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10px] font-medium text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-[#172B4D]">{value}</p>
                  </div>
                ))}

                <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Package size={17} />
                    <p className="text-xs font-semibold">Product Information</p>
                  </div>
                  <p className="mt-2 text-[10px] leading-5 text-slate-500">
                    Product ini terhubung dengan contact berdasarkan contact yang dipilih saat product dibuat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}