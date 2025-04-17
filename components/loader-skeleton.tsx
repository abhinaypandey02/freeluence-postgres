import { ComponentProps, ElementType, ReactNode } from "react";
import React from "react";

import Loader from "@/components/loader";
import { cn } from "@/lib/utils";

export default function LoaderSkeleton({
  Icon,
  loading,
  title,
  subtitle,
  ...props
}: {
  Icon?: ElementType;
  loading?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
} & ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-col items-center", props.className)}
    >
      {Icon && !loading ? (
        <Icon size={32} />
      ) : (
        <Loader width={32} height={32} />
      )}
      <div className="mt-2 block text-lg font-semibold text-gray-900">
        {title}
      </div>
      {subtitle && (
        <span className="mt-1.5 block text-sm font-medium text-gray-600">
          {subtitle}
        </span>
      )}
    </div>
  );
}
