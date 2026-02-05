import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Slots = () => {
  const { providerId } = useParams();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    const res = await api.get(
      `/availability/provider/${providerId}`
    );
    setSlots(res.data.data || []);
  };

  useEffect(() => {
    fetchSlots();
  }, [providerId]);

  const confirmBooking = async () => {
    try {
      setLoading(true);
      await api.post("/appointments/book", {
        providerId,
        date: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
      setSelectedSlot(null);
      fetchSlots(); 
      alert("Appointment booked");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Slots</h2>

      {slots.length === 0 ? (
        <p className="text-gray-500">No available slots</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {slots.map((slot) => (
            <button
              key={slot._id}
              onClick={() => setSelectedSlot(slot)}
              className="border rounded p-4 hover:bg-green-500 hover:text-white transition"
            >
              <p className="font-semibold">{slot.date}</p>
              <p>
                {slot.startTime} – {slot.endTime}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-bold mb-3">
              Confirm Booking
            </h3>

            <p className="mb-4">
              Do you want to book this slot?
              <br />
              <strong>
                {selectedSlot.date} <br />
                {selectedSlot.startTime} – {selectedSlot.endTime}
              </strong>
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedSlot(null)}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                No
              </button>

              <button
                onClick={confirmBooking}
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Booking..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slots;
