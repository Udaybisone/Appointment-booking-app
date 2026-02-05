import { useEffect, useState } from "react";
import api from "../api/axios";

const Availability = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState([]);

  const fetchSlots = async () => {
    const res = await api.get("/availability/me");
    setSlots(res.data.data);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const createSlot = async () => {
    try {
      await api.post("/availability", {
        date,
        startTime,
        endTime,
      });
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create slot");
    }
  };

  const deleteSlot = async (id) => {
    if (!confirm("Delete this slot?")) return;
    await api.delete(`/availability/${id}`);
    fetchSlots();
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>

      {/* CREATE SLOT */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="font-semibold mb-3">Create Slot</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <input
            type="time"
            className="border p-2 rounded"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />

          <button
            onClick={createSlot}
            className="bg-green-600 text-white py-2 rounded col-span-full"
          >
            Add Slot
          </button>
        </div>
      </div>

      {/* SLOT LIST */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-3">My Slots</h3>

        {slots.length === 0 ? (
          <p className="text-gray-500">No slots created yet</p>
        ) : (
          <div className="space-y-2">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <div>
                  <p className="font-medium">
                    {slot.date} | {slot.startTime} - {slot.endTime}
                  </p>
                  {slot.isBooked && (
                    <span className="text-sm text-red-600">
                      Booked
                    </span>
                  )}
                </div>

                {!slot.isBooked && (
                  <button
                    onClick={() => deleteSlot(slot._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Availability;
