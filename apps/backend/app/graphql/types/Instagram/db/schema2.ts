import {
  date,
  index,
  integer,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { AgencyTable } from "../../Agency/db/schema";
import { mediaType, UserTable } from "../../User/db/schema";

export const InstagramMediaTable = pgTable(
  "instagram_post",
  {
    id: serial("id").primaryKey(),
    appID: text("app_id").unique(),
    thumbnail: text("thumbnail").notNull(),
    mediaURL: text("media_url"),
    link: text("url").notNull(),
    caption: text("caption"),
    type: mediaType("type").notNull(),
    comments: integer("comments").notNull(),
    likes: integer("likes").notNull(),
    timestamp: date("timestamp"),
    er: real("er"),
    user: integer("user").references(() => UserTable.id),
    agency: integer("agency").references(() => AgencyTable.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("post_user_idx").on(table.user),
  }),
);
