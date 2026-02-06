import { useEffect, useState } from "react";
import api from "../api/axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchAppointments = async () => {
    const res = await api.get("/appointments/provider?status=PENDING");
    const pending = res.data.data || [];
    setAppointments(pending);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setLoadingId(id);
      await api.patch(`/appointments/provider/update/${id}`, { status });
      fetchAppointments(); // refresh list
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        Pending Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">
          No pending appointment requests 🎉
        </p>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="border rounded-lg p-5 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                {/* LEFT INFO */}
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

                {/* ACTIONS */}
                <div className="flex flex-col gap-2">
                  <button
                    disabled={loadingId === a._id}
                    onClick={() =>
                      updateStatus(a._id, "CONFIRMED")
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Accept
                  </button>

                  <button
                    disabled={loadingId === a._id}
                    onClick={() =>
                      updateStatus(a._id, "REJECTED")
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* STATUS BADGE */}
              <div className="mt-3">
                <span className="inline-block bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded">
                  Pending
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
