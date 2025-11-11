const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

module.exports = function generateInitialsImage(initials) {
  const size = 400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // ✅ Ensure temp folder exists
  const tempDir = path.join(__dirname, "../temp");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Background color
  ctx.fillStyle = "#ffffffff";
  ctx.fillRect(0, 0, size, size);

  // Text styling
  ctx.fillStyle = "#000000";
  ctx.font = "bold 200px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(initials, size / 2, size / 2);

  // ✅ Save inside temp folder
  const filePath = path.join(tempDir, `${initials}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);

  return filePath;
};
