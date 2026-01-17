import { Context } from "koa";
import { dynamodbScanArtists } from "../../services/dynamodb/artists/dynamodb-scan-artists.service";

export const getArtistsBaseData = async (ctx: Context): Promise<void> => {
  const artists = await dynamodbScanArtists();

  ctx.body = artists;
};
