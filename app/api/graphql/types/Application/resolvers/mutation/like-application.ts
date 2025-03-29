import { and, eq } from "drizzle-orm";
import type { AuthorizedContext } from "@graphql/context";
import { db } from "@backend/lib/db";
import { ApplicationStatus, ApplicationTable } from "../../db/schema";
import { PostingTable } from "../../../Posting/db/schema";
import GQLError from "../../../../constants/errors";

export async function likeApplication(ctx: AuthorizedContext, id: number) {
  const [res] = await db
    .select()
    .from(ApplicationTable)
    .where(eq(ApplicationTable.id, id))
    .innerJoin(
      PostingTable,
      and(
        eq(PostingTable.id, ApplicationTable.posting),
        eq(PostingTable.agency, ctx.userId),
      ),
    );
  if (!res) throw GQLError(404, "User does not have permission");
  if (
    res.application.status === ApplicationStatus.Completed ||
    res.application.status === ApplicationStatus.Rejected
  ) {
    throw GQLError(404, "Application completed");
  }
  if (res.application.status === ApplicationStatus.Interested) return true;
  await db
    .update(ApplicationTable)
    .set({
      status: ApplicationStatus.Interested,
    })
    .where(eq(ApplicationTable.id, id));
  return true;
}
