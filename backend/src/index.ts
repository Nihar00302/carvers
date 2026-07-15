import express from "express";
import cors from "cors";

import bookingRoutes from "./routes/booking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "🚀 CarExpo Backend Running",
  });
});

app.get("/api/health", (_, res) => {
  res.json({
    status: "ok",
    server: "CarExpo Backend",
    version: "1.0.0",
  });
});

// Booking Routes
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});