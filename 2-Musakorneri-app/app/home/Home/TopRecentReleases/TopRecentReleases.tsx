import { selectRecentReleasedAlbums } from "@/app/store/albums/selectors/albums.selectors";
import { useSelector } from "react-redux";
import { ReleaseItem } from "./ReleaseItem/ReleaseItem";

export const TopRecentReleases = () => {
  const recentReleases = useSelector(selectRecentReleasedAlbums);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4 hidden lg:block">
        Top Recent Releases
      </h2>
      {recentReleases.length > 0 ? (
        <div className="space-y-4">
          {recentReleases.map((release) => (
            <ReleaseItem key={release.id} album={release} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent releases available.</p>
      )}
    </section>
  );
};
