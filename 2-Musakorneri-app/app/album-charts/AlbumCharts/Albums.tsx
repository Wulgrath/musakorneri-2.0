import { AlbumsList } from "./AlbumsList/AlbumsList";
import { ChartFilters } from "./ChartFilters/ChartFilters";

export const AlbumCharts = () => {
  return (
    <div className="pt-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Album Charts</h1>
      <ChartFilters></ChartFilters>
      <AlbumsList></AlbumsList>
    </div>
  );
};
