"use client";
import React from "react";
import Logo from "@/app/logo";
import { useSubPage } from "@/lib/auth-client";
import { NavItem } from "@/app/(dashboard)/type";

export default function TopNav({
  title,
  subLinks,
}: {
  title: string;
  subLinks: NavItem[];
}) {
  const { setOpenSubPage } = useSubPage();

  return (
    <div className="flex w-full items-center justify-between p-4 lg:hidden">
      <div className="flex items-center gap-3">
        <Logo className="text-primary" size={32} />
        <h2 className="font-poppins text-2xl font-semibold text-gray-800">
          {title}
        </h2>
      </div>
      <div className="flex">
        {subLinks.map((page) => (
          <button
            key={page.heading}
            onClick={() => {
              setOpenSubPage(page);
            }}
          >
            <page.icon size={22} weight="bold" />
          </button>
        ))}
      </div>
    </div>
  );
}
