import { eq, getTableColumns, or } from "drizzle-orm";
import type { AuthorizedContext } from "@graphql/context";
import { db } from "@backend/lib/db";
import { ConversationTable } from "../../db/schema";
import type { ConversationGQL } from "../../type";

export async function handleGetChats(
  ctx: AuthorizedContext,
): Promise<ConversationGQL[]> {
  return db
    .select(getTableColumns(ConversationTable))
    .from(ConversationTable)
    .where(
      or(
        eq(ConversationTable.agency, ctx.userId),
        eq(ConversationTable.user, ctx.userId),
      ),
    );
}
