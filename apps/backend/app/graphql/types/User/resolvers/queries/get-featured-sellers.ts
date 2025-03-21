import {
  and,
  arrayContains,
  desc,
  eq,
  getTableColumns,
  inArray,
  isNotNull,
  or,
} from "drizzle-orm";
import { db } from "../../../../../../lib/db";
import { UserTable } from "../../db/schema";
import { InstagramDetails } from "../../../Instagram/db/schema";
import { Roles } from "../../../../constants/roles";

export async function handleGetFeaturedSellers() {
  return db
    .select(getTableColumns(UserTable))
    .from(UserTable)
    .where(
      and(
        eq(UserTable.isOnboarded, true),
        isNotNull(UserTable.photo),
        isNotNull(UserTable.bio),
        isNotNull(UserTable.instagramDetails),
        isNotNull(UserTable.name),
        inArray(
          UserTable.id,
          [
            372, 541, 458, 361, 556, 422, 408, 469, 450, 148, 748, 646, 747,
            760, 761, 750, 534,
          ],
        ),
      ),
    )
    .innerJoin(
      InstagramDetails,
      and(
        eq(InstagramDetails.id, UserTable.instagramDetails),
        or(
          isNotNull(InstagramDetails.accessToken),
          arrayContains(UserTable.roles, [Roles.ManuallyVerified]),
        ),
      ),
    )
    .orderBy(desc(InstagramDetails.followers))
    .limit(9);
}
