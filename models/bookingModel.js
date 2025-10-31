import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  event: { type: String, required: true },
  ticketType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
