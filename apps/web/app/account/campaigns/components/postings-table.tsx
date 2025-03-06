"use client";
import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "ui/table";
import Link from "next/link";
import { ArrowSquareOut, PencilSimple } from "@phosphor-icons/react";
import { redirect } from "next/navigation";
import type { GetUserPostingsQuery } from "../../../../__generated__/graphql";
import { getCurrency } from "../../../campaigns/utils";
import { getRoute, Route } from "../../../../constants/routes";
import FullScreenLoader from "../../components/full-screen-loader";
import EarningsInfo from "./earnings-info";

type Posting = NonNullable<GetUserPostingsQuery["postings"]>[number];

const columnHelper = createColumnHelper<Posting>();
const columns = [
  columnHelper.accessor("title", {
    header: "Title",
    cell: (val) => (
      <Link
        className="hover:underline"
        href={`${Route.Postings}/${val.row.original.id}`}
      >
        {val.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("price", {
    header: "Payment",
    cell: (val) =>
      getCurrency(
        val.row.original.barter,
        val.row.original.currency,
        val.getValue(),
      ),
  }),

  columnHelper.accessor("applicationsCount", {
    header: "Applications",
    cell: (val) => (
      <Link
        className="flex items-center gap-1"
        href={`${Route.AccountPostingsApplications}/${val.row.original.id}`}
      >
        {val.getValue()}&nbsp;
        <Link
          className="text-primary hover:underline"
          href={`${Route.AccountPostingsApplications}/${val.row.original.id}`}
        >
          View
        </Link>
      </Link>
    ),
  }),
  columnHelper.accessor("open", {
    header: "Status",
    cell: (val) => (val.getValue() ? "Open" : "Paused"),
  }),
  columnHelper.accessor("id", {
    header: "Actions",
    cell: (val) => (
      <div className="flex gap-2">
        <Link
          className="text-accent"
          href={`${Route.AccountPostingsEdit}/${val.getValue()}`}
        >
          <PencilSimple size={18} />
        </Link>
        <Link
          className="text-accent"
          href={`${Route.Postings}/${val.row.original.id}`}
        >
          <ArrowSquareOut size={18} />
        </Link>
      </div>
    ),
  }),
];

export default function PostingsTable({
  data,
  loading,
}: {
  data: GetUserPostingsQuery | undefined;
  loading: boolean;
}) {
  const postings = data?.postings || [];
  const user = data?.user;
  if (loading) return <FullScreenLoader />;
  if (!user?.agencies.length) return redirect(getRoute("AgencyOnboarding"));
  const totalEarnings = postings.reduce(
    (acc, curr) => curr.referralEarnings + acc,
    0,
  );
  return (
    <>
      <Table
        columns={[
          ...columns,
          ...(totalEarnings
            ? [
                columnHelper.accessor("referralEarnings", {
                  header: "Earnings",
                }),
              ]
            : []),
        ]}
        data={postings}
      />
      {totalEarnings ? (
        <EarningsInfo title="Total Earnings" totalEarnings={totalEarnings} />
      ) : null}
    </>
  );
}
