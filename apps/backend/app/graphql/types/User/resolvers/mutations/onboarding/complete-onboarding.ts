import { and, arrayContains, eq, isNotNull } from "drizzle-orm";
import { Context } from "../../../../../context";
import { db } from "../../../../../../../lib/db";
import { OnboardingDataTable, UserTable } from "../../../db/schema";
import GQLError from "../../../../../constants/errors";
import { AuthScopes } from "../../../../../constants/scopes";
import { Roles } from "../../../../../constants/roles";

export async function handleCompleteOnboarding(ctx: Context) {
  await db.transaction(async (tx) => {
    if (!ctx.userId) return false;
    const [res] = await db
      .select({
        onboardingData: {
          name: OnboardingDataTable.name,
          photo: OnboardingDataTable.photo,
        },
        user: {
          roles: UserTable.roles,
          onboardingDataId: OnboardingDataTable.id,
        },
      })
      .from(UserTable)
      .where(
        and(
          eq(UserTable.id, ctx.userId),
          isNotNull(UserTable.onboardingData),
          eq(UserTable.isOnboarded, false),
          arrayContains(UserTable.scopes, [AuthScopes.INSTAGRAM]),
        ),
      )
      .leftJoin(
        OnboardingDataTable,
        eq(UserTable.onboardingData, OnboardingDataTable.id),
      );
    if (!res?.onboardingData || !res.user.onboardingDataId)
      throw GQLError(400, "Already onboarded or onboarding not started");
    const [updateResult] = await tx
      .update(UserTable)
      .set({
        ...res.onboardingData,
        onboardingData: null,
        roles: [...res.user.roles, Roles.SELLER],
        isOnboarded: true,
      })
      .where(eq(UserTable.id, ctx.userId))
      .returning({ isOnboarded: UserTable.isOnboarded });
    if (!updateResult?.isOnboarded) {
      tx.rollback();
      return;
    }
    await tx
      .delete(OnboardingDataTable)
      .where(eq(OnboardingDataTable.id, res.user.onboardingDataId));
  });
  return true;
}
