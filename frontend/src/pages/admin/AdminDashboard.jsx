import React, { useContext, useMemo, useState } from "react";
import { OrderContext } from "../../context/OrderContext";

/**
 * AdminDashboard.jsx
 * - Self-contained dashboard with dummy data
 * - Tailwind CSS required in project
 *
 * Usage:
 *   import AdminDashboard from "./components/AdminDashboard";
 *   <AdminDashboard />
 *
 * Replace dummy data with API/Socket data later.
 */

const dummyOrders = [
  {
    _id: "ORD-1001",
    id: "ORD-1001",
    tableName: "Table 5",
    items: [
      { name: "Paneer Butter Masala", quantity: 2, price: 299 },
      { name: "Butter Naan", quantity: 3, price: 40 },
    ],
    total: 718,
    status: "new",
    time: "10:30 AM",
    customerName: "Rahul",
    paymentStatus: "paid",
    createdAt: "2025-11-09T05:30:00Z",
  },
  {
    _id: "ORD-1002",
    id: "ORD-1002",
    tableName: "Table 8",
    items: [
      { name: "Dal Makhani", quantity: 1, price: 249 },
      { name: "Jeera Rice", quantity: 1, price: 149 },
    ],
    total: 398,
    status: "preparing",
    time: "09:58 AM",
    customerName: "Priya",
    paymentStatus: "paid",
    createdAt: "2025-11-09T04:58:00Z",
  },
  {
    _id: "ORD-1003",
    id: "ORD-1003",
    tableName: "Table 2",
    items: [
      { name: "Kadai Paneer", quantity: 1, price: 279 },
      { name: "Garlic Naan", quantity: 2, price: 50 },
    ],
    total: 379,
    status: "completed",
    time: "09:20 AM",
    customerName: "Amit",
    paymentStatus: "paid",
    createdAt: "2025-11-09T04:20:00Z",
  },
  {
    _id: "ORD-1004",
    id: "ORD-1004",
    tableName: "Table 3",
    items: [{ name: "Veg Burger", quantity: 1, price: 99 }],
    total: 99,
    status: "new",
    time: "11:05 AM",
    customerName: "Sneha",
    paymentStatus: "pending",
    createdAt: "2025-11-09T06:05:00Z",
  },
];

const dummyTopItems = [
  { name: "Paneer Butter Masala", sold: 28, revenue: 8372 },
  { name: "Mango Milkshake", sold: 17, revenue: 1853 },
  { name: "Butter Naan", sold: 50, revenue: 2000 },
  { name: "Veg Burger", sold: 34, revenue: 3366 },
];

const dummyRevenueSeries = [
  { day: "Mon", value: 4200 },
  { day: "Tue", value: 5200 },
  { day: "Wed", value: 3800 },
  { day: "Thu", value: 7600 },
  { day: "Fri", value: 9200 },
  { day: "Sat", value: 11000 },
  { day: "Sun", value: 9800 },
];

function Sparkline({ points = [], className = "" }) {
  if (!points.length) return null;
  const w = 60;
  const h = 20;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className={`inline-block ${className}`}
      preserveAspectRatio="none"
    >
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function AreaChart({ series }) {
  // simple responsive area chart using SVG
  const w = 560;
  const h = 160;
  const max = Math.max(...series.map((s) => s.value));
  const min = Math.min(...series.map((s) => s.value));
  const range = max - min || 1;
  const points = series
    .map((s, i) => {
      const x = (i / (series.length - 1)) * w;
      const y = h - ((s.value - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPath = `M0,${h} L${points} L${w},${h} Z`;
  const linePath = `M${points}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-40"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#g1)" />
      <path
        d={linePath}
        fill="none"
        stroke="#059669"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminDashboard() {
  // const [orders, setOrders] = useState(dummyOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Status badge styles
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-600";
      case "preparing":
        return "bg-yellow-100 text-yellow-600";
      case "completed":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const { orders, updateStatus } = useContext(OrderContext);
  // derived stats
  const stats = useMemo(() => {
    const newCount = orders.filter(
      (o) => o.status === "new" || o.status === "pending"
    ).length;
    const preparing = orders.filter((o) => o.status === "preparing").length;
    const completed = orders.filter((o) => o.status === "completed").length;
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const avgOrder = orders.length ? Math.round(revenue / orders.length) : 0;
    return { newCount, preparing, completed, revenue, avgOrder };
  }, [orders]);

  // filter + search
  const filteredSorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = orders.filter((order) => {
      const matchesSearch =
        !term ||
        order.id.toLowerCase().includes(term) ||
        (order.tableName || "").toLowerCase().includes(term) ||
        order.items.some((it) => it.name.toLowerCase().includes(term));
      const matchesStatus = !filterStatus || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    // sort: new/pending(1) -> preparing(2) -> completed(3)
    const statusOrder = { new: 1, pending: 1, preparing: 2, completed: 3 };
    filtered.sort(
      (a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99)
    );
    return filtered;
  }, [orders, search, filterStatus]);

  const handleUpdateStatus = async (id, status) => {
    const result = await updateStatus(id, status);
    console.log(result);
  };

  // top items sparkline data (dummy)
  const sparklines = {
    "Paneer Butter Masala": [8, 12, 10, 14, 16, 22, 18],
    "Mango Milkshake": [3, 5, 6, 8, 9, 10, 7],
    "Butter Naan": [5, 8, 10, 12, 10, 14, 13],
    "Veg Burger": [4, 6, 8, 9, 10, 12, 11],
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-[1280px] mx-auto space-y-6">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Real-time view of your restaurant — orders, revenue & top items.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:shadow">
              <svg
                className="w-4 h-4 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 4v16M4 12h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
              New Discount
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">New Orders</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.newCount}
                </p>
              </div>
              <div className="text-green-500">
                <Sparkline points={[2, 4, 5, 8, 6, 7, 9]} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Orders that need attention
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Preparing</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.preparing}
                </p>
              </div>
              <div className="text-yellow-500">
                <Sparkline points={[3, 5, 6, 4, 6, 5, 6]} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Kitchen in progress</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.completed}
                </p>
              </div>
              <div className="text-emerald-500">
                <Sparkline points={[10, 9, 11, 12, 13, 12, 14]} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Completed orders</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Today Revenue</p>
                <p className="text-2xl font-semibold text-emerald-600">
                  ₹{stats.revenue}
                </p>
              </div>
              <div className="text-emerald-600">
                <Sparkline
                  points={[4000, 5000, 4500, 7000, 9000, 11000, 9800]}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Avg order ₹{stats.avgOrder}
            </p>
          </div>
        </div>

        {/* Main grid: left large, right column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Orders + chart */}
          <div className="lg:col-span-2 space-y-4 ">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm w-64"
                    placeholder="Search orders, table or item..."
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  >
                    <option value="">All statuses</option>
                    <option value="new">New</option>
                    <option value="preparing">Preparing</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className="text-sm text-gray-500">
                  Showing {filteredSorted.length} orders
                </div>
              </div>

              <div className="mt-4">
                {/* Revenue area chart */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-500">
                        Revenue (last 7 days)
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        Week overview
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Today ₹{stats.revenue}
                    </div>
                  </div>
                  <AreaChart series={dummyRevenueSeries} />
                </div>

                {/* Orders list */}
                <div className="space-y-3 overflow-y-auto max-h-[465px]">
                  {filteredSorted.map((order) => (
                    <div
                      key={order._id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 border border-gray-100 rounded-lg"
                    >
                      {console.log(order)}
                      <div className="flex items-start md:items-center gap-3">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderId}
                          </div>
                          <div className="text-xs text-gray-500">
                            •{order.tableName}
                          </div>
                          <div className="mt-1 text-xs text-gray-600">
                            {order.items
                              .slice(0, 2)
                              .map((i) => `${i.quantity}× ${i.name}`)
                              .join(", ")}
                            {order.items.length > 2 ? "..." : ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{order.total}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs ${
                            order.status === "new" || order.status === "pending"
                              ? "bg-blue-50 text-blue-600"
                              : order.status === "preparing"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "preparing")
                            }
                            disabled={
                              order.status !== "new" &&
                              order.status !== "pending"
                            }
                            className={`px-3 py-1 rounded-lg text-xs ${
                              order.status === "new" ||
                              order.status === "pending"
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(order._id, "completed")
                            }
                            disabled={order.status !== "preparing"}
                            className={`px-3 py-1 rounded-lg text-xs ${
                              order.status === "preparing"
                                ? "bg-green-600 text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredSorted.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      No orders found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column: top items, tables, quick actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Top Selling Items</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Hot items
                  </p>
                </div>
                <div className="text-sm text-gray-500">This week</div>
              </div>

              <div className="mt-3 space-y-3">
                {dummyTopItems.map((it, idx) => (
                  <div
                    key={it.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-700">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {it.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {it.sold} sold
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-sm font-semibold">₹{it.revenue}</div>
                      <div className="text-gray-400">
                        <Sparkline
                          points={sparklines[it.name] || [1, 2, 3, 2, 1]}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Tables</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Table Overview
                  </p>
                </div>
                <div className="text-sm text-gray-500">Live</div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {/* Dummy table pills */}
                <div className="px-2 py-2 bg-emerald-50 rounded text-sm font-medium text-emerald-700 text-center">
                  T1
                </div>
                <div className="px-2 py-2 bg-yellow-50 rounded text-sm font-medium text-yellow-700 text-center">
                  T2
                </div>
                <div className="px-2 py-2 bg-emerald-50 rounded text-sm font-medium text-emerald-700 text-center">
                  T3
                </div>
                <div className="px-2 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 text-center">
                  T4
                </div>
                <div className="px-2 py-2 bg-emerald-50 rounded text-sm font-medium text-emerald-700 text-center">
                  T5
                </div>
                <div className="px-2 py-2 bg-gray-100 rounded text-sm font-medium text-gray-700 text-center">
                  T6
                </div>
              </div>

              <div className="mt-3">
                <button className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                  Manage tables
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Quick Actions</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm">
                  Create QR
                </button>
                <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                  Add Item
                </button>
                <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                  Set Offer
                </button>
                <button className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
