import { db } from "@backend/lib/db";
import { and, eq, isNotNull } from "drizzle-orm";

import { UserTable } from "../db";

export async function handleGetSeller(username: string) {
  const [seller] = await db
    .select()
    .from(UserTable)
    .where(
      and(
        isNotNull(UserTable.instagramDetails),
        eq(UserTable.username, username),
      ),
    )
    .limit(1);
  return seller;
}
