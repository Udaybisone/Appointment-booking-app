import Appointment from "../models/Appointment.js";
import Provider from "../models/Provider.js";
import AvailabilityRule from "../models/AvailabilityRule.js";


export const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { providerId, date, startTime } = req.body;

    if (!providerId || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message: "providerId, date and startTime are required",
      });
    }

    // 1️⃣ Provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    // 2️⃣ Availability rule exists
    const rule = await AvailabilityRule.findOne({ providerId });
    if (!rule) {
      return res.status(400).json({
        success: false,
        message: "Provider availability not set",
      });
    }

    // 3️⃣ Holiday check
    if (rule.holidays.includes(date)) {
      return res.status(400).json({
        success: false,
        message: "Provider is not available on this date",
      });
    }

    // 4️⃣ Working day check
    const dayOfWeek = new Date(date).getDay();
    if (!rule.workingDays.includes(dayOfWeek)) {
      return res.status(400).json({
        success: false,
        message: "Provider is not available on this day",
      });
    }

    // 5️⃣ Compute endTime from slotDuration
    const [h, m] = startTime.split(":").map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + rule.slotDuration;

    const endH = Math.floor(endMinutes / 60)
      .toString()
      .padStart(2, "0");
    const endM = (endMinutes % 60)
      .toString()
      .padStart(2, "0");

    const endTime = `${endH}:${endM}`;

    // 6️⃣ Working hours check
    if (
      startTime < rule.startTime ||
      endTime > rule.endTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Selected time is outside working hours",
      });
    }

    // 7️⃣ Overlap check (CRITICAL)
    const overlapping = await Appointment.findOne({
      providerId,
      date,
      status: { $in: ["PENDING", "CONFIRMED"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlapping) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // 8️⃣ Create appointment
    const appointment = await Appointment.create({
      providerId,
      userId,
      serviceType: provider.serviceType,
      date,
      startTime,
      endTime,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Booking request sent successfully",
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

    // Update appointment status only
    appointment.status = "CANCELLED";
    await appointment.save();

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



