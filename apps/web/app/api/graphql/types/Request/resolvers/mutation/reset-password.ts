import { and, eq } from "drizzle-orm";
import { verify } from "jsonwebtoken";
import { hash } from "bcrypt";
import { db } from "../../../../../../../lib/db";
import { UserTable } from "../../../User/db/schema";
import { RequestTable, RequestType } from "../../db/schema";
import GQLError from "../../../../constants/errors";

export async function handleResetPassword(token: string, newPassword: string) {
  const data = verify(token, process.env.SIGNING_KEY || "") as {
    id: number;
  } | null;
  if (!data?.id) throw GQLError(400, "Invalid token, please request again");
  const [res] = await db
    .select()
    .from(RequestTable)
    .where(
      and(
        eq(RequestTable.id, data.id),
        eq(RequestTable.type, RequestType.ResetPassword),
      ),
    )
    .innerJoin(UserTable, eq(UserTable.id, RequestTable.user));
  if (!res) throw GQLError(400, "Invalid token data, please request again");
  if (new Date().getTime() - res.request.createdAt.getTime() > 3600000)
    throw GQLError(400, "Link expired, please request again");
  await db
    .update(UserTable)
    .set({ password: await hash(newPassword, 10), emailVerified: true })
    .where(eq(UserTable.id, res.user.id));
  await db.delete(RequestTable).where(eq(RequestTable.id, data.id));
  return true;
}
