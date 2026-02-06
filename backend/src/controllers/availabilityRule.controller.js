import AvailabilityRule from "../models/AvailabilityRule.js";

/**
 * GET /api/availability-rule/me
 * Get logged-in provider's availability rule
 */
export const getMyAvailabilityRule = async (req, res) => {
  try {
    const rule = await AvailabilityRule.findOne({
      providerId: req.user.id,
    });

    res.json({
      success: true,
      data: rule, // may be null (not set yet)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * POST /api/availability-rule
 * Create or update availability rule (upsert)
 */
export const upsertAvailabilityRule = async (req, res) => {
  try {
    const {
      workingDays,
      startTime,
      endTime,
      slotDuration,
      holidays = [],
    } = req.body;

    // basic validation
    if (
      !workingDays ||
      !startTime ||
      !endTime ||
      !slotDuration
    ) {
      return res.status(400).json({
        success: false,
        message: "All availability fields are required",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    const rule = await AvailabilityRule.findOneAndUpdate(
      { providerId: req.user.id },
      {
        providerId: req.user.id,
        workingDays,
        startTime,
        endTime,
        slotDuration,
        holidays,
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Availability updated successfully",
      data: rule,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
