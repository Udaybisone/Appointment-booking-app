import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import { isOverlapping } from "../utils/timeOverlap.js";
import Provider from "../models/Provider.js";

export const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { providerId, date, startTime, endTime } = req.body;

    // 1️⃣ Find provider (to get serviceType safely)
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    // 2️⃣ Find available slot
    const slot = await Availability.findOne({
      providerId,
      date,
      startTime,
      endTime,
      isBooked: false,
    });

    if (!slot) {
      return res.status(409).json({
        success: false,
        message: "Slot is no longer available",
      });
    }

    // 3️⃣ Create appointment
    const appointment = await Appointment.create({
      userId,
      providerId,
      serviceType: provider.serviceType, // ✅ derived
      date,
      startTime,
      endTime,
      status: "PENDING",
    });

    // Lock slot
    slot.isBooked = true;
    await slot.save();

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    // role-based filtering
    if (req.user.role === "USER") {
      query.userId = req.user.id;
    }

    if (req.user.role === "PROVIDER") {
      query.providerId = req.user.id;
    }

    // optional status filter
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate("providerId", "name serviceType")
      .populate("userId", "name email")
      .sort({ date: 1, startTime: 1 });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const appointment = await Appointment.findOne({
      _id: id,
      userId,
      status: { $in: ["CONFIRMED", "PENDING"] },
    });

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment cannot be cancelled",
      });
    }

    // 1️⃣ Update appointment status
    appointment.status = "CANCELLED";
    await appointment.save();

    // 2️⃣ Unlock slot
    await Availability.findOneAndUpdate(
      {
        providerId: appointment.providerId,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      },
      { isBooked: false }
    );

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


