import Availability from "../models/Availability.js";
import Appointment from "../models/Appointment.js";
import { generateSlots } from "../utils/generateSlots.js";
import Provider from "../models/Provider.js";

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

    const dayOfWeek = new Date(date).getDay();

    // 1. Get provider availability for that day
    const availability = await Availability.findOne({
      providerId,
      dayOfWeek,
      isHoliday: false,
    });

    if (!availability) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // 2. Get already booked slots
    const appointments = await Appointment.find({
      providerId,
      date,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    const bookedSlots = appointments.map((a) => ({
      startTime: a.startTime,
      endTime: a.endTime,
    }));

    // 3. Generate slots
    const slots = generateSlots({
      startTime: availability.startTime,
      endTime: availability.endTime,
      slotDuration: availability.slotDuration,
      bookedSlots,
    });

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


