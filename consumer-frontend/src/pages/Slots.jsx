import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Slots = () => {
  const { providerId } = useParams();

  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch slots when date changes
  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/providers/${providerId}/available-slots?date=${date}`
        );
        setSlots(res.data.data || []);
      } catch (err) {
        alert("Failed to fetch slots");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date, providerId]);

  const confirmBooking = async () => {
    try {
      await api.post("/appointments/book", {
        providerId,
        date,
        startTime: selectedSlot.startTime,
      });
      alert("Booking request sent");
      setSelectedSlot(null);
      setSlots([]);
      setDate("");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Book Appointment</h2>

      {/* DATE PICKER */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Date
        </label>
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* SLOTS */}
      {loading && <p>Loading available slots...</p>}

      {!loading && date && slots.length === 0 && (
        <p className="text-gray-500">
          No available slots for this date
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => setSelectedSlot(slot)}
            className="border py-2 rounded hover:bg-green-600 hover:text-white transition"
          >
            {slot.startTime} – {slot.endTime}
          </button>
        ))}
      </div>

      {/* CONFIRM MODAL */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-3">
              Confirm Booking
            </h3>

            <p className="mb-4">
              Date: <strong>{date}</strong>
              <br />
              Time:{" "}
              <strong>
                {selectedSlot.startTime} –{" "}
                {selectedSlot.endTime}
              </strong>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmBooking}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slots;