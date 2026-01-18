import { Context } from "koa";
import { dynamodbGetAlbumById } from "../../services/dynamodb/albums/dynamodb-get-album-by-id.service";
import { AotyItem } from "../../types";
import { dynamodbPutAotyItem } from "../../services/dynamodb/aoty-items/dynamodb-put-aoty-item.service";

export const setAlbumAsAoty = async (ctx: Context): Promise<void> => {
  const { userId } = ctx.state;

  const { albumId } = ctx.request.body;

  const albumToSetAsAoty = await dynamodbGetAlbumById(albumId);

  if (!albumToSetAsAoty.year) {
    ctx.throw(409, "Conflict setting as aoty, album year not set");
  }

  const createdAt = new Date().toISOString();

  const aotyItem: AotyItem = {
    userId,
    year: albumToSetAsAoty.year,
    albumId: albumToSetAsAoty.id,
    artistId: albumToSetAsAoty.artistId,
    createdAt,
  };

  await dynamodbPutAotyItem(aotyItem);

  ctx.body = aotyItem;
};
