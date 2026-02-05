import mongoose from "mongoose";
import Provider from "./Provider.js";

const carRentalSchema = new mongoose.Schema({
  carTypes: { type: [String], required: true },
  hasDriver: { type: Boolean, default: false },
});

export default Provider.discriminator("CAR_RENTAL", carRentalSchema);
