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

export const generateSlots = (
  startTime,
  endTime,
  slotDuration,
  bookedSlots = [],
) => {
  const slots = [];
  
  let current = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  while (current + slotDuration <= end) {
    const slotStartMin = current;
    const slotEndMin = current + slotDuration;

    const slotStart = minutesToTime(slotStartMin);
    const slotEnd = minutesToTime(slotEndMin);

    const overlaps = bookedSlots.some((b) => {
      const bookedStart = timeToMinutes(b.startTime);
      const bookedEnd = timeToMinutes(b.endTime);

      return (
        slotStartMin < bookedEnd &&
        slotEndMin > bookedStart
      );
    });

    if (!overlaps) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
      });
    }

    current += slotDuration;
  }

  return slots;
};
