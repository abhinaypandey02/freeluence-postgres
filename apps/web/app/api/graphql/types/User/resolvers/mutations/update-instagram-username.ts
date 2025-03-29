import { and, eq } from "drizzle-orm";
import type { AuthorizedContext } from "../../../../context";
import { db } from "../../../../../lib/db";
import { UserTable } from "../../db/schema";
import GQLError from "../../../../constants/errors";
import { InstagramDetails } from "../../../Instagram/db/schema";
import { getCurrentUser } from "../../utils";
import { uploadImage } from "../../../../../lib/storage/aws-s3";
import { InstagramMediaTable } from "../../../Instagram/db/schema2";
import {
  fetchExternalInstagramDetails,
  fetchUploadedPostsAndStats,
} from "../../../Instagram/utils";

export async function handleUpdateInstagramUsername(
  ctx: AuthorizedContext,
  username: string,
) {
  const user = await getCurrentUser(ctx);
  if (!user) throw GQLError(403, "User not found");
  const [existingDetails] = await db
    .select()
    .from(InstagramDetails)
    .where(eq(InstagramDetails.username, username));
  if (existingDetails) {
    if (existingDetails.accessToken) {
      throw GQLError(
        500,
        "This profile is already in use. Please use your own instagram account.",
      );
    } else {
      await db
        .update(UserTable)
        .set({
          instagramDetails: existingDetails.id,
        })
        .where(and(eq(UserTable.id, ctx.userId)));
    }
  }
  const data = await fetchExternalInstagramDetails(username);
  if (!data?.username) {
    throw GQLError(
      500,
      "Unable to fetch instagram profile, check username and ensure it's a public profile. Also try other method.",
    );
  }

  const { posts, stats } = await fetchUploadedPostsAndStats(
    data.followers,
    ctx.userId,
    undefined,
    data.username,
  );
  if (posts) {
    await db.insert(InstagramMediaTable).values(posts).onConflictDoNothing();
  }
  const [details] = await db
    .insert(InstagramDetails)
    .values({
      username: data.username,
      followers: data.followers,
      mediaCount: data.mediaCount,
      ...stats,
    })
    .returning({ id: InstagramDetails.id });
  if (details) {
    await db
      .update(UserTable)
      .set({
        instagramDetails: details.id,
        photo:
          user.photo ||
          (data.photo &&
            (await uploadImage(data.photo, [
              "User",
              user.id.toString(),
              "photo",
            ]))),
        bio: user.bio || data.bio,
      })
      .where(and(eq(UserTable.id, ctx.userId)));
  }
  return true;
}
