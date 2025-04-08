import { Plus } from "@phosphor-icons/react/dist/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/button";
import { Route } from "@/constants/routes";
import { queryGQL } from "@/lib/apollo-server";
import { GET_USER_POSTINGS } from "@/lib/queries";

import AccountPageWrapper from "../components/account-page-wrapper";
import EarningsInfo from "./components/earnings-info";
import PostingsTable from "./components/postings-table";

export default async function PostingsPage() {
  const { postings } = await queryGQL(
    GET_USER_POSTINGS,
    undefined,
    await cookies(),
    0,
  );
  const totalEarnings = postings.reduce(
    (acc, curr) => curr.referralEarnings + acc,
    0,
  );
  return (
    <AccountPageWrapper
      cta={
        <Link href={Route.AccountPostingsNew}>
          <Button className="flex items-center gap-1 text-sm! max-lg:size-9 max-lg:rounded-full max-lg:p-0!">
            <Plus weight="bold" />{" "}
            <span className="max-lg:hidden">Create new</span>
          </Button>
        </Link>
      }
      title="Your postings"
    >
      <PostingsTable
        postings={postings}
        showEarnings={Boolean(totalEarnings)}
      />
      {totalEarnings ? (
        <EarningsInfo title="Total earnings" totalEarnings={totalEarnings} />
      ) : null}
    </AccountPageWrapper>
  );
}
