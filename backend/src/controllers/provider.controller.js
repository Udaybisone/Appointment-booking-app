
import Appointment from "../models/Appointment.js";
import { generateSlots } from "../utils/generateSlots.js";
import Provider from "../models/Provider.js";
import AvailabilityRule from "../models/AvailabilityRule.js";


export const getProvidersByService = async (req, res) => {
  try {
    const { serviceType } = req.query;
    if (!serviceType) {
      return res.status(400).json({
        success: false,
        message: "serviceType query parameter is required",
      });
    }

    const providers = await Provider.find({
      serviceType,
      isActive: true,
    }).select("-password");

    return res.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error("getProvidersByService error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch providers",
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {

    const provider = await Provider.findById(req.user.id).select(
      "-password"
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    res.json({
      success: true,
      data: provider,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateMyProfile = async (req, res) => {
  try {
    const provider = await Provider.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    const { name } = req.body;

    // common update
    if (name) provider.name = name;

    // service-specific updates
    if (provider.serviceType === "DOCTOR") {
      if (req.body.specialization !== undefined)
        provider.specialization = req.body.specialization;

      if (req.body.experienceYears !== undefined)
        provider.experienceYears = req.body.experienceYears;
    }

    if (provider.serviceType === "SALOON") {
      if (req.body.location !== undefined)
        provider.location = req.body.location;

      if (req.body.phoneNumber !== undefined)
        provider.phoneNumber = req.body.phoneNumber;
    }

    if (provider.serviceType === "CAR_RENTAL") {
      if (req.body.carTypes !== undefined)
        provider.carTypes = req.body.carTypes;
    }

    await provider.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: provider,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/**
 * GET /api/providers/:providerId/available-slots?date=YYYY-MM-DD
 */
export const getAvailableSlots = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    // 1️⃣ Fetch availability rule
    const rule = await AvailabilityRule.findOne({ providerId });

    if (!rule) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // 2️⃣ Check holiday
    if (rule.holidays.includes(date)) {
      return res.json({
        success: true,
        data: [],
      });
    }
    
    // 3️⃣ Check working day
    const dayOfWeek = new Date(date).getDay();
    if (!rule.workingDays.includes(dayOfWeek)) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // 4️⃣ Generate slots
    let slots = generateSlots(
      rule.startTime,
      rule.endTime,
      rule.slotDuration
    );
    // 5️⃣ Fetch booked appointments for that date
    const appointments = await Appointment.find({
      providerId,
      date,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    // 6️⃣ Remove overlapping slots
    slots = slots.filter((slot) => {
      return !appointments.some((appt) => {
        return (
          slot.startTime < appt.endTime &&
          slot.endTime > appt.startTime
        );
      });
    });

    // 7️⃣ Remove past slots if date is today
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      slots = slots.filter((slot) => {
        const [h, m] = slot.startTime.split(":").map(Number);
        return h * 60 + m > nowMinutes;
      });
    }

    res.json({
      success: true,
      data: slots,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



