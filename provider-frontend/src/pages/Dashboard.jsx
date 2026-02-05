import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUSES = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Completed", value: "COMPLETED" },
];

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeStatus, setActiveStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async (status = "") => {
    try {
      setLoading(true);
      const url = status
        ? `/appointments/provider?status=${status}`
        : `/appointments/provider`;

      const res = await api.get(url);
      setAppointments(res.data.data || []);
    } catch (err) {
      alert("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(activeStatus);
  }, [activeStatus]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Manage all your appointments in one place
        </p>
      </div>

      {/* STATUS FILTER */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s.label}
            onClick={() => setActiveStatus(s.value)}
            className={`px-4 py-2 rounded border text-sm ${
              activeStatus === s.value
                ? "bg-indigo-600 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">
          No appointments found for this status
        </p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white border rounded-lg p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                {/* LEFT */}
                <div>
                  <p className="font-semibold text-lg">
                    {a.userId?.name || "Customer"}
                  </p>

                  <p className="text-sm text-gray-500">
                    Service: {a.serviceType}
                  </p>

                  <p className="mt-2">
                    📅 <strong>{a.date}</strong>
                  </p>

                  <p>
                    ⏰ {a.startTime} – {a.endTime}
                  </p>
                </div>

                {/* RIGHT */}
                <span
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    a.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : a.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : a.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
