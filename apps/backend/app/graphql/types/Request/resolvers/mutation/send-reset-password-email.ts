import { and, eq } from "drizzle-orm";
import { sign } from "jsonwebtoken";
import { db } from "../../../../../../lib/db";
import { UserTable } from "../../../User/db/schema";
import { RequestTable, RequestType } from "../../db/schema";
import { sendTemplateEmail } from "../../../../../../lib/email/template";

function getForgetLink(id: number) {
  const token = sign({ id }, process.env.SIGNING_KEY || "", {
    expiresIn: "1h",
  });
  return `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/reset/${token}`;
}

export async function handleSendResetPasswordEmail(userEmail: string) {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, userEmail));
  if (!user) return null;
  const [res] = await db
    .select()
    .from(RequestTable)
    .where(
      and(
        eq(RequestTable.user, user.id),
        eq(RequestTable.type, RequestType.ResetPassword),
      ),
    );
  if (res) {
    if (res.attempts >= 2) return null;
    if (new Date().getTime() - res.createdAt.getTime() < 3600000) {
      await sendTemplateEmail(userEmail, "VerifyEmail", {
        email: userEmail,
        link: getForgetLink(res.id),
      });
      await db.update(RequestTable).set({ attempts: res.attempts + 1 });
      return null;
    }
    await db.delete(RequestTable).where(eq(RequestTable.id, res.id));
  }
  const [inserted] = await db
    .insert(RequestTable)
    .values({ user: user.id, type: RequestType.ResetPassword })
    .returning();
  if (!inserted) return null;
  await sendTemplateEmail(userEmail, "VerifyEmail", {
    email: userEmail,
    link: getForgetLink(inserted.id),
  });
  return null;
}
