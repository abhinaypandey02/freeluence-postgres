import { and, eq } from "drizzle-orm";
import { db } from "../../../../../../lib/db";
import { PostingTable } from "../../db/schema";
import { AuthorizedContext } from "../../../../context";
import { checkPermission } from "../../utils";

export async function resumePosting(
  ctx: AuthorizedContext,
  postingID: number,
): Promise<boolean> {
  await checkPermission(ctx, postingID);

  await db
    .update(PostingTable)
    .set({ open: true })
    .where(and(eq(PostingTable.id, postingID)));
  return true;
}
