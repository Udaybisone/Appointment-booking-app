import express from "express";
import auth from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
    bookAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    getAppointments,
} from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/book", auth, role("USER"), bookAppointment);
router.get("/", auth, getAppointments);
router.get("/provider", auth, role("PROVIDER"), getAppointments);
router.patch("/provider/update/:id", auth, role("PROVIDER"), updateAppointmentStatus);
router.patch("/:id/cancel",auth,role("USER"),cancelAppointment);

export default router;
