"use client";
import React from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Input } from "ui/input";
import { Button } from "ui/button";
import Form from "ui/form";
import { useAuthMutation } from "../../lib/apollo-client";
import { UPDATE_ONBOARDING_PRICING } from "../../lib/mutations";
import type { Pricing } from "../../__generated__/graphql";

export default function OnboardingPricingForm({
  defaultValues,
  nextStep,
}: {
  defaultValues: Pricing;
  nextStep: () => void;
}) {
  const form = useForm({ defaultValues });
  const [updatePricing, { loading }] = useAuthMutation(
    UPDATE_ONBOARDING_PRICING,
  );

  const onSubmit: SubmitHandler<typeof defaultValues> = async (data) => {
    if (data.general) {
      const res = await updatePricing({
        data: {
          general: data.general,
        },
      });
      if (res.data?.updateOnboardingPricing) nextStep();
    }
  };
  return (
    <Form
      className="space-y-3"
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Input
        className="block"
        label="General price"
        name="general"
        placeholder="Enter your average prices for collaboration (In rupees)"
        rules={{ required: true, valueAsNumber: true }}
      />
      <div className="!mt-6 flex justify-between">
        <Button loading={loading} onClick={nextStep} outline type="submit">
          Skip
        </Button>

        <Button loading={loading} type="submit">
          Next
        </Button>
      </div>
    </Form>
  );
}
