import React from "react";
import { REFERRAL_RATES } from "commons/referral";

export default function EarningsInfo({
  totalEarnings,
  title,
}: {
  totalEarnings: number;
  title: string;
}) {
  return (
    <div className="mt-6">
      <div>
        {title}: <b>{totalEarnings}</b>
        <br />
      </div>
      <em className="text-xs">
        (Current rate/application:- Verified = {REFERRAL_RATES.verified}, Others
        = {REFERRAL_RATES.others})
      </em>
    </div>
  );
}
