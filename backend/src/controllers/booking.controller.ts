import { bookings } from "../data/bookings.js";
import { users } from "../data/users.js";
import type { Booking } from "../types/index.js";

export const getBookings = (_req: any, res: any) => {
  res.json(bookings);
};

export const createBooking = (req: any, res: any) => {
  const { customer, vehicle, salesId } = req.body;

  const booking: Booking = {
    id: `BK${100 + bookings.length + 1}`,
    customer,
    vehicle,
    salesId,
    status: "booking_created",
  };

  bookings.push(booking);

  res.status(201).json({
    success: true,
    booking,
  });
};

export const sendToFinance = (req: any, res: any) => {
  const { id } = req.params;

  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  booking.status = "awaiting_finance";

  const sales = users.find((u) => u.id === booking.salesId);

  if (sales) {
    sales.xp += 20;
  }

  res.json({
    success: true,
    message: "Booking sent to Finance successfully",
    booking,
    sales,
  });
};