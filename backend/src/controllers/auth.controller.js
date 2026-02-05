import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Saloon from "../models/Saloon.js";
import CarRental from "../models/CarRental.js";

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const { role, serviceType, email } = req.body;

    // ===== USER REGISTER =====
    if (role === "USER") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const user = await User.create(req.body);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        token: generateToken({ id: user._id, role }),
        data: user,
      });
    }

    // ===== PROVIDER REGISTER =====
    if (role === "PROVIDER") {
      let provider;
      let providerName = "";

      // check email across all providers
      const providerExists =
        (await Doctor.findOne({ email })) ||
        (await Saloon.findOne({ email })) ||
        (await CarRental.findOne({ email }));

      if (providerExists) {
        return res.status(400).json({
          success: false,
          message: "Provider already exists",
        });
      }

      if (serviceType === "DOCTOR") {
        provider = await Doctor.create(req.body);
        providerName = "Doctor";
      }

      if (serviceType === "SALOON") {
        provider = await Saloon.create(req.body);
        providerName = "Saloon";
      }

      if (serviceType === "CAR_RENTAL") {
        provider = await CarRental.create(req.body);
        providerName = "Car Rental";
      }

      if (!provider) {
        return res.status(400).json({
          success: false,
          message: "Invalid service type",
        });
      }

      return res.status(201).json({
        success: true,
        message: `${providerName} already created successfully`,
        token: generateToken({
          id: provider._id,
          role,
          serviceType,
        }),
        data: provider,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid role",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let account;

    if (role === "USER") {
      account = await User.findOne({ email }).select("+password");
    } else if (role === "PROVIDER") {
      account =
        (await Doctor.findOne({ email }).select("+password")) ||
        (await Saloon.findOne({ email }).select("+password")) ||
        (await CarRental.findOne({ email }).select("+password"));
    }

    if (!account || !(await account.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      token: generateToken({
        id: account._id,
        role,
        serviceType: account.serviceType,
      }),
      data: account,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
