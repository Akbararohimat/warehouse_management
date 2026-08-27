"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  LayoutDashboard,
  Users,
  Ticket,
  ChartNoAxesCombined,
  Settings,
  UserRound,
  LogOut,
  Search,
  Plus,
  ChevronDown,
  Clock3,
  CheckCircle2,
  CircleAlert,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts"

const chartData = [
  { month: "Jan", ticket: 4 },
  { month: "Feb", ticket: 7 },
  { month: "Mar", ticket: 5 },
  { month: "Apr", ticket: 9 },
  { month: "May", ticket: 12 },
  { month: "Jun", ticket: 10 },
]

const chartConfig = {
  ticket: {
    label: "Ticket",
  },
}

export default function SalesDashboard() {
  const router = useRouter()

  const [search, setSearch] = useState("")

  return (
    <main className="flex min-h-screen bg-gray-100">
      <aside className="flex w-68 shrink-0 flex-col bg-[#111111] px-5 py-6 text-white">

        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5C400] text-sm font-bold text-black">
            S
          </div>

          <h2 className="text-xl font-bold">
            Divisi Sales
          </h2>

        </div>

        <p className="mb-3 px-4 text-sm font-semibold uppercase text-gray-400">
          Menu
        </p>

        <Link
          href="/sales"
          className="flex items-center gap-3 rounded-full bg-[#F5C400] px-4 py-2.5 text-sm font-semibold text-black"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>
  
        <Link
          href="/sales/tickets"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <Ticket size={18} />
          Ticket
        </Link>

        <Link
          href="/sales/monitoring"
          className="mt-1 flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10"
        >
          <ChartNoAxesCombined size={18} />
          Monitoring Ticket
        </Link>

        {/* PROFILE */}
        <div className="mt-auto">

          <DropdownMenu>

            <DropdownMenuTrigger className="w-full rounded-xl outline-none">

              <div className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/10">

                <Avatar className="h-10 w-10 shrink-0">

                  <AvatarFallback className="bg-[#F5C400] text-black">
                    AR
                  </AvatarFallback>

                </Avatar>

                <div className="flex-1">

                  <p className="text-sm font-semibold">
                    Akbar arohimat
                  </p>

                  <p className="text-xs text-gray-400">
                    Sales Division
                  </p>

                </div>

                <ChevronDown size={17} />

              </div>

            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="top"
              className="mb-2 w-52"
            >

              <DropdownMenuItem
                onClick={() => router.push("/sales/edit-profile")}
              >
                <UserRound className="mr-2 h-4 w-4" />
                Edit Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/sales/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  localStorage.removeItem("isLoggedIn")
                  router.replace("/")
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        </div>

      </aside>
      <section className="flex-1">
        <header className="flex h-20 items-center justify-between bg-white px-8">

          <div>

            <h1 className="text-3xl font-bold text-black">
              Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Welcome to Sales Web Portal
            </p>

          </div>
          <div className="flex h-10 w-64 items-center gap-2 rounded-full bg-gray-100 px-4 shadow-inner">

            <Search
              size={17}
              className="text-gray-600"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find Something..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-500"
            />

          </div>

        </header>
        <div className="p-8">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-black">
                Overview
              </h2>

              <p className="text-sm text-gray-500">
                Pantau aktivitas Sales dan ticket RnD
              </p>

            </div>

            <button
              onClick={() => router.push("/sales/tickets")}
              className="flex h-11 items-center gap-2 rounded-2xl bg-[#F5C400] px-5 text-sm font-semibold text-black shadow-md transition hover:bg-[#E5B800]"
            >
              <Plus size={18} />
              New Ticket
            </button>

          </div>
          <div className="grid grid-cols-4 gap-4">

            <div className="rounded-2xl bg-white p-5 shadow-md">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-black">
                <Ticket size={18} />
              </div>

              <p className="text-2xl font-bold text-black">
                12
              </p>

              <p className="text-sm text-gray-600">
                Total Ticket
              </p>

            </div>

            {/* PENDING */}
            <div className="rounded-2xl bg-white p-5 shadow-md">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                <Clock3 size={18} />
              </div>

              <p className="text-2xl font-bold text-black">
                5
              </p>

              <p className="text-sm text-gray-600">
                Ticket Pending
              </p>

            </div>

            {/* DONE */}
            <div className="rounded-2xl bg-white p-5 shadow-md">

              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <CheckCircle2 size={18} />
              </div>

              <p className="text-2xl font-bold text-black">
                7
              </p>

              <p className="text-sm text-gray-600">
                Ticket Selesai
              </p>

            </div>

          </div>

          {/* CHART + STATUS */}
          <div className="mt-6 grid grid-cols-[1.7fr_1fr] gap-6">

            {/* CHART */}
            <div className="rounded-2xl bg-white p-5 shadow-md">

              <div className="mb-4">

                <h2 className="font-bold text-black">
                  Ticket Activity
                </h2>

                <p className="text-xs text-gray-500">
                  Aktivitas ticket selama beberapa bulan terakhir
                </p>

              </div>

              <ChartContainer
                config={chartConfig}
                className="h-[250px] w-full"
              >

                <AreaChart
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                    top: 10,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />

                  <Area
                    dataKey="ticket"
                    type="monotone"
                    fill="var(--color-ticket)"
                    fillOpacity={0.15}
                    stroke="var(--color-ticket)"
                    strokeWidth={2}
                  />

                </AreaChart>

              </ChartContainer>

            </div>

            {/* STATUS */}
            <div className="rounded-2xl bg-white p-5 shadow-md">

              <h2 className="font-bold text-black">
                Ticket Status
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Status ticket saat ini
              </p>

              <div className="mt-6 space-y-5">

                {/* PENDING */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="h-3 w-3 rounded-full bg-[#F5C400]" />

                    <span className="text-sm text-gray-700">
                      Pending
                    </span>

                  </div>

                  <span className="text-sm font-bold text-black">
                    5
                  </span>

                </div>

                {/* PROCESS */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="h-3 w-3 rounded-full bg-black" />

                    <span className="text-sm text-gray-700">
                      Diproses
                    </span>

                  </div>

                  <span className="text-sm font-bold text-black">
                    4
                  </span>

                </div>

                {/* DONE */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="h-3 w-3 rounded-full bg-green-500" />

                    <span className="text-sm text-gray-700">
                      Selesai
                    </span>

                  </div>

                  <span className="text-sm font-bold text-black">
                    3
                  </span>

                </div>

              </div>

              {/* TOTAL */}
              <div className="mt-8 rounded-xl bg-gray-100 p-4">

                <p className="text-xs text-gray-500">
                  Total Ticket
                </p>

                <p className="mt-1 text-2xl font-bold text-black">
                  12
                </p>

              </div>

            </div>

          </div>

          {/* RECENT TICKET */}
          <div className="mt-6 rounded-2xl bg-white p-5 shadow-md">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="font-bold text-black">
                  Recent Ticket
                </h2>

                <p className="text-xs text-gray-500">
                  Ticket terbaru yang dibuat oleh Sales
                </p>

              </div>

              <Link
                href="/sales/monitoring"
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                Lihat Semua →
              </Link>

            </div>

            {/* TABLE HEADER */}
            <div className="grid grid-cols-[0.8fr_1.4fr_1.2fr_1fr_0.8fr] border-b border-gray-300 pb-3 text-xs font-bold text-gray-700">

              <div>
                Ticket
              </div>

              <div>
                Customer
              </div>

              <div>
                Request
              </div>

              <div>
                Tanggal
              </div>

              <div>
                Status
              </div>

            </div>

            {/* ROW 1 */}
            <div className="grid grid-cols-[0.8fr_1.4fr_1.2fr_1fr_0.8fr] items-center border-b border-gray-200 py-4 text-sm">

              <div className="font-semibold text-black">
                #001
              </div>

              <div className="text-gray-700">
                PT.PTan
              </div>

              <div className="text-gray-700">
                Request Router
              </div>

              <div className="text-gray-500">
                19/02/2027
              </div>

              <div>

                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">

                  <CircleAlert size={12} />

                  Pending

                </span>

              </div>

            </div>

            {/* ROW 2 */}
            <div className="grid grid-cols-[0.8fr_1.4fr_1.2fr_1fr_0.8fr] items-center py-4 text-sm">

              <div className="font-semibold text-black">
                #002
              </div>

              <div className="text-gray-700">
                PT.ABC
              </div>

              <div className="text-gray-700">
                Request Switch
              </div>

              <div className="text-gray-500">
                18/02/2027
              </div>

              <div>

                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  Diproses
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  )
}