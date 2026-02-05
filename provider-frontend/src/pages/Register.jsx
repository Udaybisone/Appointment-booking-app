import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serviceType, setServiceType] = useState("DOCTOR");



  // Doctor fields
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  // Saloon fields
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Car rental fields
  const [carTypes, setCarTypes] = useState("");

  const submit = async () => {
    try {
      const payload = {
        role: "PROVIDER",
        name,
        email,
        password,
        serviceType,
      };

      // Attach service-specific fields
      if (serviceType === "DOCTOR") {
        payload.specialization = specialization;
        payload.experienceYears = Number(experienceYears);
      }

      if (serviceType === "SALOON") {
        payload.location = location;
        payload.phoneNumber = phoneNumber;
      }


      if (serviceType === "CAR_RENTAL") {
        payload.carTypes = carTypes.split(","); // "SUV, Sedan"
      }

      const res = await api.post("/auth/register", payload);

      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Provider Register</h2>

        <input
          className="border w-full mb-3 p-2 rounded"
          placeholder="Name / Business Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border w-full mb-3 p-2 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full mb-3 p-2 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Service Type */}
        <select
          className="border w-full mb-3 p-2 rounded"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          <option value="DOCTOR">Doctor</option>
          <option value="SALOON">Saloon</option>
          <option value="CAR_RENTAL">Car Rental</option>
        </select>

        {/* Doctor Fields */}
        {serviceType === "DOCTOR" && (
          <>
            <input
              className="border w-full mb-3 p-2 rounded"
              placeholder="Specialization"
              onChange={(e) => setSpecialization(e.target.value)}
            />
            <input
              type="number"
              className="border w-full mb-3 p-2 rounded"
              placeholder="Experience (years)"
              onChange={(e) => setExperienceYears(e.target.value)}
            />
          </>
        )}

        {/* Saloon Fields */}
        {serviceType === "SALOON" && (
          <>
            <input
              className="border w-full mb-3 p-2 rounded"
              placeholder="Saloon location"
              onChange={(e) => setLocation(e.target.value)}
            />

            <input
              className="border w-full mb-3 p-2 rounded"
              placeholder="Phone number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </>
        )}

        {/* Car Rental Fields */}
        {serviceType === "CAR_RENTAL" && (
          <input
            className="border w-full mb-3 p-2 rounded"
            placeholder="Car types (SUV, Sedan)"
            onChange={(e) => setCarTypes(e.target.value)}
          />
        )}

        <button
          onClick={submit}
          className="bg-green-600 text-white w-full py-2 rounded"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
