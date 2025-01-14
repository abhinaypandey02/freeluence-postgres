// import { NextRequest, NextResponse } from "next/server";
// import { eq } from "drizzle-orm";
// import { db } from "../../../lib/db";
// import {
//   InstagramMediaTable,
//   LocationTable,
//   PricingTable,
//   UserTable,
// } from "../../graphql/types/User/db/schema";
// import { deleteImage } from "../../../lib/storage/aws-s3";
// import { InstagramDetails } from "../../graphql/types/Instagram/db/schema";
//
// export const POST = async (req: NextRequest) => {
//   const id = ((await req.json()) as { id: number }).id;
//   const posts = await db
//     .delete(InstagramMediaTable)
//     .where(eq(InstagramMediaTable.user, id))
//     .returning();
//   for (const post of posts) {
//     // eslint-disable-next-line no-await-in-loop -- needed
//     await deleteImage(post.thumbnail);
//     // eslint-disable-next-line no-await-in-loop -- needed
//     if (post.mediaURL) await deleteImage(post.mediaURL);
//   }
//   const [user] = await db
//     .delete(UserTable)
//     .where(eq(UserTable.id, id))
//     .returning();
//   if (!user) return new NextResponse(null, { status: 404 });
//   if (user.instagramDetails)
//     await db
//       .delete(InstagramDetails)
//       .where(eq(InstagramDetails.id, user.instagramDetails));
//   if (user.location)
//     await db.delete(LocationTable).where(eq(LocationTable.id, user.location));
//   if (user.pricing)
//     await db.delete(PricingTable).where(eq(PricingTable.id, user.pricing));
//   if (user.photo) await deleteImage(user.photo);
//   return new NextResponse(null, { status: 200 });
// };
