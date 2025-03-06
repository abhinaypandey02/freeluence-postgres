import { Spinner } from "@phosphor-icons/react/dist/ssr";
import classNames from "classnames";
import React from "react";

export default function FullScreenLoader({
  className,
}: {
  className?: string;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner
        className={classNames("animate-spin fill-primary", className)}
        size={60}
      />
    </div>
  );
}
