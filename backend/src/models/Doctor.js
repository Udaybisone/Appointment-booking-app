import mongoose from "mongoose";
import Provider from "./Provider.js";

const doctorSchema = new mongoose.Schema({
  specialization: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  clinicName: String,
});

export default Provider.discriminator("DOCTOR", doctorSchema);
