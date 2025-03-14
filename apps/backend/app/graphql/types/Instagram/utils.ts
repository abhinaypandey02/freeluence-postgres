import { eq } from "drizzle-orm";
import { UserDB } from "../User/db/schema";
import { AgencyDB } from "../Agency/db/schema";
import { db } from "../../../../lib/db";
import { uploadImage } from "../../../../lib/storage/aws-s3";
import { median, normaliseDigits } from "../../utils/math";
import { InstagramDetails } from "./db/schema";
import {
  FetchedInstagramPost,
  fetchInstagramClanConnectMedia,
  fetchInstagramClanConnectStats,
  fetchInstagramGraphMedia,
  fetchInstagramGraphStats,
  fetchInstagramRapidMedia,
  fetchInstagramRapidStats,
  SafeFetchedInstagramPost,
} from "./fetch-utils";

export async function fetchStats(
  user: UserDB | AgencyDB,
  failedTries: number,
  accessToken?: string | null,
  username?: string,
) {
  if (accessToken) {
    const graphStats = await fetchInstagramGraphStats(accessToken);
    if (graphStats?.username) return graphStats;
    if (user.instagramDetails) {
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
    const clanConnectStats = await fetchInstagramClanConnectStats(username);
    if (clanConnectStats) return clanConnectStats;
    const rapidStats = await fetchInstagramRapidStats(username);
    if (rapidStats) return rapidStats;
  }
}

async function uploadPostMedia(posts?: SafeFetchedInstagramPost[]) {
  if (!posts) return null;
  return Promise.all(
    posts.map(async (post) => ({
      ...post,
      thumbnail:
        (await uploadImage(post.thumbnail, ["posts", post.link])) ||
        post.thumbnail,
    })),
  );
}

function filterThumbnails(
  post: FetchedInstagramPost,
): post is SafeFetchedInstagramPost {
  return Boolean(post.thumbnail);
}

export async function fetchPosts(
  followers: number,
  userID: number,
  accessToken?: string | null,
  username?: string,
  isAgency?: boolean,
) {
  const extraData = isAgency ? { agency: userID } : { user: userID };
  if (accessToken) {
    const graphPosts = await fetchInstagramGraphMedia(
      accessToken,
      followers,
      extraData,
    );
    if (graphPosts) {
      return graphPosts;
    }
  }
  if (username) {
    const clanConnectMedia = await fetchInstagramClanConnectMedia(
      username,
      followers,
      extraData,
    );
    if (clanConnectMedia) return clanConnectMedia;
    const rapidMedia = await fetchInstagramRapidMedia(
      username,
      followers,
      extraData,
    );
    if (rapidMedia) return rapidMedia;
  }
  return null;
}

function getPostsStats(posts: Awaited<ReturnType<typeof fetchPosts>>) {
  if (!posts) return null;
  return {
    averageLikes: Math.round(
      median(posts.map((post) => post.likes).filter(Boolean)),
    ),
    averageComments: Math.round(
      median(posts.map((post) => post.comments).filter(Boolean)),
    ),
    er: normaliseDigits(median(posts.map((post) => post.er).filter(Boolean))),
    lastFetchedInstagramMedia: new Date(),
  };
}

export async function fetchUploadedPostsAndStats(
  followers: number,
  userID: number,
  accessToken?: string | null,
  username?: string,
  isAgency?: boolean,
) {
  const posts = await fetchPosts(
    followers,
    userID,
    accessToken,
    username,
    isAgency,
  );
  return {
    posts: await uploadPostMedia(
      posts
        ?.filter(filterThumbnails)
        .sort((a, b) => b.er - a.er)
        .slice(0, 4),
    ),
    stats: getPostsStats(posts),
  };
}
