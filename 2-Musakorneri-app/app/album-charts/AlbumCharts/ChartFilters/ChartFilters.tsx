"use client";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedYear } from "@/app/store/albumCharts/albumChartsSlice";
import { RootState } from "@/app/store";

export const ChartFilters = () => {
  const dispatch = useDispatch();
  const selectedYear = useSelector(
    (state: RootState) => state.albumCharts.selectedYear
  );

  const handleYearChange = (year: string) => {
    dispatch(setSelectedYear(year));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Year
      </label>
      <select
        value={selectedYear}
        onChange={(e) => handleYearChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="all_time">All Time</option>
        {years.map((year) => (
          <option key={year} value={year.toString()}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
