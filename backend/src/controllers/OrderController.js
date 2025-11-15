const Order = require("../models/OrderModel");
const MenuItem = require("../models/MenuItemModel");
const Restaurant = require("../models/RestaurantModel");
const Table = require("../models/TableModel");
// ✅ Create New Order
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, table, items, customer, orderType, pricing } =
      req.body;
    console.log("Creating order for restaurant:", req.body);
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }
    // console.log("table:", tableId);
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const occupiedTable = await Table.findOne({ code: table });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    // ✅ Fetch actual menu item details to prevent manipulation
    const itemIds = items.map((i) => i.itemId);
    const menuItems = await MenuItem.find({ _id: { $in: itemIds } });
    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: "One or more items invalid" });
    }

    // ✅ Lock item name, price, variants, addons
    const formattedItems = items.map((cartItem) => {
      const dbItem = menuItems.find(
        (i) => i._id.toString() === cartItem.itemId
      );

      const variantPrice =
        cartItem.selectedVariant?.price || dbItem.basePrice || 0;

      const addonTotal = (cartItem.addons || []).reduce(
        (sum, a) => sum + (a.price || 0),
        0
      );

      const finalPrice = variantPrice + addonTotal;

      return {
        itemId: dbItem._id,
        name: dbItem.name,
        quantity: cartItem.quantity,
        price: finalPrice,
        selectedVariant: cartItem.selectedVariant || {},
        addons: cartItem.addons || [],
        notes: cartItem.notes || "",
        total: finalPrice * cartItem.quantity,
      };
    });

    // ✅ Build Order
    const order = new Order({
      restaurantId,
      table: occupiedTable.name,
      items: formattedItems,
      customer,
      orderType,
      pricing,
    });

    await order.validate(); // triggers subtotal + grandTotal

    const savedOrder = await order.save();

    // ✅ Emit to restaurant panel (if using socket.io)
    if (req.io) {
      req.io.to(restaurantId.toString()).emit("newOrder", savedOrder);
    }

    res.status(201).json({
      success: true,
      order: savedOrder,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

// ✅ Update Order Status (ACCEPTED → PREPARING → COMPLETED → CANCELLED)
exports.updateOrderStatus = async (req, res) => {
  console.log("Params:", req.params);
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    console.log("Updating order", orderId, "to status", status);
    const valid = [
      "PENDING",
      "ACCEPTED",
      "PREPARING",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!valid.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // ✅ Emit live updates
    if (req.io) {
      req.io.to(order.restaurantId.toString()).emit("orderUpdated", order);
    }

    res.json({ success: true, order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating order", error: err.message });
  }
};

// ✅ Get All Orders of a Restaurant
exports.getOrdersForRestaurant = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    console.log("Fetching orders for restaurant:", restaurantId);
    const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

// ✅ Get Single Order by orderId
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: err.message });
  }
};

// ✅ Cancel Order
// exports.cancelOrder = async (req, res) => {
//   try {
//     const { reason } = req.body;

//     const order = await Order.findOne({ orderId: req.params.orderId });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.status = "CANCELLED";
//     if (reason) order.cancelReason = reason;

//     await order.save();

//     if (req.io) {
//       req.io.to(order.restaurantId.toString()).emit("orderCancelled", order);
//     }

//     res.json({ success: true, order });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error cancelling order", error: err.message });
//   }
// };

// ✅ Delete Order (Admin use only)
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const restaurantId = req.user.restaurantId; // from token

    const order = await Order.findOne({ _id: orderId, restaurantId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found or not authorized" });
    }

    await Order.deleteOne({ _id: orderId });

    // ✅ Emit delete event to all admin panels for live sync
    if (req.io) {
      req.io.to(restaurantId.toString()).emit("orderDeleted", { _id: orderId });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
      deletedId: orderId,
    });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: err.message,
    });
  }
};
