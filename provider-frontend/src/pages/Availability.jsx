import { useEffect, useState } from "react";
import api from "../api/axios";

const DAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

const Availability = () => {
  const [workingDays, setWorkingDays] = useState([]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [slotDuration, setSlotDuration] = useState(30);
  const [holidays, setHolidays] = useState([]);
  const [holidayInput, setHolidayInput] = useState("");
  const [loading, setLoading] = useState(true);

  // fetch existing rule
  useEffect(() => {
    const fetchRule = async () => {
      try {
        const res = await api.get("/availability-rule/me");
        const rule = res.data.data;

        if (rule) {
          setWorkingDays(rule.workingDays);
          setStartTime(rule.startTime);
          setEndTime(rule.endTime);
          setSlotDuration(rule.slotDuration);
          setHolidays(rule.holidays || []);
        }
      } catch {
        alert("Failed to load availability");
      } finally {
        setLoading(false);
      }
    };

    fetchRule();
  }, []);

  const toggleDay = (day) => {
    setWorkingDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const addHoliday = () => {
    if (!holidayInput || holidays.includes(holidayInput)) return;
    setHolidays([...holidays, holidayInput]);
    setHolidayInput("");
  };

  const removeHoliday = (date) => {
    setHolidays(holidays.filter((d) => d !== date));
  };

  const saveAvailability = async () => {
    try {
      await api.post("/availability-rule", {
        workingDays,
        startTime,
        endTime,
        slotDuration,
        holidays,
      });
      alert("Availability updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save availability");
    }
  };

  if (loading) {
    return <div className="p-8">Loading availability...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        Availability Settings
      </h2>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* WORKING DAYS */}
        <section>
          <h3 className="font-semibold mb-3">Working Days</h3>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`px-3 py-1 rounded border ${
                  workingDays.includes(day.value)
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </section>

        {/* WORKING HOURS */}
        <section>
          <h3 className="font-semibold mb-3">Working Hours</h3>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        </section>

        {/* SLOT DURATION */}
        <section>
          <h3 className="font-semibold mb-3">
            Slot Duration (minutes)
          </h3>
          <select
            className="border p-2 rounded w-full"
            value={slotDuration}
            onChange={(e) =>
              setSlotDuration(Number(e.target.value))
            }
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={300}>5 hours</option>
            <option value={600}>10 hours</option>
            <option value={1440}>24 hours</option>
          </select>
        </section>

        {/* HOLIDAYS */}
        <section>
          <h3 className="font-semibold mb-3">Holidays / Off Days</h3>

          <div className="flex gap-2 mb-3">
            <input
              type="date"
              className="border p-2 rounded"
              value={holidayInput}
              onChange={(e) => setHolidayInput(e.target.value)}
            />
            <button
              onClick={addHoliday}
              className="bg-green-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {holidays.map((d) => (
              <span
                key={d}
                className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
              >
                {d}
                <button
                  onClick={() => removeHoliday(d)}
                  className="text-red-600"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* SAVE */}
        <button
          onClick={saveAvailability}
          className="bg-indigo-600 text-white px-6 py-2 rounded w-full"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
};

export default Availability;
