import { FieldResolver, Resolver, Root } from "type-graphql";
import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "@backend/lib/db";
import { PortfolioGQL } from "../../type";
import type { PortfolioDB } from "../../db/schema";
import type { ReviewDB } from "../../../Review/db/schema";
import { ReviewTable } from "../../../Review/db/schema";
import { ReviewGQL } from "../../../Review/type";

@Resolver(() => PortfolioGQL)
export class PortfolioFieldResolvers {
  @FieldResolver(() => ReviewGQL, { nullable: true })
  async review(
    @Root() portfolio: PortfolioDB,
  ): Promise<ReviewDB | undefined | null> {
    if (!portfolio.user || !portfolio.agency) return null;
    const [review] = await db
      .select()
      .from(ReviewTable)
      .where(
        and(
          eq(ReviewTable.portfolio, portfolio.id),
          isNotNull(ReviewTable.agencyRating),
        ),
      );
    return review;
  }
}
