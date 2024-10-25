"use client";
import React, { useState } from "react";
import classNames from "classnames";
import { useAccountSections } from "../constants";
import type { GetAccountDetailsQuery } from "../../../__generated__/graphql";

export type AccountSectionData = NonNullable<GetAccountDetailsQuery["user"]>;

export default function AccountView({
  defaultSection,
  data,
}: {
  defaultSection: number;
  data: AccountSectionData;
}) {
  const [selectedSection, setSelectedSection] = useState(
    isNaN(defaultSection) ? 0 : defaultSection,
  );
  const ACCOUNT_SECTIONS = useAccountSections();
  const SelectedComponent = ACCOUNT_SECTIONS[selectedSection]?.component;
  return (
    <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
      <h1 className="sr-only">General Settings</h1>

      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
            {ACCOUNT_SECTIONS.map((item, i) => (
              <li key={item.title}>
                <button
                  className={classNames(
                    selectedSection === i
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                    "group cursor-pointer flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm leading-6 font-semibold",
                  )}
                  onClick={() => {
                    item.onClick ? item.onClick() : setSelectedSection(i);
                  }}
                  type="button"
                >
                  <item.icon
                    aria-hidden="true"
                    className={classNames(
                      selectedSection === i
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-indigo-600",
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
      {SelectedComponent ? <SelectedComponent data={data} /> : null}
    </div>
  );
}