import mongoose from "mongoose";

const availabilityRuleSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      unique: true, // one rule per provider
    },

    workingDays: {
      type: [Number], // 0 (Sun) - 6 (Sat)
      required: true,
    },

    startTime: {
      type: String, // HH:mm
      required: true,
    },

    endTime: {
      type: String, // HH:mm
      required: true,
    },

    slotDuration: {
      type: Number, // minutes
      required: true,
      min: 15,
    },

    holidays: {
      type: [String], // YYYY-MM-DD
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("AvailabilityRule", availabilityRuleSchema);
