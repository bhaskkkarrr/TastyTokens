const Table = require("../models/TableModel");
const Admin = require("../models/AdminModel");
const QRCode = require("qrcode");
const { nanoid } = require("nanoid");

// ✅ Base URL — You can move this to ENV later
const BASE_URL = "https://tasty-tokens.vercel.app";

// ===================================================================
// ✅ CREATE TABLE (POST)
// ===================================================================
exports.postAddTable = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Table name is required",
      });
    }

    // ✅ Check restaurant exists
    const restaurant = await Admin.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // ✅ Prevent duplicate table names inside same restaurant
    const existingTable = await Table.findOne({
      restaurantId,
      name,
    });

    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: "A table with this name already exists",
      });
    }

    // ✅ Generate permanent table code
    const tableCode = nanoid(8);

    // ✅ Static QR code URL structure
    const qrUrl = `${BASE_URL}/r/${restaurantId}/t/${tableCode}`;

    // ✅ Create QR image (base64)
    const qrImage = await QRCode.toDataURL(qrUrl);

    const newTable = new Table({
      restaurantId,
      name,
      code: tableCode,
      qrUrl,
      qrImage,
    });

    await newTable.save();

    return res.status(201).json({
      success: true,
      message: "Table created",
      table: newTable,
    });
  } catch (err) {
    console.error("Create table error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error in creating table",
      error: err.message,
    });
  }
};

// ===================================================================
// ✅ GET ALL TABLES (GET)
// ===================================================================
exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ restaurantId: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      tables,
    });
  } catch (err) {
    console.error("Fetch tables error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error in fetching tables",
    });
  }
};

// ===================================================================
// ✅ UPDATE TABLE NAME (PATCH)
// ===================================================================
exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isOcuppied } = req.body;

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // ✅ Prevent duplicate table names inside same restaurant
    if (name) {
      const duplicate = await Table.findOne({
        restaurantId: table.restaurantId,
        name,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Another table with this name already exists",
        });
      }

      table.name = name;
    }

    if (isOcuppied !== undefined) {
      table.isOcuppied = isOcuppied;
    }

    await table.save();

    return res.status(200).json({
      success: true,
      message: "Table updated successfully",
      table,
    });
  } catch (error) {
    console.error("Update table error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in updating table",
      error: error.message,
    });
  }
};

// ===================================================================
// ✅ DELETE TABLE (DELETE)
// ===================================================================
exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    await table.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Table deleted",
    });
  } catch (error) {
    console.error("Delete table error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in deleting table",
    });
  }
};
