import { Context } from "koa";
import { uniq } from "lodash";
import { dynamodbQueryAlbumsByYear } from "../../services/dynamodb/albums/dynamodb-query-albums-by-year.service";
import { dynamodbScanAlbums } from "../../services/dynamodb/albums/dynamodb-scan-albums.service";
import { dynamodbBatchGetArtistsByIds } from "../../services/dynamodb/artists/dynamodb-batch-get-artists-by-ids.service";
import { Album } from "../../types";

export const getAlbumChartAlbumsData = async (ctx: Context): Promise<void> => {
  const { year } = ctx.params;

  let albums: Album[] = [];

  if (year === "all_time") {
    albums = await dynamodbScanAlbums();
  } else {
    albums = await dynamodbQueryAlbumsByYear(year);
  }

  const artistIdsOfAlbums = uniq(albums.map((album) => album.artistId));

  const artists = await dynamodbBatchGetArtistsByIds(artistIdsOfAlbums);

  ctx.body = {
    albums,
    artists,
  };
};
