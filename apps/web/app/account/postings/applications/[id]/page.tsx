import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AccountPageWrapper from "../../../components/account-page-wrapper";
import { queryGQL } from "../../../../../lib/apollo-server";
import { GET_POSTING_APPLICATIONS } from "../../../../../lib/queries";
import ApplicationsTable from "../components/applications-table";
import { Route } from "../../../../../constants/routes";

export default async function AccountPostingApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericID = parseInt(id);
  const { applications, posting } = await queryGQL(
    GET_POSTING_APPLICATIONS,
    {
      postingID: numericID,
    },
    await cookies(),
    0,
  );
  if (!posting) return notFound();
  return (
    <AccountPageWrapper
      backRoute={{
        route: Route.AccountPostings,
        title: "Postings",
      }}
      title={`Applications for ${posting.title}`}
    >
      <ApplicationsTable applications={applications} posting={posting} />
    </AccountPageWrapper>
  );
}
