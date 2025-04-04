import { and, eq } from "drizzle-orm";
import { db } from "@backend/lib/db";
import type { AuthorizedContext } from "@graphql/context";
import { ApplicationTable } from "../../db/schema";

export async function getHasUserApplied(
  ctx: AuthorizedContext,
  postingID: number,
) {
  if (!ctx.userId) return false;
  const data = await db
    .select()
    .from(ApplicationTable)
    .where(
      and(
        eq(ApplicationTable.user, ctx.userId),
        eq(ApplicationTable.posting, postingID),
      ),
    );
  return data.length > 0;
}
