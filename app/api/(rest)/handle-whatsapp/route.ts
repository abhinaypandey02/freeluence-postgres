import { PostingPlatforms } from "@backend/lib/constants/platforms";
import { createPosting } from "@graphql/Posting/resolvers/create-posting";
import { NextRequest, NextResponse } from "next/server";

import { getTransformedPostingData } from "@/lib/server-actions";

export const POST = async (req: NextRequest) => {
  const { body } = (await req.json()) as {
    body: string;
    from: string;
    to: string;
  };
  if (!body.includes("https://") || !body.includes("forms"))
    return new NextResponse();
  try {
    const posting = await getTransformedPostingData(body);
    if (posting) {
      const res = await createPosting(
        { userId: 134 },
        {
          ...posting,
          deliverables:
            posting.deliverables.trim() !== ""
              ? posting.deliverables.trim().split(",")
              : null,
          externalLink: posting.externalLink || null,
          extraDetails: posting.extraDetails || null,
          platforms: posting.platforms
            ? [posting.platforms.toLowerCase() as PostingPlatforms]
            : [PostingPlatforms.INSTAGRAM],
        },
      );
      if (res) {
        return new NextResponse(
          "Created new posting. https://sociocube.com/campaigns/" + res,
          { status: 200 },
        );
      } else {
        return new NextResponse(
          "error while creating posting. it returned null",
          { status: 500 },
        );
      }
    } else {
      return new NextResponse("GROK not working proeprly", { status: 500 });
    }
  } catch (e: unknown) {
    return new NextResponse((e as Error).message, { status: 500 });
  }
};
