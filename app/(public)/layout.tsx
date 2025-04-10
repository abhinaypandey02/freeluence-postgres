import type { PropsWithChildren } from "react";
import React, { Suspense } from "react";

import type { GetCurrentUserQuery } from "@/__generated__/graphql";
import OptimisticNavbar from "@/app/(public)/components/optimistic-navbar";
import { UNAUTHORISED_NAVBAR_SECTIONS } from "@/app/(public)/constants";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getRoute } from "@/constants/routes";
import { getCurrentUser, Injector } from "@/lib/apollo-server";

function AuthFooter({ data }: { data?: GetCurrentUserQuery }) {
  if (data?.user) {
    if (data.user.isOnboarded) {
      return (
        <Footer
          links={[
            { name: "Search", href: getRoute("Search") },
            { name: "Profile", href: getRoute("Profile") },
            { name: "How it works", href: "/#how-it-works" },
            { name: "Features", href: "/#features" },
            { name: "Terms", href: getRoute("TermsConditions") },
            { name: "Privacy", href: getRoute("PrivacyPolicy") },
          ]}
        />
      );
    }
    return (
      <Footer
        links={[
          { name: "Search", href: getRoute("Search") },
          { name: "Get listed", href: getRoute("Onboarding") },
          { name: "How it works", href: "/#how-it-works" },
          { name: "Features", href: "/#features" },
          { name: "Terms", href: getRoute("TermsConditions") },
          { name: "Privacy", href: getRoute("PrivacyPolicy") },
        ]}
      />
    );
  }
  return (
    <Footer
      links={[
        { name: "Search", href: getRoute("Search") },
        { name: "Sign up", href: getRoute("SignUp") },
        { name: "Login", href: getRoute("Login") },
        { name: "How it works", href: "/#how-it-works" },
        { name: "Features", href: "/#features" },
        { name: "Terms", href: getRoute("TermsConditions") },
        { name: "Privacy", href: getRoute("PrivacyPolicy") },
      ]}
    />
  );
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <main className="pt-20">
      <Suspense
        fallback={
          <Navbar {...UNAUTHORISED_NAVBAR_SECTIONS} secondaryLinks={[]} />
        }
      >
        <OptimisticNavbar />
      </Suspense>
      <div className="grow">{children}</div>

      <Injector Component={AuthFooter} fetch={getCurrentUser} />
    </main>
  );
}
