import Availability from "../models/Availability.js";

export const createSlot = async (req, res) => {
  try {
    const providerId = req.user.id;
    const { date, startTime, endTime } = req.body;


    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Date, startTime and endTime are required",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    const overlappingSlot = await Availability.findOne({
      providerId,
      date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (overlappingSlot) {
      return res.status(409).json({
        success: false,
        message: "This slot overlaps with an existing slot",
      });
    }

    const slot = await Availability.create({
      providerId,
      date,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      message: "Slot created successfully",
      data: slot,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMySlots = async (req, res) => {
  try {
    const slots = await Availability.find({
      providerId: req.user.id,
      date: { $gte: new Date().toISOString().split("T")[0] },
    }).sort({ date: 1, startTime: 1 });

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

export const deleteSlot = async (req, res) => {
  try {
    const slot = await Availability.findOne({
      _id: req.params.id,
      providerId: req.user.id,
      isBooked: false,
    });

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: "Slot not found or already booked",
      });
    }

    await slot.deleteOne();

    res.json({
      success: true,
      message: "Slot deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getProviderSlots = async (req, res) => {
  try {
    const { providerId } = req.params;

    const today = new Date().toISOString().split("T")[0];

    const slots = await Availability.find({
      providerId,
      isBooked: false,
      date: { $gte: today },
    }).sort({ date: 1, startTime: 1 });

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
