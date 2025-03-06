import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "ui/button";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Injector, queryGQL } from "../../../lib/apollo-server";
import { GET_USER_POSTINGS } from "../../../lib/queries";
import { Route } from "../../../constants/routes";
import AccountPageWrapper from "../components/account-page-wrapper";
import PostingsTable from "./components/postings-table";

export default function PostingsPage() {
  return (
    <AccountPageWrapper
      cta={
        <Link href={Route.AccountPostingsNew}>
          <Button className="flex items-center gap-1 !text-sm max-lg:size-9 max-lg:rounded-full max-lg:!p-0">
            <Plus weight="bold" />{" "}
            <span className="max-lg:hidden">Create new</span>
          </Button>
        </Link>
      }
      title="Your postings"
    >
      <Injector
        Component={PostingsTable}
        fetch={async () => {
          const { postings, user } = await queryGQL(
            GET_USER_POSTINGS,
            undefined,
            await cookies(),
            0,
          );
          return { postings, user };
        }}
      />
    </AccountPageWrapper>
  );
}
