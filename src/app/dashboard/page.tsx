"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  Building2,
  UserRound,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Layers3,
  Search,
  Bell,
  Plus,
  ArrowRight,
  Box,
  X,
} from "lucide-react";

import { useTheme } from "@/components/ThemeProvider";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE_URL = "http://localhost:5000/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  division: string;
};

type Contact = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  company?: {
    id: string;
    name: string;
  } | null;
  companyId?: string | null;
  createdAt?: string;
};

type Product = {
  id: string;
  code: string;
  name: string;
  category?: string;
  brand?: string;
  status?: string;
  createdAt?: string;
  company?: {
    id: string;
    name: string;
  } | null;
  companyId?: string | null;
};

type Company = {
  id: string;
  name: string;
  type: "VENDOR" | "PRINCIPAL" | string;
  phone?: string | null;
  email?: string | null;
  createdAt?: string;
  productCount?: number;
  principalCount?: number;
};

type ProductSolution = {
  id: string;
  code: string;
  name: string;
  category?: string;
  brand?: string;
  createdAt?: string;
  company?: {
    id: string;
    name: string;
  } | null;
  companyId?: string | null;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navigation: NavItem[] = [
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getDivisionName(division: string) {
  if (division === "RND") return "RnD Division";
  if (division === "SALES") return "Sales Division";
  if (division === "ADMIN") return "Admin Division";

  return division;
}

function SectionHeader({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-sm font-bold text-[#172B4D]">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="flex shrink-0 items-center gap-1 text-xs font-medium text-blue-600 transition hover:text-blue-800"
      >
        Lihat semua
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  featured = false,
  badge,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  featured?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`flex min-w-0 items-start justify-between rounded-lg border p-4 ${
        featured
          ? "border-[#142A49] bg-[#142A49] text-white"
          : "border-slate-200 bg-white text-[#172B4D]"
      }`}
    >
      <div className="min-w-0">
        <p
          className={`text-xs ${
            featured ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {title}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-2xl font-bold leading-none tabular-nums">
            {value.toLocaleString("id-ID")}
          </span>

          {badge && (
            <span className="rounded bg-amber-50 px-2 py-1 text-[9px] font-medium text-amber-700">
              {badge}
            </span>
          )}
        </div>

        <p
          className={`mt-3 text-[10px] ${
            featured ? "text-slate-300" : "text-slate-400"
          }`}
        >
          {description}
        </p>
      </div>

      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          featured
            ? "bg-white/10 text-white"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        <Icon size={17} />
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  buttonLabel,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className="flex min-h-[215px] flex-col items-center justify-center px-5 py-7 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={22} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#172B4D]">
        {title}
      </h3>

      <p className="mt-2 max-w-[270px] text-xs leading-5 text-slate-400">
        {description}
      </p>

      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
      >
        <Plus size={14} />
        {buttonLabel}
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [user, setUser] = useState<User | null>(null);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [productSolutions, setProductSolutions] = useState<ProductSolution[]>([]);

  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingSolutions, setLoadingSolutions] = useState(true);

  const [search, setSearch] = useState("");

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (!token) {
      router.replace("/");
      return;
    }

    async function fetchUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          sessionStorage.removeItem("authToken");
          sessionStorage.removeItem("user");

          router.replace("/");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("Get user error:", error);
      }
    }

    async function fetchData(
      endpoint: string,
      setter: (data: any[]) => void,
      setLoading: (loading: boolean) => void
    ) {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          return;
        }

        setter(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error(`Get ${endpoint} error:`, error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    fetchData("contacts", setContacts, setLoadingContacts);
    fetchData("products", setProducts, setLoadingProducts);
    fetchData("companies", setCompanies, setLoadingCompanies);
    fetchData("product-solutions", setProductSolutions, setLoadingSolutions);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");

    router.replace("/");
  };

  const contactChartData = useMemo(() => {
    const map = new Map<string, number>();

    contacts.forEach((contact) => {
      const name =
        contact.company?.name ||
        (contact.companyId ? "Perusahaan" : "Tanpa Perusahaan");

      map.set(name, (map.get(name) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [contacts]);

  const productStatus = useMemo(() => {
    const active = products.filter(
      (product) =>
        String(product.status).toUpperCase() === "ACTIVE"
    ).length;

    const inactive = products.filter(
      (product) =>
        String(product.status).toUpperCase() === "INACTIVE"
    ).length;

    return {
      active,
      inactive,
      total: products.length,
    };
  }, [products]);

  const companyTableData = useMemo(() => {
    return [...companies]
      .sort(
        (a, b) =>
          (b.principalCount || 0) +
          (b.productCount || 0) -
          ((a.principalCount || 0) + (a.productCount || 0))
      )
      .slice(0, 5);
  }, [companies]);

  const totalPrincipals = useMemo(
    () =>
      companies.filter(
        (company) => company.type === "PRINCIPAL"
      ).length,
    [companies]
  );

  const totalVendors = useMemo(
    () =>
      companies.filter(
        (company) => company.type === "VENDOR"
      ).length,
    [companies]
  );

  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    const results = [
      ...contacts.map((item) => ({
        name: item.name,
        subtitle: item.company?.name || "Contact",
        href: "/contact-list",
      })),
      ...products.map((item) => ({
        name: item.name,
        subtitle: item.code,
        href: "/products",
      })),
      ...companies.map((item) => ({
        name: item.name,
        subtitle: item.type,
        href: "/principal",
      })),
      ...productSolutions.map((item) => ({
        name: item.name,
        subtitle: item.code,
        href: "/product-solution",
      })),
    ];

    return results
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.subtitle.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [search, contacts, products, companies, productSolutions]);

  // Donut chart animation values
  const donutCircumference = 2 * Math.PI * 54;

  const activePercentage =
    productStatus.total > 0
      ? (productStatus.active / productStatus.total) * 100
      : 0;

  const activeDashOffset =
    donutCircumference -
    (activePercentage / 100) * donutCircumference;

  // Contact chart maximum value
  const maxContactValue = Math.max(
    ...contactChartData.map((item) => item.value),
    1
  );

  return (
    <main className="flex min-h-screen bg-[#F3F6FB] text-[#172B4D]">
      {/* SIDEBAR */}
      <aside className="sticky top-0 flex h-screen w-[250px] shrink-0 flex-col bg-[#0E1D38] text-white">
        {/* BRANDING */}
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

        {/* NAVIGATION */}
        <div className="px-3">
          <p className="mb-3 px-2 text-[9px] font-semibold tracking-[0.18em] text-slate-500">
            WORKSPACE
          </p>

          <nav className="space-y-1">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = index === 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
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

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR INFORMATION */}
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

          <div className="border-t border-white/10 pt-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md p-2 text-left outline-none transition hover:bg-white/5">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-white text-xs font-bold text-[#0E1D38]">
                    {user ? getInitials(user.name) : "AA"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">
                    {user?.name || "Loading..."}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-400">
                    {user
                      ? getDivisionName(user.division)
                      : "Loading..."}
                  </p>
                </div>

                <ChevronDown size={15} className="text-slate-400" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" side="top" className="mb-2 w-52">
                {user?.role === "ADMIN" && (
                  <DropdownMenuItem
                    onClick={() => router.push("/user-management")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    User Management
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => router.push("/edit-profile")}
                >
                  <UserRound className="mr-2 h-4 w-4" />
                  Edit Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* SEARCH */}
            <div className="relative hidden w-[255px] md:block lg:w-[320px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari contact, product, atau vendor..."
                className="h-9 w-full rounded-md border border-transparent bg-[#F3F6FA] pl-9 pr-9 text-[10px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={13} />
                </button>
              )}

              {search.trim() && (
                <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <button
                        key={`${result.href}-${index}`}
                        type="button"
                        onClick={() => {
                          router.push(result.href);
                          setSearch("");
                        }}
                        className="flex w-full flex-col border-b border-slate-100 px-4 py-3 text-left transition last:border-0 hover:bg-slate-50"
                      >
                        <span className="text-xs font-medium text-slate-700">
                          {result.name}
                        </span>
                        <span className="mt-1 text-[10px] text-slate-400">
                          {result.subtitle}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-4 text-xs text-slate-400">
                      Data tidak ditemukan.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* THEME */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {theme === "light" ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              )}

              <span className="hidden sm:inline">
                {theme === "light" ? "Light mode" : "Dark mode"}
              </span>
            </button>

            {/* NOTIFICATION */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
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

        {/* DASHBOARD BODY */}
        <div className="mx-auto w-full max-w-[1600px] p-5 lg:p-6 xl:p-8">
          {/* PAGE TITLE */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#172B4D]">
                Dashboard
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Selamat datang di RnD Web Portal. Semua data penting, dalam satu tampilan.
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-md bg-blue-600 px-4 text-xs font-semibold text-white transition hover:bg-blue-700">
                <Plus size={15} />
                Tambah data
                <ChevronDown size={13} />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => router.push("/contact-list")}>
                  <Users className="mr-2 h-4 w-4" />
                  Contact
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/products")}>
                  <Package className="mr-2 h-4 w-4" />
                  Product Item
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/principal")}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Vendor / Principal
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => router.push("/product-solution")}
                >
                  <Layers3 className="mr-2 h-4 w-4" />
                  Product Solution
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* KPI CARDS */}
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Contact"
              value={contacts.length}
              description={`Dari ${new Set(
                contacts
                  .map((contact) => contact.company?.name)
                  .filter(Boolean)
              ).size} perusahaan`}
              icon={Users}
              featured
            />

            <StatCard
              title="Total Product"
              value={products.length}
              description={`${productStatus.active} active · ${productStatus.inactive} inactive`}
              icon={Box}
            />

            <StatCard
              title="Total Company"
              value={companies.length}
              description={`${totalVendors} vendor · ${totalPrincipals} principal`}
              icon={Building2}
            />

            <StatCard
              title="Product Solution"
              value={productSolutions.length}
              description={
                productSolutions.length > 0
                  ? "Solution dalam katalog"
                  : "Belum ada solution"
              }
              icon={Layers3}
              badge={
                productSolutions.length === 0
                  ? "Belum tersedia"
                  : undefined
              }
            />
          </div>

          {/* FIRST ROW */}
          <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-2">
            {/* CONTACT LIST */}
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <SectionHeader
                title="Contact List"
                description="Jumlah contact berdasarkan perusahaan"
                href="/contact-list"
              />

              <div className="px-5 py-3">
                <div className="mb-2 grid grid-cols-[90px_1fr_45px] items-center gap-4 text-[8px] font-semibold tracking-wider text-slate-400 sm:grid-cols-[90px_1fr_45px]">
                  <span>PERUSAHAAN</span>
                  <span />
                  <span className="text-center">CONTACT</span>
                </div>

                {loadingContacts ? (
                  <div className="flex h-[165px] items-center justify-center text-xs text-slate-400">
                    Loading contact data...
                  </div>
                ) : contactChartData.length === 0 ? (
                  <div className="flex h-[165px] items-center justify-center text-xs text-slate-400">
                    Belum ada contact.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {contactChartData.slice(0, 4).map((item, index) => {
                      const percentage =
                        (item.value / maxContactValue) * 100;

                      return (
                        <div
                          key={item.label}
                          className="grid grid-cols-[90px_1fr_45px] items-center gap-4 border-b border-slate-100 py-3 last:border-0 sm:grid-cols-[90px_1fr_45px]"
                        >
                          <span className="truncate text-[10px] font-medium text-[#263B5C]">
                            {item.label}
                          </span>

                          <div className="h-[6px] overflow-hidden rounded-full bg-[#EDF2F9]">
                            <motion.div
                              className="h-full rounded-full bg-[#4075F5]"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{
                                duration: 0.9,
                                delay: index * 0.13,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            />
                          </div>

                          <span className="text-center text-[11px] font-semibold tabular-nums text-[#172B4D]">
                            {item.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[9px] text-slate-400">
                <span>
                  {Math.min(contactChartData.length, 4)} contact terbesar
                </span>

                <span className="font-medium text-slate-500">
                  Total {contacts.length}
                </span>
              </div>
            </section>

            {/* PRODUCT ITEM */}
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <SectionHeader
                title="Product Item"
                description="Perbandingan status product"
                href="/products"
              />

              <div className="grid min-h-[205px] grid-cols-1 items-center gap-5 px-5 py-5 sm:grid-cols-[145px_1fr]">
                {loadingProducts ? (
                  <div className="col-span-full flex h-[165px] items-center justify-center text-xs text-slate-400">
                    Loading product data...
                  </div>
                ) : products.length === 0 ? (
                  <div className="col-span-full flex h-[165px] items-center justify-center text-xs text-slate-400">
                    Belum ada product.
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <div className="relative flex h-[125px] w-[125px] items-center justify-center">
                        <svg
                          viewBox="0 0 140 140"
                          className="h-[125px] w-[125px]"
                          role="img"
                          aria-label={`${activePercentage.toFixed(0)}% product active`}
                        >
                          <g transform="rotate(-90 70 70)">
                            {/* Inactive ring */}
                            <circle
                              cx="70"
                              cy="70"
                              r="54"
                              fill="none"
                              stroke="#F16B73"
                              strokeWidth="13"
                            />

                            {/* Active ring animation */}
                            <motion.circle
                              cx="70"
                              cy="70"
                              r="54"
                              fill="none"
                              stroke="#3970F6"
                              strokeWidth="13"
                              strokeLinecap="butt"
                              strokeDasharray={donutCircumference}
                              initial={{
                                strokeDashoffset: donutCircumference,
                              }}
                              animate={{
                                strokeDashoffset: activeDashOffset,
                              }}
                              transition={{
                                duration: 1.3,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            />
                          </g>
                        </svg>

                        {/* Center content */}
                        <motion.div
                          initial={{
                            opacity: 0,
                            scale: 0.75,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          transition={{
                            duration: 0.5,
                            delay: 0.25,
                            ease: "easeOut",
                          }}
                          className="absolute flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full bg-white"
                        >
                          <span className="text-2xl font-bold text-[#172B4D]">
                            {products.length}
                          </span>

                          <span className="mt-1 text-[9px] text-slate-400">
                            total product
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-[7px] w-[7px] rounded-full bg-[#4075F5]" />
                          <span className="text-xs text-slate-600">
                            Active
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-[#172B4D]">
                          {productStatus.active}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-b border-slate-100 py-3">
                        <div className="flex items-center gap-2">
                          <span className="h-[7px] w-[7px] rounded-full bg-[#F16B73]" />
                          <span className="text-xs text-slate-600">
                            Inactive
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-[#172B4D]">
                          {productStatus.inactive}
                        </span>
                      </div>

                      <div className="mt-3 rounded-md bg-blue-50 px-3 py-2 text-[10px] font-medium text-blue-600">
                        {Math.round(activePercentage)}% product berstatus active
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-slate-100 px-5 py-3 text-[9px] text-slate-400">
                Status product pada katalog saat ini
              </div>
            </section>
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr]">
            {/* VENDOR / PRINCIPAL */}
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <SectionHeader
                title="Vendor / Principal"
                description="Jumlah product dan principal yang digunakan"
                href="/principal"
              />

              {loadingCompanies ? (
                <div className="flex h-[220px] items-center justify-center text-xs text-slate-400">
                  Loading company data...
                </div>
              ) : companies.length === 0 ? (
                <EmptyState
                  icon={Building2}
                  title="Belum ada perusahaan"
                  description="Tambahkan vendor atau principal untuk mulai membangun katalog."
                  buttonLabel="Tambah perusahaan"
                  href="/principal"
                />
              ) : (
                <>
                  <div className="grid grid-cols-[minmax(0,1fr)_85px_85px_20px] items-center gap-2 bg-[#F7F9FC] px-5 py-3 text-[8px] font-semibold tracking-wider text-slate-400">
                    <span>PERUSAHAAN</span>

                    <span className="text-center">
                      <span className="mr-1 inline-block h-[5px] w-[5px] rounded-sm bg-amber-400" />
                      PRINCIPAL
                    </span>

                    <span className="text-center">
                      <span className="mr-1 inline-block h-[5px] w-[5px] rounded-sm bg-blue-500" />
                      PRODUCT
                    </span>

                    <span />
                  </div>

                  <div className="px-5">
                    {companyTableData.map((company) => (
                      <Link
                        key={company.id}
                        href="/principal"
                        className="grid grid-cols-[minmax(0,1fr)_85px_85px_20px] items-center gap-2 border-b border-slate-100 py-2.5 transition last:border-0 hover:bg-slate-50"
                      >
                        <span className="truncate text-[10px] font-medium text-[#263B5C]">
                          {company.name}
                        </span>

                        <span className="mx-auto min-w-[35px] rounded-md bg-amber-50 px-2 py-1 text-center text-[10px] font-semibold text-amber-700">
                          {company.principalCount || 0}
                        </span>

                        <span className="mx-auto min-w-[35px] rounded-md bg-blue-50 px-2 py-1 text-center text-[10px] font-semibold text-blue-600">
                          {company.productCount || 0}
                        </span>

                        <ChevronDown
                          size={13}
                          className="-rotate-90 text-slate-400"
                        />
                      </Link>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-[9px] text-slate-400">
                    <span>
                      {companies.length} perusahaan
                    </span>

                    <span className="font-medium text-slate-500">
                      {totalPrincipals} principal / {products.length} product
                    </span>
                  </div>
                </>
              )}
            </section>

            {/* PRODUCT SOLUTION */}
            <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-bold text-[#172B4D]">
                  Product Solution
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Solution berdasarkan kategori
                </p>
              </div>

              {loadingSolutions ? (
                <div className="flex h-[270px] items-center justify-center text-xs text-slate-400">
                  Loading solution data...
                </div>
              ) : productSolutions.length === 0 ? (
                <EmptyState
                  icon={Layers3}
                  title="Belum ada Product Solution"
                  description="Tambahkan solution pertama untuk mengelompokkan product berdasarkan kategori."
                  buttonLabel="Tambah solution"
                  href="/product-solution"
                />
              ) : (
                <div className="space-y-3 p-5">
                  {Array.from(
                    new Set(
                      productSolutions.map(
                        (item) => item.category || "Tanpa kategori"
                      )
                    )
                  ).map((category) => {
                    const count = productSolutions.filter(
                      (item) =>
                        (item.category || "Tanpa kategori") === category
                    ).length;

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-3"
                      >
                        <span className="text-xs font-medium text-[#263B5C]">
                          {category}
                        </span>

                        <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                          {count}
                        </span>
                      </div>
                    );
                  })}

                  <Link
                    href="/product-solution"
                    className="flex items-center justify-center gap-2 rounded-md bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    Lihat Product Solution
                    <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              <div className="border-t border-slate-100 px-5 py-3 text-center text-[9px] text-slate-400">
                Bangun katalog solution Anda dari sini.
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <footer className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[9px] text-slate-400">
            <span>RnD Web Portal</span>

            <span>
              Contacts, products, vendors &amp; solutions — connected.
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}