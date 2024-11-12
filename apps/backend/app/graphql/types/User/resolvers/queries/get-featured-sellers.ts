import { and, or, eq, isNotNull, getTableColumns, desc } from "drizzle-orm";
import { db } from "../../../../../../lib/db";
import { UserTable } from "../../db/schema";
import { InstagramDetails } from "../../../Instagram/db/schema";

export async function handleGetFeaturedSellers() {
  return db
    .select(getTableColumns(UserTable))
    .from(UserTable)
    .where(
      and(
        or(eq(UserTable.isOnboarded, true), eq(UserTable.isSpirit, true)),
        isNotNull(UserTable.photo),
        isNotNull(UserTable.instagramDetails),
        isNotNull(UserTable.name),
      ),
    )
    .innerJoin(
      InstagramDetails,
      eq(InstagramDetails.id, UserTable.instagramDetails),
    )
    .orderBy(desc(InstagramDetails.followers))
    .limit(8);
}
