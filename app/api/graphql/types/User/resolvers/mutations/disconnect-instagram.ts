import { db } from "@backend/lib/db";
import type { AuthorizedContext } from "@graphql/context";
import { eq } from "drizzle-orm";

import GQLError from "../../../../constants/errors";
import { InstagramDetails } from "../../../Instagram/db/schema";
import { UserTable } from "../../db/schema";
import { getCurrentUser } from "../../utils";

export async function handleDisconnectInstagram(ctx: AuthorizedContext) {
  const user = await getCurrentUser(ctx);
  if (!user) throw GQLError(403);
  if (user.instagramDetails) {
    await db
      .update(UserTable)
      .set({
        instagramDetails: null,
      })
      .where(eq(UserTable.id, ctx.userId));
    if (user.instagramDetails)
      await db
        .delete(InstagramDetails)
        .where(eq(InstagramDetails.id, user.instagramDetails));
  }
  return true;
}
