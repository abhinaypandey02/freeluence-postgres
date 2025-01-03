import {
  ArrowRight,
  ArrowSquareOut,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import type { GetFeaturedSellersQuery } from "../../__generated__/graphql";
import { getRoute } from "../../constants/routes";
import { convertToAbbreviation } from "../../lib/utils";
import { getAgeGroup, getCurrency } from "../postings/utils";
import SectionWrapper from "./section-wrapper";

export default function JobPostings({
  postings,
}: {
  postings: GetFeaturedSellersQuery["postings"];
}) {
  return (
    <SectionWrapper
      description="Discover gigs and freelance jobs tailored for influencers. Apply now and start collaborating with top brands today!"
      headerElements={
        <Link
          className="z-10 flex items-center gap-2 pt-2 text-lg font-medium text-accent max-md:hidden"
          href={getRoute("Postings")}
        >
          See all postings
          <ArrowRight />
        </Link>
      }
      id="how-it-works"
      title="Collab Opportunities"
    >
      <ul className="mx-auto max-w-6xl divide-y divide-gray-100 ">
        {postings.map((posting) => (
          <li
            className="relative flex justify-between gap-x-6 rounded-xl px-5 py-7 transition-all duration-300 hover:bg-white hover:shadow"
            key={posting.id}
          >
            <div className="flex min-w-0 gap-x-4">
              {posting.user?.photo ? (
                <Image
                  alt={posting.user.companyName || ""}
                  className="size-12 flex-none rounded-full bg-gray-50"
                  height={48}
                  src={posting.user.photo}
                  width={48}
                />
              ) : null}
              <div className="min-w-0 flex-auto">
                <p className="text-lg font-semibold leading-6 text-gray-900">
                  <Link href={`${getRoute("Postings")}/${posting.id}`}>
                    <span className="absolute inset-x-0 -top-px bottom-0" />
                    {posting.title}
                  </Link>
                </p>
                <p className="mt-1 line-clamp-1 flex text-xs leading-5 text-gray-500">
                  {posting.user?.companyName || posting.user?.name}
                  {posting.minimumAge || posting.maximumAge ? " • " : ""}
                  {getAgeGroup(posting.minimumAge, posting.maximumAge)}
                  {posting.minimumFollowers
                    ? ` • Min followers: ${convertToAbbreviation(posting.minimumFollowers)}`
                    : null}
                </p>
                <p className="mt-1 text-sm font-medium leading-6 text-gray-900 sm:hidden">
                  {getCurrency(posting.barter, posting.currency, posting.price)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-x-4">
              <div className="hidden sm:flex sm:flex-col sm:items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {getCurrency(posting.barter, posting.currency, posting.price)}
                </p>
                {posting.externalLink ? (
                  <div className="mt-1 flex items-center  gap-x-1.5 text-xs leading-5 text-gray-500">
                    <ArrowSquareOut size={10} />
                    External
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-gray-500">
                      {`${posting.applicationsCount}+ applications`}
                    </p>
                  </div>
                )}
              </div>
              <ArrowRight
                aria-hidden="true"
                className="size-5 flex-none text-gray-400"
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm md:hidden">
        <MagnifyingGlass weight="bold" /> Looking for more?
        <Link
          className="flex items-center gap-2  font-medium text-accent "
          href={getRoute("Postings")}
        >
          See all postings <ArrowRight />
        </Link>
      </div>
    </SectionWrapper>
  );
}
