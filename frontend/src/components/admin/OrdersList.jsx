import { FaTrash } from "react-icons/fa";

export default function OrdersList({
  orders = [],
  variant = "detailed", // 'detailed' or 'dashboard'
  onUpdateStatus,
  onDelete,
}) {
  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-blue-50 text-blue-600";
      case "PREPARING":
        return "bg-yellow-50 text-yellow-600";
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  if (orders.length === 0)
    return (
      <div className="text-center text-gray-500 py-10">No orders found</div>
    );

  return (
    <div
      className={`space-y-${variant === "dashboard" ? "3" : "4"} ${
        variant === "dashboard" ? "overflow-y-auto max-h-[465px]" : ""
      }`}
    >
      {orders.map((order) => {
        const displayOrderId = order.orderId || order._id;
        const displayTable =
          order.table?.name || order.tableName || order.table || "";

        // DASHBOARD LAYOUT
        if (variant === "dashboard") {
          const itemsPreview = (order.items || [])
            .slice(0, 2)
            .map((i) => `${i.quantity}× ${i.name}`)
            .join(", ");

          return (
            <div
              key={order._id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 border border-gray-100 rounded-lg overflow-hidden overflow-x-auto"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {displayOrderId}
                </div>
                <div className="text-xs text-gray-500">•{displayTable}</div>
                <div className="mt-1 text-xs text-gray-600">
                  {itemsPreview}
                  {(order.items || []).length > 2 ? "..." : ""}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-gray-900">
                  ₹{order.pricing?.grandTotal ?? 0}
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs ${getStatusBadgeClass(
                    order.status
                  )}`}
                >
                  {(order.status || "").toUpperCase()}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateStatus(order._id, "PREPARING")}
                    disabled={
                      !["PENDING", "NEW", "ACCEPTED"].includes(order.status)
                    }
                    className={`px-3 py-1 rounded-3 text-xs ${
                      ["PENDING", "NEW", "ACCEPTED"].includes(order.status)
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onUpdateStatus(order._id, "COMPLETED")}
                    disabled={order.status !== "PREPARING"}
                    className={`px-3 py-1 me-2 rounded-3 text-xs ${
                      order.status === "PREPARING"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          );
        }

        // DETAILED LAYOUT (ORDERS PAGE)
        return (
          <div
            key={order._id}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              {/* Basic Info */}
              <div>
                <div className="flex items-center gap-3">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {order.orderId}
                  </h5>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {formatDateTime(order.createdAt)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.orderType === "DINE_IN"
                    ? `Table ${displayTable}`
                    : order.orderType}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  👤 {order.customer?.name} | 📞 {order.customer?.phone}
                </p>
              </div>

              {/* Items + Pricing */}
              <div className="flex-1">
                {(order.items || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}

                <div className="pt-2 mt-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Subtotal</span>
                    <span>₹{order.pricing?.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Service + Tax</span>
                    <span>
                      ₹
                      {order.pricing?.serviceCharge +
                        order.pricing?.tax +
                        (order.pricing?.deliveryCharge || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-emerald-600">
                    <span>Total</span>
                    <span>₹{order.pricing?.grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => onUpdateStatus(order._id, "PREPARING")}
                  disabled={order.status !== "PENDING"}
                  className={`px-4 py-2 rounded-4 text-sm font-medium ${
                    order.status === "PENDING"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Accept
                </button>

                <button
                  onClick={() => onUpdateStatus(order._id, "COMPLETED")}
                  disabled={order.status !== "PREPARING"}
                  className={`px-4 py-2 rounded-4 text-sm font-medium ${
                    order.status === "PREPARING"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Complete
                </button>

                {onDelete && (
                  <button
                    onClick={() => onDelete(order._id)}
                    className="px-4 py-2 rounded-4 text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
