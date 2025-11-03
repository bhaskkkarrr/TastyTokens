const Order = require("../models/OrderModel");

exports.postCreateOrder = async (req, res) => {
  try {
    const { restaurantId, tableId, items, total } = req.body;

    if (!restaurantId || !tableId || !items?.length)
      return res.status(400).json({ message: "Missing fields" });

    const newOrder = await Order.create({
      restaurantId,
      tableNumber: tableId,
      items,
      total,
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrdersByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.user.id; // assuming this comes from JWT
    console.log("Restaurant ID:", restaurantId);

    // ✅ Find all orders where restaurantId matches, sorted by creation time
    const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });

    res.json({ success: true, orders: orders });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
