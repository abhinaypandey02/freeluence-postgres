import { and, eq, isNotNull, or } from "drizzle-orm";
import { db } from "../../../../../../lib/db";
import { UserTable } from "../../db/schema";

export async function handleGetSeller(username: string) {
  const [seller] = await db
    .select()
    .from(UserTable)
    .where(
      and(
        or(isNotNull(UserTable.instagramDetails)),
        eq(UserTable.username, username),
      ),
    )
    .limit(1);
  return seller;
}
