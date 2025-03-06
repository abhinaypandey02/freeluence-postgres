import React from "react";
import { cookies } from "next/headers";
import { Injector, queryGQL } from "../../../lib/apollo-server";
import { GET_AGENCY_ACCOUNT_DETAILS } from "../../../lib/queries";
import { getSEO } from "../../../constants/seo";
import AgencyView from "./components/agency-view";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ agency?: string; section?: string }>;
}) {
  const params = await searchParams;
  const selectedAgencyUsername = params.agency;
  const paramSection = parseInt(params.section || "0");
  return (
    <Injector
      Component={AgencyView}
      fetch={async () => {
        const { getCurrentUserAgency } = await queryGQL(
          GET_AGENCY_ACCOUNT_DETAILS,
          { username: selectedAgencyUsername },
          await cookies(),
          0,
        );
        return getCurrentUserAgency || null;
      }}
      props={{ defaultSection: paramSection }}
    />
  );
}

export const metadata = getSEO("Manage your Agency");
