import React from "react";
import { cookies } from "next/headers";
import AccountPageWrapper from "../components/account-page-wrapper";
import { Injector, queryGQL } from "../../../lib/apollo-server";
import { GET_USER_APPLICATIONS } from "../../../lib/queries";
import AplicationTable from "./component/application-table";

export default function MyApplications() {
  return (
    <AccountPageWrapper title="Your applications">
      <Injector
        Component={AplicationTable}
        fetch={async () => {
          const { getUserApplications, getPendingReviews, uploadURL } =
            await queryGQL(
              GET_USER_APPLICATIONS,
              undefined,
              await cookies(),
              0,
            );
          const applications = getUserApplications.map((app) => ({
            ...app,
            isPendingReview: getPendingReviews.includes(app.posting?.id || -1),
          }));
          return {
            applications,
            uploadURL,
            getPendingReviews,
            getUserApplications,
          };
        }}
      />
    </AccountPageWrapper>
  );
}
