import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { CountryTable } from "../../Map/db/schema";
import { PostingPlatforms } from "../../../constants/platforms";
import { AgencyTable } from "../../Agency/db/schema";

export const platforms = pgEnum("platform", [
  PostingPlatforms.INSTAGRAM,
  PostingPlatforms.YOUTUBE,
]);

export const PostingTable = pgTable("posting", {
  id: serial("id").primaryKey(),
  agency: integer("agency")
    .references(() => AgencyTable.id)
    .notNull(),
  title: text("title").notNull(),
  platforms: platforms("platforms").array().notNull().default([]),
  deliverables: text("deliverables").array(),
  externalLink: text("external_link").unique(),
  extraDetails: text("extra_details"),
  description: text("description").notNull(),
  currencyCountry: integer("currency_country").references(
    () => CountryTable.id,
  ),
  price: integer("price"),
  barter: boolean("barter").default(false).notNull(),
  minimumFollowers: integer("minimum_followers").default(0),
  minimumAge: integer("minimum_age").default(0),
  maximumAge: integer("maximum_age").default(1000),
  open: boolean("open").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PostingDB = typeof PostingTable.$inferSelect;
