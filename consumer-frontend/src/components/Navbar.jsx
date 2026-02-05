import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold text-lg">
          Appointment App
        </Link>
      </div>

      <div className="flex items-center space-x-4">

        {token && (
          <Link
            to="/" className="hover:underline"
          >
            All Services
          </Link>
        )}

        {token && (
          <Link to="/appointments" className="hover:underline">
            My Appointments
          </Link>
        )}

        {token ? (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
