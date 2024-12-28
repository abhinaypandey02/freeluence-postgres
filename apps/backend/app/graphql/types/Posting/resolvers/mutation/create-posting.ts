import { Field, InputType, Int } from "type-graphql";
import { IsEnum } from "class-validator";
import { db } from "../../../../../../lib/db";
import { PostingTable } from "../../db/schema";
import { AuthorizedContext } from "../../../../context";
import { PostingPlatforms } from "../../../../constants/platforms";

@InputType("NewPostingInput")
export class NewPostingInput {
  @Field()
  title: string;
  @Field()
  description: string;
  @Field(() => [String], { nullable: true })
  deliverables: string[] | null;
  @Field(() => String, { nullable: true })
  externalLink: string | null;
  @Field(() => Int, { nullable: true })
  price: number | null;
  @Field()
  barter: boolean;
  @Field(() => [PostingPlatforms])
  @IsEnum(PostingPlatforms, { each: true })
  platforms: PostingPlatforms[];
  @Field({ nullable: true })
  minimumAge: number;
  @Field({ nullable: true })
  maximumAge: number;
  @Field({ nullable: true })
  minimumFollowers: number;
  @Field(() => Int, { nullable: true })
  currencyCountry: number | null;
}
export async function createPosting(
  ctx: AuthorizedContext,
  newPosting: NewPostingInput,
): Promise<number | null> {
  const [posting] = await db
    .insert(PostingTable)
    .values({ ...newPosting, user: ctx.userId })
    .returning({ id: PostingTable.id });
  return posting?.id || null;
}
