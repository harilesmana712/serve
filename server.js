import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sajikan file hasil build dari folder 'dist'
app.use(express.static(path.join(__dirname, "dist")));

// Handle semua rute dengan file index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
