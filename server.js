import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Booking from "./models/bookingModel.js";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// 🟢 CREATE booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;
    if (!name || !email || !event)
      return res.status(400).json({ message: "Name, Email, and Event are required" });

    const booking = new Booking({ name, email, event, ticketType });
    await booking.save();
    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟡 READ all bookings
app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

// 🟣 READ by ID
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// 🔵 UPDATE
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking updated", updated });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
});

// 🔴 DELETE
app.delete("/api/bookings/:id", async (req, res) => {
  const deleted = await Booking.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Booking not found" });
  res.json({ message: "Booking deleted successfully" });
});

// 🟠 SEARCH by email
app.get("/api/bookings/search", async (req, res) => {
  const { email } = req.query;
  const results = await Booking.find({ email });
  res.json(results);
});

// 🟢 FILTER by event
app.get("/api/bookings/filter", async (req, res) => {
  const { event } = req.query;
  const results = await Booking.find({ event });
  res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
