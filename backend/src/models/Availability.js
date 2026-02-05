import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    startTime: {
      type: String, // HH:mm
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Availability", availabilitySchema);
