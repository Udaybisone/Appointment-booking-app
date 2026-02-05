import { useEffect, useState } from "react";
import api from "../api/axios";

const MyAppointments = () => {

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-700 text-white",
    CANCELLED: "bg-gray-100 text-gray-600",
  };
  
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    const res = await api.get("/appointments");
    setAppointments(res.data.data || []);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    if (!confirm("Cancel this appointment?")) return;

    try {
      await api.patch(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments yet</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="border rounded p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">
                    {a.providerId?.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    Service: {a.providerId?.serviceType}
                  </p>

                  <p className="mt-2">
                    📅 {a.date}
                  </p>

                  <p>
                    ⏰ {a.startTime} – {a.endTime}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${statusStyles[a.status] || "bg-gray-100 text-gray-600"}`}
                  >
                    {a.status}
                  </span>


                  {(a.status === "CONFIRMED" || a.status === "PENDING") && (
                    <button
                      onClick={() => cancelAppointment(a._id)}
                      className="block mt-3 text-red-600 text-sm"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
