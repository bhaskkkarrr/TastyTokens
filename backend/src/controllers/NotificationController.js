const Notification = require("../models/NotificationModel");

// -------------------------------------------
// GET Notifications for a Restaurant
// -------------------------------------------
exports.getNotifications = async (req, res) => {
  try {
    const { restaurantId } = req.user;

    const notifications = await Notification.find({ restaurantId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------------------------
// Create Notification (reusable function)
// -------------------------------------------
exports.createNotification = async ({
  restaurantId,
  title,
  body = "",
  meta = {},
  io,
}) => {
  try {
    const notification = await Notification.create({
      restaurantId,
      title,
      body,
      meta,
      channel: "IN_APP",
    });

    // 🔥 Emit Real-Time Notification over socket
    if (io && restaurantId) {
      io.to(restaurantId.toString()).emit("newNotification", notification);
    }

    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// -------------------------------------------
// Mark Single Notification as Read
// -------------------------------------------
exports.markSingleRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, { read: true });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// -------------------------------------------
// Mark ALL notifications as read for restaurant
// -------------------------------------------
exports.markAllRead = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    await Notification.updateMany({ restaurantId }, { read: true });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
