import { useContext, useMemo, useState, useEffect } from "react";
import { OrderContext } from "../../context/OrderContext";
import { TableContext } from "../../context/TableAndQrContext";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import OrdersList from "../../components/admin/OrdersList";
import PrettyCircleLoader from "../../components/PrettyCircleLoader";
import MainFoodLoader from "../../components/MainFoodLoader";
import { MenuContext } from "../../context/MenuContext";
import { IoStar } from "react-icons/io5";

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

// helper: compare local date (year, month, day)
function isSameLocalDay(aDate, bDate) {
  const a = new Date(aDate);
  const b = new Date(bDate);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const {
    orders = [],
    getOrders,
    updateStatus,
    isLoadingOrder,
  } = useContext(OrderContext);
  const { tables = [] } = useContext(TableContext);
  const { menuItems } = useContext(MenuContext);

  // ensure initial fetch if context exposes getters (non-invasive)
  useEffect(() => {
    if (typeof getOrders === "function") getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // normalize status helper (backend stores uppercase like PREPARING)
  const statusLower = (s) => (s ? String(s).toLowerCase() : "");

  // derived stats
  const stats = useMemo(() => {
    const today = new Date();
    let newCount = 0;
    let preparing = 0;
    let completed = 0;
    let totalRevenue = 0;
    let todayRevenue = 0;

    orders.forEach((o) => {
      const s = statusLower(o.status);
      if (s === "pending" || s === "accepted") newCount++;
      if (s === "preparing") preparing++;
      if (s === "completed") completed++;

      const g = o.pricing?.grandTotal ?? o.total ?? 0;
      const num = Number(g) || 0;
      totalRevenue += num;

      if (o.createdAt && isSameLocalDay(o.createdAt, today)) {
        todayRevenue += num;
      }
    });

    const avgOrder = orders.length
      ? Math.round(totalRevenue / orders.length)
      : 0;
    return {
      newCount,
      preparing,
      completed,
      revenueToday: Math.round(todayRevenue),
      revenueTotal: Math.round(totalRevenue),
      avgOrder,
    };
  }, [orders]);

  // filter + search
  const filteredSorted = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = orders.filter((order) => {
      // derive display fields with safe fallbacks
      const orderId = order.orderId || order.id || order._id || "";
      const tableName =
        (order.table && (order.table.name || order.tableName)) ||
        order.tableName ||
        order.table ||
        "";
      const itemsArr = Array.isArray(order.items) ? order.items : [];
      const matchesSearch =
        !term ||
        orderId.toLowerCase().includes(term) ||
        (tableName || "").toLowerCase().includes(term) ||
        itemsArr.some((it) => (it.name || "").toLowerCase().includes(term));
      const orderStatus = statusLower(order.status);
      const matchesStatus = !filterStatus || orderStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });

    // sort: pending/accepted -> preparing -> completed
    const statusOrder = { pending: 1, accepted: 1, preparing: 2, completed: 3 };
    filtered.sort(
      (a, b) =>
        (statusOrder[statusLower(a.status)] || 99) -
        (statusOrder[statusLower(b.status)] || 99)
    );
    return filtered;
  }, [orders, search, filterStatus]);

  const handleUpdateStatus = async (id, toStatusUpper) => {
    // send backend-valid uppercase status
    if (!updateStatus) return;
    const res = await updateStatus(id, toStatusUpper);
    // function returns result object in your context — we keep console for debugging
    console.log("updateStatus result:", res);
  };

  const dummyRevenueSeries = [
    { day: "Mon", value: 4200 },
    { day: "Tue", value: 5200 },
    { day: "Wed", value: 3800 },
    { day: "Thu", value: 7600 },
    { day: "Fri", value: 9200 },
    { day: "Sat", value: 11000 },
    { day: "Sun", value: 9800 },
  ];
  return (
    <div className="p-2 md:p-6 py-lg-4 px-lg-3">
      <div className="max-w-[1280px] mx-auto space-y-6">
        {/* header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-2xl md:text-3xl font-semibold text-emerald-900">
              Dashboard
            </div>
            <span className="text-sm text-gray-500 mt-1">
              Real-time view of your restaurant — orders, revenue & top items.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-4 text-sm hover:bg-emerald-700"
              onClick={() => navigate("/admin/offers")}
            >
              New Discount
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl px-4 py-3 shadow border-2 border-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">New Orders</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {isLoadingOrder ? (
                    <div className="flex py-2">
                      <PrettyCircleLoader size={20} />
                    </div>
                  ) : (
                    stats.newCount
                  )}
                </div>
              </div>
              <div className="text-green-500">
                <Sparkline points={[2, 4, 5, 8, 6, 7, 9]} />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-3">
              Orders that need attention
            </div>
          </div>

          <div className="bg-white rounded-2xl px-4 py-3 shadow border-2 border-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Preparing</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {isLoadingOrder ? (
                    <div className="flex py-2">
                      <PrettyCircleLoader size={20} />
                    </div>
                  ) : (
                    stats.preparing
                  )}
                </div>
              </div>
              <div className="text-yellow-500">
                <Sparkline points={[3, 5, 6, 4, 6, 5, 6]} />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-3">
              Kitchen in progress
            </div>
          </div>

          <div className="bg-white rounded-2xl px-4 py-3 shadow border-2 border-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-2xl font-semibold text-gray-900">
                  {isLoadingOrder ? (
                    <div className="flex py-2">
                      <PrettyCircleLoader size={20} />
                    </div>
                  ) : (
                    stats.completed
                  )}
                </div>
              </div>
              <div className="text-emerald-500">
                <Sparkline points={[10, 9, 11, 12, 13, 12, 14]} />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-3">Completed orders</div>
          </div>

          <div className="bg-white rounded-2xl px-4 py-3 shadow border-2 border-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Today Revenue</div>
                <div className="text-2xl font-semibold text-emerald-600">
                  {isLoadingOrder ? (
                    <div className="flex py-2">
                      <PrettyCircleLoader size={20} />
                    </div>
                  ) : (
                    <span>₹{stats.revenueToday} </span>
                  )}
                </div>
              </div>
              <div className="text-emerald-600">
                <Sparkline
                  points={[4000, 5000, 4500, 7000, 9000, 11000, 9800]}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-3">
              Avg order ₹{stats.avgOrder}
            </div>
          </div>
        </div>
        {/* Main grid: left large, right column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Orders + chart */}
          <div className="lg:col-span-2 space-y-4 ">
            <div className="bg-white rounded-2xl py-3 px-3 md:p-4 shadow-sm border-2 border-emerald-600">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm w-42 md:w-64"
                    placeholder="Search orders, table or item..."
                  />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-2 py-2 rounded-lg border border-gray-200 text-sm"
                  >
                    <option value="">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="text-sm text-gray-500">
                  Showing {filteredSorted.length} orders
                </div>
              </div>

              <div className="mt-4">
                {/* Revenue area chart */}
                <div className="mb-4 hidden md:block ">
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
                      Today ₹{stats.revenueToday}
                    </div>
                  </div>
                  <AreaChart series={dummyRevenueSeries} />
                </div>

                {/* Orders list */}
                {isLoadingOrder ? (
                  <MainFoodLoader />
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-[465px]">
                    <OrdersList
                      orders={filteredSorted}
                      variant="dashboard"
                      onUpdateStatus={handleUpdateStatus}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column: top items, tables, quick actions */}
          <div className="space-y-4">
            {/* Tables */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border-2 border-emerald-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-0 text-gray-500">Active Tables</p>
                  <p className="text-lg mb-0 font-semibold text-gray-900">
                    Table Overview
                  </p>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-1 ">
                  <GoDotFill className="bg-emerald-600 rounded-5" />
                  Live
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {/* Render actual table pills (keep simple) */}
                {tables && tables.length > 0 ? (
                  tables.map((t) => (
                    <div
                      key={t._id}
                      className={`px-2 py-2 rounded text-sm font-medium text-center ${
                        t.isOcuppied
                          ? "bg-gray-100 text-gray-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {t.name || t.code || "T"}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="px-2 py-2 bg-emerald-50 rounded text-sm font-medium text-emerald-700 text-center">
                      T1
                    </div>
                    <div className="px-2 py-2 bg-yellow-50 rounded text-sm font-medium text-yellow-700 text-center">
                      T2
                    </div>
                    <div className="px-2 py-2 bg-emerald-50 rounded text-sm font-medium text-emerald-700 text-center">
                      T3
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border-2 border-emerald-600">
              <p className="text-sm mb-0 text-gray-500">Quick Actions</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  className="px-3 py-2 bg-emerald-50 border-2 border-emerald-600 text-black rounded-4 text-sm"
                  onClick={() => navigate("/admin/qr-codes")}
                >
                  Create QR
                </button>
                <button
                  className="px-3 py-2 bg-emerald-50 border-2 border-emerald-600 text-black rounded-4 text-sm"
                  onClick={() => navigate("/admin/menu-items")}
                >
                  Add Item
                </button>
                <button
                  className="px-3 py-2 bg-emerald-50 border-2 border-emerald-600 text-black rounded-4 text-sm"
                  onClick={() => navigate("/admin/offers")}
                >
                  Set Offer
                </button>
                <button
                  className="px-3 py-2 bg-emerald-50 border-2 border-emerald-600 text-black rounded-4 text-sm"
                  onClick={() => navigate("/admin/settings")}
                >
                  Settings
                </button>
              </div>
            </div>

            {/* Top Selling Items */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border-2 border-emerald-600">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-amber-600 text-white text-xs p-1 rounded-full flex items-center gap-1 shadow">
                  <IoStar size={15} />
                </div>
                <div className="text-lg font-bold text-gray-400">
                  Best Sellers
                </div>
              </div>

              <ul className="p-0 divide-y divide-gray-100">
                {menuItems
                  .filter((item) => item.isBestSeller) // 👉 Keep only bestseller items
                  .map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-base font-medium text-gray-700">
                        {item.name}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer small summary (total revenue) */}
      </div>
    </div>
  );
}
