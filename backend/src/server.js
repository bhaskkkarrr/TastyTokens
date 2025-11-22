const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");

// Connect to the database
dbConnect();

const app = express();
const PORT = process.env.PORT || 3000;

// Socket
// ✅ Create HTTP server
const http = require("http");
const server = http.createServer(app);

// ✅ Setup socket.io
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // in production, put your domain
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);

  // ✅ Admin joins restaurant room
  socket.on("joinRestaurantRoom", (restaurantId) => {
    socket.join(restaurantId);
    console.log(`✅ Admin joined room: ${restaurantId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

// ✅ Make io available to all controllers
app.set("io", io);

// Make io available in all controllers via req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes Import
const { authRoutes } = require("./routes/authRoutes");
const { categoryRoutes } = require("./routes/foodCategoryRoutes");
const { menuItemRoutes } = require("./routes/MenuItemRoutes");
const { tableRoutes } = require("./routes/TableRoutes");
const { publicRoutes } = require("./routes/publicRoutes");
const { orderRoutes } = require("./routes/OrderRoutes");
const { settingsRoutes } = require("./routes/settingsRoutes");
const { notificationRoutes } = require("./routes/notificationRoutes");
// app.use(
//   cors({
//     origin: "tasty-tokens.vercel.app",
//     credentials: true,
//   })
// );

app.use(cors());

// App Routes
app.use(express.json());
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menu", menuItemRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notification", notificationRoutes);

// Server Port
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
