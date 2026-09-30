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
  BarChart3,
  Layers3,
  RefreshCw,
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

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

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

type ChartCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onViewAll?: () => void;
  delay?: number;
};

const CHART_COLORS = {
  navy: "#010736",
  yellow: "#facc15",
};

function ChartCard({
  title,
  description,
  icon,
  children,
  onViewAll,
  delay = 0,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 14,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -2,
        transition: {
          duration: 0.18,
          ease: "easeOut",
        },
      }}
      transition={{
        duration: 0.35,
        delay,
        ease: "easeOut",
      }}
      className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm dark:border-white/10 dark:from-[#111526] dark:via-[#111526] dark:to-[#0D1020]"
    >
      <div className="flex items-center justify-between border-b border-slate-200/70 px-6 py-5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{
              scale: 1.05,
              rotate: 2,
            }}
            transition={{
              duration: 0.15,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#010736]/10 text-[#010736] dark:bg-white/10 dark:text-white"
          >
            {icon}
          </motion.div>

          <div>
            <h2 className="font-bold text-black dark:text-white">
              {title}
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>

        {onViewAll && (
          <motion.button
            type="button"
            onClick={onViewAll}
            whileHover={{
              x: 2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            transition={{
              duration: 0.15,
            }}
            className="text-sm font-medium text-[#010736] transition-colors hover:text-yellow-500 dark:text-white"
          >
            Lihat Semua →
          </motion.button>
        )}
      </div>

      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function EmptyChart({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.3,
      }}
      className="flex h-[300px] flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 5,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
          delay: 0.05,
        }}
        className="text-gray-300 dark:text-gray-600"
      >
        {icon}
      </motion.div>

      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {text}
      </p>
    </motion.div>
  );
}

function LoadingChart() {
  return (
    <div className="flex h-[300px] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <RefreshCw
          size={16}
          className="animate-spin"
        />
        Loading data...
      </div>
    </div>
  );
}

function SideTooltip({
  ...props
}: React.ComponentProps<typeof ChartTooltipContent>) {
  return <ChartTooltipContent {...props} />;
}

function ContactChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const chartConfig = {
    value: {
      label: "Contact",
      color: CHART_COLORS.navy,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[300px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data.slice(0, 12)}
        margin={{
          top: 25,
          right: 55,
          left: 0,
          bottom: 5,
        }}
        barCategoryGap="25%"
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            String(value).length > 10
              ? `${String(value).slice(0, 10)}…`
              : String(value)
          }
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          width={35}
          allowDecimals={false}
        />

        <ChartTooltip
          cursor={false}
          offset={12}
          allowEscapeViewBox={{
            x: true,
            y: true,
          }}
          wrapperStyle={{
            zIndex: 50,
            transform: "translateX(65px)",
          }}
          content={
            <SideTooltip indicator="dot" />
          }
        />

        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[5, 5, 0, 0]}
          maxBarSize={42}
          animationBegin={100}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </BarChart>
    </ChartContainer>
  );
}

function ProductChart({
  active,
  inactive,
}: {
  active: number;
  inactive: number;
}) {
  const chartConfig = {
    active: {
      label: "Active",
      color: CHART_COLORS.navy,
    },
    inactive: {
      label: "Inactive",
      color: CHART_COLORS.yellow,
    },
  } satisfies ChartConfig;

  const data = [
    {
      label: "Products",
      active,
      inactive,
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[300px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 25,
          right: 55,
          left: 0,
          bottom: 5,
        }}
        barCategoryGap="35%"
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          width={35}
          allowDecimals={false}
        />

        <ChartTooltip
          cursor={false}
          offset={12}
          allowEscapeViewBox={{
            x: true,
            y: true,
          }}
          wrapperStyle={{
            zIndex: 50,
            transform: "translateX(65px)",
          }}
          content={<SideTooltip />}
        />

        <ChartLegend
          content={<ChartLegendContent />}
        />

        <Bar
          dataKey="active"
          stackId="products"
          fill="var(--color-active)"
          radius={[0, 0, 4, 4]}
          maxBarSize={90}
          animationBegin={100}
          animationDuration={800}
          animationEasing="ease-out"
        />

        <Bar
          dataKey="inactive"
          stackId="products"
          fill="var(--color-inactive)"
          radius={[4, 4, 0, 0]}
          maxBarSize={90}
          animationBegin={180}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </BarChart>
    </ChartContainer>
  );
}

function CompanyChart({
  data,
}: {
  data: {
    label: string;
    products: number;
    principals: number;
    productsVisual: number;
    principalsVisual: number;
  }[];
}) {
  const chartConfig = {
    productsVisual: {
      label: "Product",
      color: CHART_COLORS.navy,
    },
    principalsVisual: {
      label: "Principal",
      color: CHART_COLORS.yellow,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[300px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data.slice(0, 10)}
        margin={{
          top: 25,
          right: 55,
          left: 0,
          bottom: 5,
        }}
        barCategoryGap="25%"
        barGap={5}
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            String(value).length > 9
              ? `${String(value).slice(0, 9)}…`
              : String(value)
          }
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          width={35}
          allowDecimals={false}
        />

        <ChartTooltip
          cursor={false}
          offset={12}
          allowEscapeViewBox={{
            x: true,
            y: true,
          }}
          wrapperStyle={{
            zIndex: 50,
            transform: "translateX(65px)",
          }}
          content={
            <SideTooltip
              formatter={(value, name, item) => {
                const payload = item.payload as {
                  products?: number;
                  principals?: number;
                };

                const actualValue =
                  name === "productsVisual"
                    ? payload.products ?? 0
                    : payload.principals ?? 0;

                const label =
                  name === "productsVisual"
                    ? "Product"
                    : "Principal";

                return (
                  <div className="flex flex-1 justify-between gap-4 leading-none">
                    <span className="text-muted-foreground">
                      {label}
                    </span>

                    <span className="font-mono font-medium text-foreground tabular-nums">
                      {actualValue.toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                );
              }}
            />
          }
        />

        <ChartLegend
          content={<ChartLegendContent />}
        />

        <Bar
          dataKey="productsVisual"
          fill="var(--color-productsVisual)"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
          animationBegin={100}
          animationDuration={800}
          animationEasing="ease-out"
        />

        <Bar
          dataKey="principalsVisual"
          fill="var(--color-principalsVisual)"
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
          animationBegin={180}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </BarChart>
    </ChartContainer>
  );
}

function ProductSolutionChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const chartConfig = {
    value: {
      label: "Product Solution",
      color: CHART_COLORS.navy,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[300px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={data.slice(0, 12)}
        margin={{
          top: 25,
          right: 55,
          left: 0,
          bottom: 5,
        }}
        barCategoryGap="25%"
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            String(value).length > 10
              ? `${String(value).slice(0, 10)}…`
              : String(value)
          }
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          width={35}
          allowDecimals={false}
        />

        <ChartTooltip
          cursor={false}
          offset={12}
          allowEscapeViewBox={{
            x: true,
            y: true,
          }}
          wrapperStyle={{
            zIndex: 50,
            transform: "translateX(65px)",
          }}
          content={
            <SideTooltip indicator="dot" />
          }
        />

        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[5, 5, 0, 0]}
          maxBarSize={42}
          animationBegin={100}
          animationDuration={800}
          animationEasing="ease-out"
        />
      </BarChart>
    </ChartContainer>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [contacts, setContacts] =
    useState<Contact[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [companies, setCompanies] =
    useState<Company[]>([]);

  const [productSolutions, setProductSolutions] =
    useState<ProductSolution[]>([]);

  const [loadingContacts, setLoadingContacts] =
    useState(true);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [loadingCompanies, setLoadingCompanies] =
    useState(true);

  const [
    loadingProductSolutions,
    setLoadingProductSolutions,
  ] = useState(true);

  const { theme, toggleTheme } =
    useTheme();

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
        const response = await fetch(
          `${API_BASE_URL}/users/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem(
            "authToken"
          );

          localStorage.removeItem("user");

          sessionStorage.removeItem(
            "authToken"
          );

          sessionStorage.removeItem("user");

          router.replace("/");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          "Get user error:",
          error
        );
      }
    }

    async function fetchContacts() {
      try {
        setLoadingContacts(true);

        const response = await fetch(
          `${API_BASE_URL}/contacts`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          return;
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setContacts(data);
      } catch (error) {
        console.error(
          "Get contacts error:",
          error
        );
      } finally {
        setLoadingContacts(false);
      }
    }

    async function fetchProducts() {
      try {
        setLoadingProducts(true);

        const response = await fetch(
          `${API_BASE_URL}/products`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          return;
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setProducts(data);
      } catch (error) {
        console.error(
          "Get products error:",
          error
        );
      } finally {
        setLoadingProducts(false);
      }
    }

    async function fetchCompanies() {
      try {
        setLoadingCompanies(true);

        const response = await fetch(
          `${API_BASE_URL}/companies`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          return;
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setCompanies(data);
      } catch (error) {
        console.error(
          "Get companies error:",
          error
        );
      } finally {
        setLoadingCompanies(false);
      }
    }

    async function fetchProductSolutions() {
      try {
        setLoadingProductSolutions(true);

        const response = await fetch(
          `${API_BASE_URL}/product-solutions`
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          return;
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        setProductSolutions(data);
      } catch (error) {
        console.error(
          "Get product solutions error:",
          error
        );
      } finally {
        setLoadingProductSolutions(false);
      }
    }

    fetchUser();
    fetchContacts();
    fetchProducts();
    fetchCompanies();
    fetchProductSolutions();
  }, [router]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getDivisionName = (
    division: string
  ) => {
    if (division === "RND")
      return "RnD Division";

    if (division === "SALES")
      return "Sales Division";

    if (division === "ADMIN")
      return "Admin Division";

    return division;
  };

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
      const companyName =
        contact.company?.name ||
        (contact.companyId
          ? "Perusahaan"
          : "Tanpa Perusahaan");

      map.set(
        companyName,
        (map.get(companyName) || 0) + 1
      );
    });

    return Array.from(map.entries())
      .map(([label, value]) => ({
        label,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [contacts]);

  const productChartData = useMemo(() => {
    const active = products.filter(
      (product) =>
        String(product.status).toUpperCase() ===
        "ACTIVE"
    ).length;

    const inactive = products.filter(
      (product) =>
        String(product.status).toUpperCase() ===
        "INACTIVE"
    ).length;

    return {
      active,
      inactive,
    };
  }, [products]);

  const getScaleDivisor = (
    value: number
  ) => {
    if (value <= 100) return 1;

    const exponent = Math.max(
      1,
      Math.ceil(
        Math.log10(value / 100)
      )
    );

    return Math.pow(10, exponent);
  };

  const companyChartData = useMemo(() => {
    const baseData = [...companies]
      .map((company) => ({
        label: company.name,
        products: Number(
          company.productCount || 0
        ),
        principals: Number(
          company.principalCount || 0
        ),
      }))
      .sort(
        (a, b) =>
          b.products - a.products
      );

    const maxProducts = Math.max(
      ...baseData.map(
        (item) => item.products
      ),
      0
    );

    const maxPrincipals = Math.max(
      ...baseData.map(
        (item) => item.principals
      ),
      0
    );

    const productDivisor =
      getScaleDivisor(maxProducts);

    const principalDivisor =
      getScaleDivisor(maxPrincipals);

    return baseData.map((item) => ({
      ...item,
      productsVisual:
        item.products / productDivisor,
      principalsVisual:
        item.principals / principalDivisor,
    }));
  }, [companies]);

  const productSolutionChartData =
    useMemo(() => {
      const map = new Map<string, number>();

      productSolutions.forEach(
        (solution) => {
          const category =
            solution.category?.trim() ||
            "Tanpa Category";

          map.set(
            category,
            (map.get(category) || 0) + 1
          );
        }
      );

      return Array.from(map.entries())
        .map(([label, value]) => ({
          label,
          value,
        }))
        .sort(
          (a, b) => b.value - a.value
        );
    }, [productSolutions]);

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-[#080B1A] dark:via-[#0D1020] dark:to-[#080B1A]">
      <aside className="flex w-68 shrink-0 flex-col bg-[#010736] px-5 py-6 text-white">
        <motion.div
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
            <img
              src="/OIP.webp"
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="text-xl font-bold">
            Dashboard RnD
          </h2>
        </motion.div>

        <p className="mb-3 px-1 text-sm font-semibold text-white/60">
          Menu
        </p>

        <Link
          href="/dashboard"
          className="relative flex items-center gap-3 px-4 py-3 text-sm font-medium text-white transition"
        >
          <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 bg-yellow-400" />

          <LayoutDashboard size={19} />

          <span>Dashboard</span>
        </Link>

        <Link
          href="/contact-list"
          className="relative mt-1 flex items-center gap-3 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <Users size={19} />

          <span>Contact List</span>
        </Link>

        <Link
          href="/products"
          className="relative mt-1 flex items-center gap-3 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <Package size={18} />

          <span>Product Item</span>
        </Link>

        <Link
          href="/principal"
          className="relative mt-1 flex items-center gap-3 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <Building2 size={18} />

          <span>Vendor/Principal</span>
        </Link>

        <Link
          href="/product-solution"
          className="relative mt-1 flex items-center gap-3 px-4 py-3 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <Package size={18} />

          <span>Product Solution</span>
        </Link>

        <div className="mt-6 border-t border-white/10 pt-5" />

        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full rounded-xl outline-none">
              <motion.div
                whileHover={{
                  backgroundColor:
                    "rgba(255,255,255,0.08)",
                }}
                transition={{
                  duration: 0.15,
                }}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-white text-[#010736]">
                    {user
                      ? getInitials(
                          user.name
                        )
                      : "AA"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {user?.name ||
                      "Loading..."}
                  </p>

                  <p className="text-xs text-white/60">
                    {user
                      ? getDivisionName(
                          user.division
                        )
                      : "Loading..."}
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className="text-white/70"
                />
              </motion.div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="top"
              className="mb-2 w-52"
            >
              {user?.role === "ADMIN" && (
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      "/user-management"
                    )
                  }
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    "/edit-profile"
                  )
                }
              >
                <UserRound className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  router.push("/settings")
                }
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
      </aside>

      <section className="flex-1">
        <header className="flex h-20 items-center justify-between border-b border-slate-200/70 bg-gradient-to-r from-white via-white to-slate-50 px-8 dark:border-white/10 dark:from-[#0D1020] dark:via-[#0D1020] dark:to-[#111526]">
          <motion.div
            initial={{
              opacity: 0,
              y: -6,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Dashboard
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome to RnD Web Portal
            </p>
          </motion.div>

          <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.96,
            }}
            transition={{
              duration: 0.15,
            }}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200/70 bg-white px-4 text-sm font-medium text-[#010736] shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            <motion.span
              key={theme}
              initial={{
                opacity: 0,
                rotate: -30,
                scale: 0.8,
              }}
              animate={{
                opacity: 1,
                rotate: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              {theme === "light" ? (
                <Sun size={17} />
              ) : (
                <Moon size={17} />
              )}
            </motion.span>

            <span>
              {theme === "light"
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          </motion.button>
        </header>

        <motion.div
          className="p-8"
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            ease: "easeOut",
          }}
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Contact List"
              description="Jumlah contact berdasarkan perusahaan"
              icon={<Users size={19} />}
              delay={0.05}
              onViewAll={() =>
                router.push(
                  "/contact-list"
                )
              }
            >
              {loadingContacts ? (
                <LoadingChart />
              ) : contactChartData.length ===
                0 ? (
                <EmptyChart
                  icon={<Users size={32} />}
                  text="Belum ada contact"
                />
              ) : (
                <ContactChart
                  data={contactChartData}
                />
              )}
            </ChartCard>

            <ChartCard
              title="Products Item"
              description="Perbandingan status product"
              icon={<Package size={19} />}
              delay={0.1}
              onViewAll={() =>
                router.push("/products")
              }
            >
              {loadingProducts ? (
                <LoadingChart />
              ) : products.length === 0 ? (
                <EmptyChart
                  icon={<Package size={32} />}
                  text="Belum ada product"
                />
              ) : (
                <ProductChart
                  active={
                    productChartData.active
                  }
                  inactive={
                    productChartData.inactive
                  }
                />
              )}
            </ChartCard>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Vendor / Principal"
              description="Jumlah product dan Principal yang digunakan"
              icon={<Building2 size={19} />}
              delay={0.15}
              onViewAll={() =>
                router.push("/principal")
              }
            >
              {loadingCompanies ? (
                <LoadingChart />
              ) : companies.length === 0 ? (
                <EmptyChart
                  icon={
                    <Building2 size={32} />
                  }
                  text="Belum ada perusahaan"
                />
              ) : (
                <CompanyChart
                  data={companyChartData}
                />
              )}
            </ChartCard>

            <ChartCard
              title="Product Solution"
              description="Jumlah Product Solution berdasarkan category"
              icon={<Layers3 size={19} />}
              delay={0.2}
              onViewAll={() =>
                router.push(
                  "/product-solution"
                )
              }
            >
              {loadingProductSolutions ? (
                <LoadingChart />
              ) : productSolutionChartData.length ===
                0 ? (
                <EmptyChart
                  icon={
                    <Layers3 size={32} />
                  }
                  text="Belum ada Product Solution"
                />
              ) : (
                <ProductSolutionChart
                  data={
                    productSolutionChartData
                  }
                />
              )}
            </ChartCard>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: 0.25,
              }}
              whileHover={{
                y: -3,
                transition: {
                  duration: 0.15,
                },
              }}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111526]"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#010736]/10 text-[#010736] dark:bg-white/10 dark:text-white"
                >
                  <Users size={18} />
                </motion.div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Contact
                  </p>

                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {contacts.length.toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: 0.3,
              }}
              whileHover={{
                y: -3,
                transition: {
                  duration: 0.15,
                },
              }}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111526]"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#010736]/10 text-[#010736] dark:bg-white/10 dark:text-white"
                >
                  <Package size={18} />
                </motion.div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Product
                  </p>

                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {products.length.toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: 0.35,
              }}
              whileHover={{
                y: -3,
                transition: {
                  duration: 0.15,
                },
              }}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111526]"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#010736]/10 text-[#010736] dark:bg-white/10 dark:text-white"
                >
                  <Building2 size={18} />
                </motion.div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Company
                  </p>

                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {companies.length.toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: 0.4,
              }}
              whileHover={{
                y: -3,
                transition: {
                  duration: 0.15,
                },
              }}
              className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111526]"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#010736]/10 text-[#010736] dark:bg-white/10 dark:text-white"
                >
                  <BarChart3 size={18} />
                </motion.div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Product Solution
                  </p>

                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {productSolutions.length.toLocaleString(
                      "id-ID"
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}