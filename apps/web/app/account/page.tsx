import React from "react";
import { cookies } from "next/headers";
import { Injector, queryGQL } from "../../lib/apollo-server";
import { GET_ACCOUNT_DETAILS } from "../../lib/queries";
import { getSEO } from "../../constants/seo";
import AccountView from "./components/account-view";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ section: string }>;
}) {
  const paramSection = parseInt((await searchParams).section);
  return (
    <Injector
      Component={AccountView}
      fetch={async () => {
        const { user } = await queryGQL(
          GET_ACCOUNT_DETAILS,
          undefined,
          await cookies(),
          0,
        );
        return user || null;
      }}
      props={{ defaultSection: paramSection }}
    />
  );
}
export const metadata = getSEO("Manage your Account");
