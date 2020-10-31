import yts from "yt-search";
import logger from "../config/winston";
import { ISong } from "../types/music.types";

export async function searchVideo(query: string): Promise<ISong | undefined> {
  try {
    const result = await yts(query)
    if (!result.videos) return;
    const video = result.videos[0];
    return {
      title: video.title,
      url: video.url,
    }
  } catch (error) {
    logger.error(error);
    return;
  }
}