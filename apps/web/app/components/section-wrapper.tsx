import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import classNames from "classnames";

export default function SectionWrapper({
  children,
  title,
  description,
  prefixTitle,
  headerElements,
  headerClassName,
  id,
  center,
  className,
}: PropsWithChildren<{
  id: string;
  title: string;
  prefixTitle?: string;
  description?: string;
  headerElements?: ReactNode;
  className?: string;
  headerClassName?: string;
  center?: boolean;
}>) {
  return (
    <div
      className={`mx-auto max-w-7xl px-6 py-16 sm:my-16 lg:px-8 ${className}`}
      id={id}
    >
      <div
        className={classNames(
          "mb-10 flex items-start sm:mb-20 justify-between",
          {
            "sm:justify-center": center,
            "sm:justify-between": !center,
          },
          headerClassName,
        )}
      >
        <div className="max-w-2xl sm:mx-auto lg:mx-0">
          {prefixTitle ? (
            <p
              className={`text-base font-semibold leading-7 text-accent ${
                center ? "sm:text-center" : ""
              }`}
            >
              {prefixTitle}
            </p>
          ) : null}
          <h2
            className={`grow font-poppins text-3xl font-bold !leading-snug  sm:text-4xl ${
              center ? "sm:text-center" : ""
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-3 leading-8 text-gray-600 sm:mt-6 sm:text-lg ${
              center ? "sm:text-center" : ""
            }`}
          >
            {description}
          </p>
        </div>
        {headerElements}
      </div>
      {children}
    </div>
  );
}