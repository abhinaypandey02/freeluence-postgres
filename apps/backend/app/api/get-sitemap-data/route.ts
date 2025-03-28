import { eq, isNotNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { PostingTable } from "../../graphql/types/Posting/db/schema";
import { UserTable } from "../../graphql/types/User/db/schema";

export const GET = async () => {
  const campaigns = await db
    .select({ id: PostingTable.id, agency: PostingTable.agency })
    .from(PostingTable)
    .where(eq(PostingTable.open, true));
  const users = await db
    .select({ id: UserTable.username })
    .from(UserTable)
    .where(isNotNull(UserTable.instagramDetails));
  return new NextResponse(
    JSON.stringify({
      campaigns: campaigns.map(({ id }) => id),
      users: users.map(({ id }) => id),
    }),
  );
};
