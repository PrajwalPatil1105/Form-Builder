const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const formRoutes = require("../Server/Route/forms");
const connectDB = require("./config/db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/forms", formRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
