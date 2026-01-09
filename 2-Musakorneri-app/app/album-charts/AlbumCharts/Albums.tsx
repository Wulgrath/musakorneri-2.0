import { AlbumsList } from "./AlbumsList/AlbumsList";
import { ChartFilters } from "./ChartFilters/ChartFilters";

export const AlbumCharts = () => {
  return (
    <div>
      <ChartFilters></ChartFilters>
      <AlbumsList></AlbumsList>
    </div>
  );
};
