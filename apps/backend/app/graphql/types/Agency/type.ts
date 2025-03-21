import { Field, Int, ObjectType } from "type-graphql";
import { AgencyMemberType } from "../../constants/agency-member-type";
import { AgencyCategory } from "../../constants/agency-category";

@ObjectType("Agency")
export class AgencyGQL {
  @Field()
  id: number;
  @Field()
  photo: string;
  @Field()
  name: string;
  @Field()
  username: string;
  @Field()
  contactEmail: string;
  @Field(() => String, { nullable: true })
  contactPhone?: string | null;
  @Field(() => AgencyCategory)
  category: AgencyCategory;
  @Field()
  bio: string;
}
@ObjectType("AgencyMember")
export class AgencyMemberGQL {
  @Field(() => AgencyMemberType)
  type: AgencyMemberType;
  @Field(() => Int)
  agency: number;
}

@ObjectType("AgencyOnboarding")
export class AgencyOnboardingGQL {
  @Field(() => String, { nullable: true })
  photo: string | null;
  @Field()
  name: string;
  @Field(() => String, { nullable: true })
  contactEmail: string | null;
  @Field(() => String, { nullable: true })
  contactPhone: string | null;
  @Field()
  bio: string;
  @Field(() => String, { nullable: true })
  username: string | null;
  @Field(() => AgencyCategory, { nullable: true })
  category: AgencyCategory | null;
}
