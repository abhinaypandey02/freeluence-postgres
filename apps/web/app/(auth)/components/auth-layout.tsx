import type { PropsWithChildren } from "react";
import React from "react";
import Link from "next/link";
import { getRoute } from "../../../constants/routes";
import SocialBar from "./social-bar";

export default function AuthLayout({
  newUser,
  children,
  redirectURL,
}: PropsWithChildren<{ newUser?: boolean; redirectURL: string }>) {
  return (
    <section className="mt-5  flex flex-1 flex-col justify-center pb-12 sm:px-6 sm:py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full ">
        <h2 className="mt-6 text-center font-poppins text-3xl font-bold leading-9 text-gray-800 sm:text-5xl ">
          {newUser ? "Create a new account" : "Login to your account"}
        </h2>
      </div>

      <div className="sm:mx-auto sm:mt-20 sm:w-full sm:max-w-[480px]">
        <div className=" px-6 py-12 sm:rounded-lg sm:bg-white sm:px-12 sm:shadow">
          {children}
          <div>
            <div className="relative mt-10">
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white px-6 text-gray-900">
                  Or continue with
                </span>
              </div>
            </div>

            <SocialBar redirectURL={redirectURL} />
          </div>
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          {newUser ? "Already have an account? " : "New here? "}
          <Link
            className="link-accent font-semibold leading-6"
            href={newUser ? getRoute("Login") : getRoute("SignUp")}
          >
            {newUser
              ? "Sign in to your account!"
              : "Get started on a new account!"}
          </Link>
        </p>
      </div>
    </section>
  );
}
