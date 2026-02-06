import express from "express";
import { getAvailableSlots, getMyProfile, updateMyProfile } from "../controllers/provider.controller.js";
import { getProvidersByService } from "../controllers/provider.controller.js";
import auth from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";

const router = express.Router();

// Public: user can view available slots


router.get(
  "/:providerId/available-slots",
  getAvailableSlots
);

router.get("/:providerId/slots", getAvailableSlots);
router.get("/", getProvidersByService);
router.get("/me", auth, role("PROVIDER"), getMyProfile);
router.put("/me", auth, role("PROVIDER"), updateMyProfile);

export default router;