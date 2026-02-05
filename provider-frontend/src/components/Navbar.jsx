import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();

  if (!token) return null;

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between">
      <h2 className="font-bold">Provider Panel</h2>
      <div className="space-x-4">
        <Link to="/">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/availability">Availability</Link>
        <Link to="/appointments">Appointments</Link>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
