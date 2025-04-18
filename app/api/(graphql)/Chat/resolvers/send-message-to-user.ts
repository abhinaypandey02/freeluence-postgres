import {
  getConversationChannelName,
  NEW_MESSAGE,
} from "@backend/(rest)/pusher/utils";
import type { AuthorizedContext } from "@backend/lib/auth/context";
import GQLError from "@backend/lib/constants/errors";
import { db } from "@backend/lib/db";
import { sendEvent } from "@backend/lib/socket/send-event";
import { and, eq } from "drizzle-orm";

import { ConversationMessageTable, ConversationTable } from "../db";

export async function handleSendMessageToUser(
  ctx: AuthorizedContext,
  body: string,
  userID: number,
): Promise<boolean> {
  if (ctx.userId === userID) throw GQLError(400, "You cannot message yourself");
  const [conversation] = await db
    .update(ConversationTable)
    .set({
      hasRead: false,
    })
    .where(
      and(
        eq(ConversationTable.user, userID),
        eq(ConversationTable.agency, ctx.userId),
      ),
    )
    .returning({ id: ConversationTable.id });
  let conversationID = conversation?.id;
  if (!conversationID) {
    const [newConversation] = await db
      .insert(ConversationTable)
      .values({
        agency: ctx.userId,
        user: userID,
      })
      .returning();
    conversationID = newConversation?.id;
  }
  if (conversationID) {
    const message = {
      conversation: conversationID,
      body,
      byAgency: true,
    };
    await db.insert(ConversationMessageTable).values(message);
    void sendEvent(
      getConversationChannelName(conversationID),
      NEW_MESSAGE,
      message,
    );
    return true;
  }
  return false;
}
