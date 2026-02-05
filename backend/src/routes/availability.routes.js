import express from "express";
import auth from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
  createSlot,
  getMySlots,
  deleteSlot,
} from "../controllers/availability.controller.js";
import { getProviderSlots } from "../controllers/availability.controller.js";

const router = express.Router();

router.post("/", auth, role("PROVIDER"), createSlot);
router.get("/me", auth, role("PROVIDER"), getMySlots);
router.delete("/:id", auth, role("PROVIDER"), deleteSlot);
router.get("/provider/:providerId", getProviderSlots);

export default router;

