const Table = require("../models/TableModel");
const Admin = require("../models/AdminModel");
const QRCode = require("qrcode");
const { nanoid } = require("nanoid");
require("dotenv").config();

exports.postAddTable = async (req, res) => {
  const { id } = req.user;
  console.log("USer", id);
  const { tableName } = req.body;

  const restaurant = await Admin.findById(id);
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  const tableCode = nanoid(8);
  const baseUrl = "tasty-tokens.vercel.app";
  console.log(baseUrl);
  const qrUrl = `${baseUrl}/r/${id}/t/${tableCode}`;
  const qrImage = await QRCode.toDataURL(qrUrl);

  const newTable = new Table({
    restaurantId: id,
    name: tableName,
    code: tableCode,
    qrUrl,
    qrImage,
  });
  await newTable.save();
  res.status(200).json({ success: true, message: "Table created", newTable });
};

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ restaurantId: req.user.id });
    res.status(201).json({ success: true, tables });
  } catch (err) {
    res.status(501).json({ message: "Error fetching tables" });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findById(id);
    if (!table) {
      res.status(401).json({ success: false, message: "No table founded" });
    }
    await table.deleteOne();
    res.status(201).json({ success: true, message: "Table deleted" });
  } catch (error) {
    res.status(501).json({ success: false, message: "Error deleting tables" });
  }
};
