import { and, eq, isNotNull, or } from "drizzle-orm";
import { AuthorizedContext } from "../../../../context";
import { db } from "../../../../../../lib/db";
import { PortfolioTable } from "../../db/schema";
import { deleteImage } from "../../../../../../lib/storage/aws-s3";
import { AgencyMember } from "../../../Agency/db/schema";
import GQLError from "../../../../constants/errors";

export async function deletePortfolio(ctx: AuthorizedContext, id: number) {
  const [portfolio] = await db
    .select()
    .from(PortfolioTable)
    .where(eq(PortfolioTable.id, id))
    .leftJoin(
      AgencyMember,
      and(
        eq(AgencyMember.agency, PortfolioTable.agency),
        eq(AgencyMember.user, ctx.userId),
      ),
    );
  if (!portfolio) throw GQLError(404, "No portfolio found.");
  if (portfolio.portfolio.agency && !portfolio.agency_member)
    throw GQLError(403, "You dont have permission for this agency");
  const [deleted] = await db
    .delete(PortfolioTable)
    .where(
      and(
        eq(PortfolioTable.id, id),
        or(
          eq(PortfolioTable.user, ctx.userId),
          isNotNull(PortfolioTable.agency),
        ),
      ),
    )
    .returning();
  if (!deleted) return false;
  if (deleted.imageURL) await deleteImage(deleted.imageURL);
  return true;
}
