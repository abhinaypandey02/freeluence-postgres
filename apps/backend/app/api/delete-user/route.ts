import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../../../lib/db";
import {
  LocationTable,
  PricingTable,
  UserTable,
} from "../../graphql/types/User/db/schema";
import { deleteImage } from "../../../lib/storage/aws-s3";
import { InstagramDetails } from "../../graphql/types/Instagram/db/schema";
import { ApplicationTable } from "../../graphql/types/Application/db/schema";
import { InstagramMediaTable } from "../../graphql/types/Instagram/db/schema2";
import { RequestTable } from "../../graphql/types/Request/db/schema";
import { PortfolioTable } from "../../graphql/types/Portfolio/db/schema";
import { ReviewTable } from "../../graphql/types/Review/db/schema";

export const POST = async (req: NextRequest) => {
  const id = ((await req.json()) as { id: number }).id;
  await db.delete(InstagramMediaTable).where(eq(InstagramMediaTable.user, id));
  await db.delete(ReviewTable).where(eq(ReviewTable.user, id));
  await db.delete(PortfolioTable).where(eq(PortfolioTable.user, id));
  await db.delete(ApplicationTable).where(eq(ApplicationTable.user, id));
  await db.delete(RequestTable).where(eq(RequestTable.user, id));
  const [user] = await db
    .delete(UserTable)
    .where(eq(UserTable.id, id))
    .returning();
  if (!user) return new NextResponse(null, { status: 404 });
  if (user.instagramDetails)
    await db
      .delete(InstagramDetails)
      .where(eq(InstagramDetails.id, user.instagramDetails));
  if (user.location)
    await db.delete(LocationTable).where(eq(LocationTable.id, user.location));
  if (user.pricing)
    await db.delete(PricingTable).where(eq(PricingTable.id, user.pricing));
  if (user.photo) await deleteImage(user.photo);
  return new NextResponse(null, { status: 200 });
};
