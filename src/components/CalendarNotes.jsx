import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  setYear,
} from "date-fns";
import { uz } from "date-fns/locale";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CompactCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startWeekday = getDay(startOfMonth(currentDate));
  const emptyDays = new Array(startWeekday === 0 ? 6 : startWeekday - 1).fill(null);

  const handleMonthChange = (direction) => {
    setCurrentDate(direction === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setCurrentDate(setYear(currentDate, newYear));
  };

  return (
    <div className="max-w-xs mx-auto p-4 bg-white rounded-xl border border-gray-200">
      {/* Навигация */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => handleMonthChange("prev")}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <FaChevronLeft className="text-gray-600 text-sm" />
        </button>
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {format(currentDate, "LLLL", { locale: uz })}
          </h2>
          <select
            value={format(currentDate, "yyyy")}
            onChange={handleYearChange}
            className="text-sm font-medium bg-transparent border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
          >
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => handleMonthChange("next")}
          className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <FaChevronRight className="text-gray-600 text-sm" />
        </button>
      </div>

      {/* Календарь */}
      <div className="grid grid-cols-7 gap-1 text-center text-gray-700 text-sm">
        {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map((day) => (
          <div key={day} className="font-semibold text-gray-500">{day}</div>
        ))}
        {emptyDays.map((_, index) => (
          <div key={index}></div>
        ))}
        {daysInMonth.map((day) => (
          <div
            key={day}
            className="p-2 text-sm font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
          >
            {format(day, "d")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompactCalendar;
