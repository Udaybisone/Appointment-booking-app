import mongoose from "mongoose";
import Provider from "./Provider.js";

const saloonSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

export default Provider.discriminator("SALOON", saloonSchema);
