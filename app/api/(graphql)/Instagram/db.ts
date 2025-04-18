import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const InstagramDetails = pgTable(
  "instagram_data",
  {
    id: serial("id").primaryKey(),
    username: text("username").unique().notNull(),
    followers: integer("followers").notNull(),
    mediaCount: integer("media_count").notNull().default(0),
    accessToken: text("access_token"),
    averageLikes: integer("average_likes"),
    averageComments: integer("average_comments"),
    failedTries: integer("failed_tries").default(0).notNull(),
    er: real("er"),
    accessTokenUpdatedAt: timestamp("access_token_updated_at")
      .notNull()
      .defaultNow(),
    lastFetchedInstagramStats: timestamp(
      "last_fetched_instagram_stats",
    ).defaultNow(),
    lastFetchedInstagramMedia: timestamp(
      "last_fetched_instagram_media",
    ).defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
  },
  (table) => ({
    instagramSearchIndex: index("insta_username_search_index").using(
      "gin",
      sql`${table.username} gin_trgm_ops`,
    ),
    followersIdx: index("followers_idx").on(table.followers),
  }),
);
