import React from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { queryGQL } from "@/lib/apollo-server";
import { GET_POSTING_APPLICATIONS } from "@/lib/queries";
import { Route } from "@/constants/routes";
import ApplicationsTable from "../components/applications-table";
import AccountPageWrapper from "../../../components/account-page-wrapper";
import EarningsInfo from "../../components/earnings-info";

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
  const totalEarnings = applications.reduce(
    (acc, curr) => curr.referralEarnings + acc,
    0,
  );
  return (
    <AccountPageWrapper
      backRoute={{
        route: Route.AccountPostings,
        title: "Campaigns",
      }}
      title={`Applications for ${posting.title}`}
    >
      <ApplicationsTable
        applications={applications.filter((app) => Boolean(app.user))}
        posting={posting}
        showEarnings={Boolean(totalEarnings)}
      />
      {totalEarnings ? (
        <EarningsInfo
          title="Total earnings from this posting"
          totalEarnings={totalEarnings}
        />
      ) : null}
    </AccountPageWrapper>
  );
}
