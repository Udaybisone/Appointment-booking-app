import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    serviceType: {
      type: String,
      enum: ["DOCTOR", "SALOON", "CAR_RENTAL"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    discriminatorKey: "serviceType",
  }
);

providerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

providerSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Provider = mongoose.model("Provider", providerSchema);
export default Provider;
