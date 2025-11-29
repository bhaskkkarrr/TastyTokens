// controllers/discountController.js
const Discount = require("../models/DiscountModel");

exports.createDiscount = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId; // <-- ensure this is correct
    const { type, amount, appliesTo, category, item, startDate, endDate } =
      req.body;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start Date cannot be greater than End Date",
      });
    }

    const discount = await Discount.create({
      restaurantId,
      type,
      amount,
      appliesTo,
      category: appliesTo === "category" ? category : null,
      item: appliesTo === "item" ? item : null,
      startDate: startDate || null,
      endDate: endDate || null,
      active: true,
    });

    // NO DB writes to menu items — menu reads compute price dynamically

    return res.json({ success: true, message: "Discount created", discount });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllDiscounts = async (req, res) => {
  console.log("user", req.user);
  const restaurantId = req.user.restaurantId;
  console.log("Res", restaurantId);
  try {
    const discounts = await Discount.find({ restaurantId })
      .populate("category", "name") // get only the name
      .populate("item", "name price") // get item name (and anything else)
      .sort({ createdAt: -1 });
    if (!discounts) {
      res.status(401).json({ success: false, message: "Invalid restaurant" });
    }
    res
      .status(201)
      .json({ success: true, message: "All Discounts", discounts });
  } catch (error) {
    res.status(501).json({ success: false, message: error.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  console.log("Params", req.params);
  try {
    const { id } = req.params;
    const discount = Discount.findById(id);
    if (!discount) {
      res.status(401).json({ success: false, message: "Discount not found" });
    }
    await Discount.findByIdAndDelete(id);
    res.status(201).json({ success: true, message: "Discount deleted" });
  } catch (error) {
    res.status(501).json({ success: false, message: error.message, error });
  }
};

exports.toggleDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findById(id);
    if (!discount) {
      return res
        .status(404)
        .json({ success: false, message: "Discount not found" });
    }

    discount.active = !discount.active; // toggle
    await discount.save();

    return res.json({ success: true, message: "Updated", discount });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
