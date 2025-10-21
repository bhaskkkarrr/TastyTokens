import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  FaChartLine,
  FaUsers,
  FaMoneyBillWave,
  FaShoppingBag,
} from "react-icons/fa";

function AdminAnalytics() {
  // Sample data for charts
  const monthlyRevenue = [
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 48000 },
    { month: "Mar", revenue: 55000 },
    { month: "Apr", revenue: 51000 },
    { month: "May", revenue: 49000 },
    { month: "Jun", revenue: 62000 },
  ];

  const ordersByCategory = [
    { name: "Main Course", value: 45 },
    { name: "Starters", value: 25 },
    { name: "Desserts", value: 15 },
    { name: "Beverages", value: 15 },
  ];

  const dailyOrders = [
    { time: "10:00", orders: 5 },
    { time: "12:00", orders: 12 },
    { time: "14:00", orders: 15 },
    { time: "16:00", orders: 8 },
    { time: "18:00", orders: 20 },
    { time: "20:00", orders: 25 },
  ];

  const customerSatisfaction = [
    { rating: "5★", count: 45 },
    { rating: "4★", count: 30 },
    { rating: "3★", count: 15 },
    { rating: "2★", count: 7 },
    { rating: "1★", count: 3 },
  ];

  const COLORS = ["#059669", "#10B981", "#34D399", "#6EE7B7"];

  return (
    <div className="container-fluid p-4 sm:p-6 bg-emerald-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <FaChartLine className="text-emerald-600 w-6 sm:w-8 h-6 sm:h-8" />
          <h2 className="text-xl sm:text-2xl font-semibold mb-0 ms-2 text-gray-800 font-poppins">
            Analytics Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white px-3 py-2 rounded-lg shadow-sm">
          <span className="text-gray-500">Last Updated:</span>
          <span className="text-emerald-600 font-semibold">
            10 Oct, 2025 10:30 AM
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              {/* Label + Icon Row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-2">
                  <p className="m-0 ">Total Revenue</p>
                  <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                    <FaMoneyBillWave className="text-emerald-600 w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Revenue Text */}
              <h4 className="text-xl font-bold text-emerald-600">₹3,07,000</h4>
              <span className="text-xs text-green-500">
                +8.5% from last month
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              {/* Label + Icon Row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-2">
                  <p className="m-0">Total Orders</p>
                  <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                    <FaShoppingBag className="text-emerald-600 w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Revenue Text */}
              <h4 className="text-xl font-bold text-emerald-600">1,240</h4>
              <span className="text-xs text-green-500">
                +12.5% from last month
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              {/* Label + Icon Row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-2">
                  <p className="m-0">Total Customers</p>
                  <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                    <FaUsers className="text-emerald-600 w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Revenue Text */}
              <h4 className="text-xl font-bold text-emerald-600">850</h4>
              <span className="text-xs text-green-500">
                +5.2% from last month
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              {/* Label + Icon Row */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                <div className="flex items-center gap-2">
                  <p className="m-0">Avg. Order Value</p>
                  <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                    <FaChartLine className="text-emerald-600 w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Revenue Text */}
              <h4 className="text-xl font-bold text-emerald-600">₹247.58</h4>
              <span className="text-xs text-green-500">
                +3.2% from last month
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Monthly Revenue Trend
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#059669"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Orders */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Daily Order Pattern
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#059669"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Orders by Category
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordersByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ordersByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Satisfaction */}
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Customer Satisfaction
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerSatisfaction}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#059669">
                  {customerSatisfaction.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
