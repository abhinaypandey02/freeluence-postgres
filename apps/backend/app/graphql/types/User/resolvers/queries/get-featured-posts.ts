import { and, eq, isNotNull, desc } from "drizzle-orm";
import { Field, ObjectType } from "type-graphql";
import { db } from "../../../../../../lib/db";
import { InstagramMediaTable, UserTable } from "../../db/schema";
import { InstagramMediaType } from "../../../../constants/instagram-media-type";

@ObjectType()
export class GetFeaturedPostsResponse {
  @Field()
  mediaURL: string;
  @Field()
  postURL: string;
  @Field()
  thumbnailURL: string;
  @Field()
  likes: number;
  @Field()
  er: number;
  @Field()
  creatorName: string;
  @Field()
  creatorUsername: string;
  @Field()
  creatorImage?: string;
}

export async function handleGetFeaturedPosts(): Promise<
  GetFeaturedPostsResponse[]
> {
  const data = await db
    .select()
    .from(
      db
        .selectDistinctOn([InstagramMediaTable.user])
        .from(InstagramMediaTable)
        .where(
          and(
            eq(InstagramMediaTable.type, InstagramMediaType.Video),
            isNotNull(InstagramMediaTable.mediaURL),
          ),
        )
        .orderBy(
          desc(InstagramMediaTable.user),
          desc(InstagramMediaTable.likes),
        )
        .as("instagram_post"),
    )
    .innerJoin(
      UserTable,
      and(
        isNotNull(UserTable.photo),
        eq(UserTable.isOnboarded, true),
        isNotNull(UserTable.name),
        isNotNull(UserTable.username),
        eq(InstagramMediaTable.user, UserTable.id),
      ),
    )
    .orderBy(desc(InstagramMediaTable.likes))
    .limit(10);
  return data.map((post) => ({
    mediaURL: post.instagram_post.mediaURL || "",
    postURL: post.instagram_post.link,
    thumbnailURL: post.instagram_post.thumbnail,
    likes: post.instagram_post.likes,
    er: post.instagram_post.er || 0,
    creatorName: post.user.name || "",
    creatorUsername: post.user.username || "",
    creatorImage: post.user.photo || "",
  }));
}
