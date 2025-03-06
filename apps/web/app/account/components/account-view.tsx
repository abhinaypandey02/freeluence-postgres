"use client";
import React, { useState } from "react";
import classNames from "classnames";
import { redirect, useRouter } from "next/navigation";
import { useAccountSections } from "../constants";
import type { GetAccountDetailsQuery } from "../../../__generated__/graphql";
import { getRoute } from "../../../constants/routes";
import FullScreenLoader from "./full-screen-loader";

export type AccountSectionData = NonNullable<GetAccountDetailsQuery["user"]>;

export default function AccountView({
  data,
  defaultSection,
  loading,
}: {
  data: GetAccountDetailsQuery["user"];
  defaultSection: number;
  loading: boolean;
}) {
  const [selectedSection, setSelectedSection] = useState(
    isNaN(defaultSection) ? 0 : defaultSection,
  );
  const router = useRouter();
  const ACCOUNT_SECTIONS = useAccountSections();
  const SelectedComponent = ACCOUNT_SECTIONS[selectedSection]?.component;

  if (!data && !loading) return redirect(getRoute("Home"));

  return (
    <div className="mx-auto max-w-7xl lg:flex lg:gap-x-16 lg:px-8">
      <h2 className="sr-only">General Settings</h2>

      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
            {ACCOUNT_SECTIONS.map((item, i) => (
              <li key={item.title}>
                <button
                  className={classNames(
                    selectedSection === i
                      ? "bg-gray-50 text-accent"
                      : "text-gray-700 hover:text-accent hover:bg-gray-50",
                    "group cursor-pointer flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold",
                  )}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      setSelectedSection(i);
                      router.push(`${getRoute("Account")}/?section=${i}`);
                    }
                  }}
                  type="button"
                >
                  <item.icon
                    aria-hidden="true"
                    className={classNames(
                      selectedSection === i
                        ? "text-accent"
                        : "text-gray-400 group-hover:text-accent",
                      "h-6 w-6 shrink-0",
                    )}
                  />
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {loading ? (
        <FullScreenLoader className="!h-full" />
      ) : (
        <>
          {SelectedComponent && data ? <SelectedComponent data={data} /> : null}
        </>
      )}
    </div>
  );
}
