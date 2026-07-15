import { Router } from "express";
import {
  getBookings,
  createBooking,
  sendToFinance,
} from "../controllers/booking.controller.js";

const router = Router();

router.get("/", getBookings);
router.post("/", createBooking);
router.post("/:id/send-finance", sendToFinance);

export default router;