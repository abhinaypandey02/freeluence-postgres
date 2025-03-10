import { desc, eq } from "drizzle-orm";
import { UserDB } from "../../db/schema";
import { db } from "../../../../../../lib/db";
import { InstagramDetails } from "../../../Instagram/db/schema";
import {
  getGraphUrl,
  getInstagramDataExternalAPI,
  getInstagramMediaExternalAPI,
} from "../../../../../auth/instagram/utils";
import { InstagramMediaType } from "../../../../constants/instagram-media-type";
import { Roles } from "../../../../constants/roles";
import { AgencyDB } from "../../../Agency/db/schema";
import { InstagramMediaTable } from "../../../Instagram/db/schema2";

export function normaliseDigits(val: number) {
  return Math.round(val * 10) / 10;
}

export function getER(followers: number, likes: number, comments: number) {
  if (followers === 0 || likes === 0) return 0;
  return normaliseDigits(
    ((likes + (comments === -1 ? likes / 40 : comments) * 2) / followers) * 100,
  );
}
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const half = Math.floor(values.length / 2);
  const newValues = [...values].sort((a, b) => b - a);
  return newValues.length % 2
    ? newValues[half] || 0
    : ((newValues[half - 1] || 0) + (newValues[half] || 0)) / 2;
}

async function getStats(
  user: UserDB | AgencyDB,
  failedTries: number,
  accessToken?: string | null,
  username?: string,
) {
  if (accessToken) {
    const apiResult = await fetch(
      getGraphUrl("me", accessToken, [
        "followers_count",
        "media_count",
        "username",
      ]),
    ).then(
      (data) =>
        data.json() as Promise<{
          followers_count?: number;
          media_count?: number;
          username?: string;
          error?: object;
        } | null>,
    );
    if (apiResult?.username) return apiResult;
    if (!apiResult && user.instagramDetails) {
      if (failedTries >= 5) {
        await db
          .update(InstagramDetails)
          .set({ accessToken: null })
          .where(eq(InstagramDetails.id, user.instagramDetails));
      } else {
        await db
          .update(InstagramDetails)
          .set({
            failedTries: failedTries + 1,
          })
          .where(eq(InstagramDetails.id, user.instagramDetails));
      }
    }
  }
  if (username) {
    const data = await getInstagramDataExternalAPI(username);
    if (data) {
      return {
        followers_count: data.follower_count,
        media_count: data.media_count,
        username: data.username,
      };
    }
  }
}

interface InstagramPost {
  thumbnail_url: string;
  id: string;
  like_count?: number;
  comments_count: number;
  permalink: string;
  caption: string;
  media_url?: string;
  is_comment_enabled?: boolean;
  media_type?: InstagramMediaType;
  isVideo?: boolean;
  timestamp: string;
}

export async function getPosts(
  followers: number,
  userID: number,
  accessToken?: string | null,
  username?: string,
  isAgency?: boolean,
) {
  let posts: InstagramPost[] = [];
  if (accessToken) {
    const fetchReq = await fetch(
      `${getGraphUrl("me/media", accessToken, [
        "id",
        "thumbnail_url",
        "media_url",
        "like_count",
        "comments_count",
        "media_type",
        "permalink",
        "caption",
        "is_comment_enabled",
        "timestamp",
      ])}&limit=12`,
    ).then(
      (data) =>
        data.json() as Promise<{
          data?: InstagramPost[];
          error?: object;
        } | null>,
    );
    if (fetchReq?.data) posts = fetchReq.data;
  }
  if (username) {
    const data = await getInstagramMediaExternalAPI(username);
    if (data) posts = data;
  }
  const postsToUpdate = posts
    .map((media) => ({
      isVideo: media.isVideo || media.media_type === InstagramMediaType.Video,
      comments: media.comments_count || -1,
      likes: media.like_count || 0,
      link: media.permalink,
      thumbnail: media.thumbnail_url || media.media_url || "",
      mediaURL: media.media_url,
      timestamp: media.timestamp,
      type: media.media_type,
      caption: media.caption,
      appID: media.id,
      [isAgency ? "agency" : "user"]: userID,
      er: getER(followers, media.like_count || 0, media.comments_count || -1),
    }))
    .sort((a, b) => b.er - a.er);
  return {
    posts: postsToUpdate,
    stats: {
      averageLikes: Math.round(
        median(postsToUpdate.map((post) => post.likes).filter(Boolean)),
      ),
      averageComments: Math.round(
        median(postsToUpdate.map((post) => post.comments).filter(Boolean)),
      ),
      er: normaliseDigits(
        median(postsToUpdate.map((post) => post.er).filter(Boolean)),
      ),
      lastFetchedInstagramMedia: new Date(),
    },
  };
}

function cacheAlive(d: Date) {
  const time = (new Date().getTime() - d.getTime()) / (1000 * 60 * 60);
  return time < 16;
}

export async function getInstagramStats(user: UserDB | AgencyDB) {
  if (!user.instagramDetails) return null;
  const [instagramDetails] = await db
    .select()
    .from(InstagramDetails)
    .where(eq(InstagramDetails.id, user.instagramDetails));
  if (!instagramDetails) return null;
  if (
    instagramDetails.lastFetchedInstagramStats &&
    cacheAlive(instagramDetails.lastFetchedInstagramStats)
  ) {
    return {
      username: instagramDetails.username,
      followers: instagramDetails.followers,
      mediaCount: instagramDetails.mediaCount || 0,
      averageComments: instagramDetails.averageComments || 0,
      averageLikes: instagramDetails.averageLikes || 0,
      er: normaliseDigits(instagramDetails.er || 0),
      isVerified:
        Boolean(instagramDetails.accessToken) ||
        user.roles.includes(Roles.ManuallyVerified),
    };
  }
  const stats = await getStats(
    user,
    instagramDetails.failedTries,
    instagramDetails.accessToken,
    instagramDetails.username,
  );
  if (stats) {
    await db
      .update(InstagramDetails)
      .set({
        followers: stats.followers_count || undefined,
        username: stats.username || undefined,
        mediaCount: stats.media_count || undefined,
        failedTries: 0,
        lastFetchedInstagramStats: new Date(),
      })
      .where(eq(InstagramDetails.id, user.instagramDetails));
  }
  return {
    username: stats?.username || instagramDetails.username,
    followers: stats?.followers_count || instagramDetails.followers,
    mediaCount: stats?.media_count || instagramDetails.mediaCount || 0,
    averageComments: instagramDetails.averageComments || 0,
    averageLikes: instagramDetails.averageLikes || 0,
    er: normaliseDigits(instagramDetails.er || 0),
    isVerified:
      Boolean(instagramDetails.accessToken) ||
      user.roles.includes(Roles.ManuallyVerified),
  };
}

export async function getInstagramMedia(
  user: UserDB | AgencyDB,
  isAgency?: boolean,
) {
  if (!user.instagramDetails) return [];
  const [instagramDetails] = await db
    .select()
    .from(InstagramDetails)
    .where(eq(InstagramDetails.id, user.instagramDetails));
  if (!instagramDetails) return [];
  if (
    instagramDetails.lastFetchedInstagramMedia &&
    cacheAlive(instagramDetails.lastFetchedInstagramMedia)
  ) {
    const posts = await db
      .select()
      .from(InstagramMediaTable)
      .where(
        isAgency
          ? eq(InstagramMediaTable.agency, user.id)
          : eq(InstagramMediaTable.user, user.id),
      )
      .orderBy(desc(InstagramMediaTable.er))
      .limit(4);
    if (posts.length > 0) return posts;
  }

  const { posts, stats } = await getPosts(
    instagramDetails.followers,
    user.id,
    instagramDetails.accessToken,
    instagramDetails.username,
    isAgency,
  );
  if (posts.length === 0) return [];
  if (isAgency) {
    await db
      .delete(InstagramMediaTable)
      .where(eq(InstagramMediaTable.agency, user.id));
  } else {
    await db
      .delete(InstagramMediaTable)
      .where(eq(InstagramMediaTable.user, user.id));
  }
  await db.insert(InstagramMediaTable).values(posts).onConflictDoNothing();
  await db
    .update(InstagramDetails)
    .set(stats)
    .where(eq(InstagramDetails.id, user.instagramDetails));
  return posts.slice(0, 4);
}
