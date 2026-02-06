import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", {
        role: "USER",
        email,
        password,
      });
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          className="border w-full mb-3 p-2 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full mb-4 p-2 rounded"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
