import express from "express";
import auth from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
  getMyAvailabilityRule,
  upsertAvailabilityRule,
} from "../controllers/availabilityRule.controller.js";

const router = express.Router();

// Provider availability rule
router.get("/me", auth, role("PROVIDER"), getMyAvailabilityRule);
router.post("/", auth, role("PROVIDER"), upsertAvailabilityRule);

export default router;
