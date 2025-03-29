import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import AccountPageWrapper from "../components/account-page-wrapper";
import { queryGQL } from "../../../lib/apollo-server";
import { GET_USER_APPLICATIONS } from "../../../lib/queries";
import { getRoute } from "../../../constants/routes";
import { getStatusColor, getStatusName } from "../campaigns/applications/utils";
import SendReview from "../campaigns/applications/components/send-review";

export default async function MyApplications() {
  const { getUserApplications, getPendingReviews, uploadURL } = await queryGQL(
    GET_USER_APPLICATIONS,
    undefined,
    await cookies(),
    0,
  );

  const applications = getUserApplications.map((app) => ({
    ...app,
    isPendingReview: getPendingReviews.includes(app.posting?.id || -1),
  }));
  return (
    <AccountPageWrapper title="Your applications">
      {applications.length === 0 && (
        <div className="flex justify-center gap-1 pt-5 text-lg text-gray-700">
          You haven't applied to any campaigns yet.
          <Link
            className="flex items-center gap-2 font-medium underline underline-offset-4"
            href={getRoute("Postings")}
          >
            Apply now <MagnifyingGlass />
          </Link>
        </div>
      )}
      <ul className="space-y-5">
        {applications.map(
          ({ posting, ...app }) =>
            posting && (
              <li
                className="flex items-center gap-3 rounded-md px-4 py-3"
                key={posting.id}
              >
                <Image
                  alt={posting.agency.name || ""}
                  className="size-16 shrink-0 rounded-full object-cover sm:size-20"
                  height={80}
                  src={posting.agency.photo || ""}
                  width={80}
                />
                <div className="min-w-0 grow">
                  <div className="flex flex-wrap items-start justify-between">
                    <div>
                      <Link
                        className="hover:underline"
                        href={`${getRoute("Postings")}/${posting.id}`}
                      >
                        <h3 className="  gap-1.5  text-lg font-semibold  ">
                          {posting.title}
                        </h3>
                      </Link>
                      <div className="mt-0.5 flex items-center gap-3 text-sm  max-sm:w-full">
                        <Link
                          className="font-poppins  font-semibold text-primary hover:underline"
                          href={`${getRoute("Profile")}/${posting.agency.username}`}
                        >
                          {posting.agency.name}
                        </Link>
                      </div>
                      <p className="mt-2 flex flex-wrap items-center gap-1 truncate text-xs leading-6 text-gray-700">
                        {[
                          new Date(app.createdAt).toDateString(),
                          app.phone,
                          app.email,
                          app.comment,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.isPendingReview && uploadURL ? (
                        <SendReview
                          imageUploadURL={uploadURL}
                          posting={posting}
                        />
                      ) : (
                        <div
                          className="mt-0.5 gap-1 rounded-md px-3 py-1.5 text-sm font-medium  sm:text-end"
                          style={{
                            background: getStatusColor(app.status)[0],
                            color: getStatusColor(app.status)[1],
                          }}
                        >
                          {getStatusName(app.status)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ),
        )}
      </ul>
    </AccountPageWrapper>
  );
}
