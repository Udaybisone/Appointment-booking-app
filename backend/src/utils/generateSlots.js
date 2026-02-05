// utils/generateSlots.js

const timeToMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

/**
 * Generate slots for one day
 */
export const generateSlots = ({
  startTime,
  endTime,
  slotDuration,
  bookedSlots = [],
}) => {
  const slots = [];

  let start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  while (start + slotDuration <= end) {
    const slotStart = minutesToTime(start);
    const slotEnd = minutesToTime(start + slotDuration);

    const isBooked = bookedSlots.some(
      (b) => b.startTime === slotStart && b.endTime === slotEnd
    );

    if (!isBooked) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
      });
    }

    start += slotDuration;
  }

  return slots;
};
