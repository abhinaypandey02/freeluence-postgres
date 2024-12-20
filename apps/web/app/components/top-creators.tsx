import React from "react";
import Link from "next/link";
import {
  InstagramLogo,
  ArrowRight,
  MagnifyingGlass,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { getRoute } from "../../constants/routes";
import type { GetFeaturedSellersQuery } from "../../__generated__/graphql";
import { convertToAbbreviation } from "../../lib/utils";

export default function TopCreators({
  sellers,
}: {
  sellers: GetFeaturedSellersQuery["sellers"];
}) {
  return (
    <div
      className="mx-auto max-w-7xl px-6 pb-5 pt-16 sm:my-16 lg:px-8 "
      id="sellers"
    >
      <div className="flex items-start justify-between">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="grow font-poppins text-3xl font-bold  sm:text-4xl">
            Our Top Creators
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-800">
            Discover the influencers leading the way in engagement and
            creativity. Explore their profiles and see how they can elevate your
            brand through authentic collaborations!
          </p>
        </div>
        <Link
          className="flex items-center gap-2 pt-2 text-lg font-medium text-accent max-md:hidden"
          href={getRoute("Search")}
        >
          Search all <ArrowRight />
        </Link>
      </div>

      <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
        {sellers.map((person, i) => (
          <li
            className={i >= 8 ? "hidden lg:block xl:hidden" : ""}
            key={person.name || ""}
          >
            <Link href={`${getRoute("Profile")}/${person.username}`}>
              <Image
                alt={person.name || ""}
                className="aspect-[14/13] w-full rounded-2xl object-cover"
                height={260}
                src={person.photo || ""}
                width={280}
              />
              <div className="mt-2 flex justify-between gap-2">
                <div className="overflow-hidden">
                  <h3 className=" truncate font-poppins text-xl font-semibold  ">
                    {person.name || ""}
                  </h3>
                  <p className="my-0.5 text-xs font-medium text-gray-500">
                    {person.category}
                  </p>
                </div>
                <div>
                  <div className="flex gap-1 pr-0.5 pt-1 text-xs">
                    <InstagramLogo size={16} />
                    {convertToAbbreviation(
                      person.instagramStats?.followers || 0,
                    )}
                  </div>
                  {person.instagramStats?.er ? (
                    <div className="flex gap-1 pr-0.5 pt-1 text-xs">
                      <TrendUp size={16} />
                      {person.instagramStats.er}%
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-2 md:hidden">
        <MagnifyingGlass weight="bold" /> Need something specific?
        <Link
          className="flex items-center gap-2  font-medium text-accent "
          href={getRoute("Search")}
        >
          Find more <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
