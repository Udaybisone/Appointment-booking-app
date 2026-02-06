import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import availabilityRuleRoutes from "./routes/availabilityRule.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/availability-rule", availabilityRuleRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);


export default app;
