"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Variants } from "ui/button";
import {
  ArrowRight,
  CaretLeft,
  CaretRight,
  FlagCheckered,
  Link as LinkIcon,
  MapPin,
  PencilSimple,
  ShareNetwork,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { GetDefaultAgencyOnboardingDetailsQuery } from "../../__generated__/graphql";
import { AgencyMemberType } from "../../__generated__/graphql";
import { getRoute } from "../../constants/routes";
import OnboardingBasicDetailsForm from "./agency-basic-details-form";
import SocialsStatus from "./agency-socials-status";
import OnboardingLocationForm from "./agency-location";
import OnboardingStepper from "./stepper";
import AgencyUsername from "./agency-username";

export function getStep(
  currentUser: GetDefaultAgencyOnboardingDetailsQuery["getCurrentUser"],
) {
  if (!currentUser?.onboardingAgency) return 0;
  if (
    !currentUser.onboardingAgency.name ||
    !currentUser.onboardingAgency.bio ||
    !currentUser.onboardingAgency.photo ||
    !currentUser.onboardingAgency.contactEmail ||
    !currentUser.onboardingAgency.contactPhone
  )
    return 2;
  if (!currentUser.onboardingAgency.username) return 3;
  if (currentUser.onboardingAgency.username) return 4;
  return 0;
}

function AgencyOnboardingWizard({
  data,
  loading: dataLoading,
  redirectURL,
}: {
  data?: GetDefaultAgencyOnboardingDetailsQuery;
  loading?: boolean;
  redirectURL: string | null;
}) {
  const currentUser = data?.getCurrentUser;
  const router = useRouter();
  const [step, setStep] = useState(getStep(currentUser));
  const [maxTouchedStep, setMaxTouchedStep] = useState(getStep(currentUser));
  const nextStep = useCallback(() => {
    setStep((o) => Math.min(o + 1, MAX_STEPS - 1));
    setMaxTouchedStep((o) => Math.max(o, step + 1));
    if (step !== 0) router.refresh();
  }, [step]);
  const steps = useMemo(
    () => [
      {
        title: "",
        heading: "",
        description: "",
        icon: FlagCheckered,
        component: (
          <div
            className="flex h-full flex-col justify-center pb-14 pt-10"
            key={0}
          >
            <Image
              alt="Start for sales"
              className="mx-auto"
              height={500}
              loading="eager"
              src="/agency-onboarding-start.svg"
              width={300}
            />
            <h2 className="mt-5 text-center font-poppins text-3xl font-bold text-gray-800">
              It's time to grow your brand
            </h2>
            <small className="mx-auto mt-2 max-w-96 text-center text-gray-500">
              You are a just few steps away from taking your brand on a
              professional level
            </small>
            <Button
              className="mx-auto mt-3 flex items-center gap-2 !font-medium"
              onClick={nextStep}
              variant={Variants.ACCENT}
            >
              Create your brand <ArrowRight weight="bold" />
            </Button>
            <small className="my-5 text-center">or</small>
            <Link href={getRoute("Onboarding")}>
              <Button
                className="mx-auto mt-3 flex items-center gap-2 !text-sm !font-medium"
                outline
                variant={Variants.PRIMARY}
              >
                Join as an influencer/creator
              </Button>
            </Link>
            <Link
              className="mt-5 text-center text-sm underline underline-offset-2"
              href={getRoute("Home")}
            >
              No thanks!, I am not an influencer.
            </Link>
          </div>
        ),
      },
      {
        title: "Brand Socials",
        heading: "Let's connect your brand's socials",
        description: "Connect your brand's socials.",
        longDescription:
          "Connect your brand's instagram account to verify your identity.",
        icon: ShareNetwork,
        component: (
          <SocialsStatus
            connections={{ instagram: Boolean(currentUser?.onboardingAgency) }}
            key={1}
            nextStep={nextStep}
            redirectURL={redirectURL}
          />
        ),
      },
      {
        title: "Brand details",
        heading: "Let's know about your brand better",
        description: "Information about your brand",
        longDescription:
          "Provide information about your brand so we can help you be found!",
        icon: PencilSimple,
        component: currentUser?.onboardingAgency ? (
          <OnboardingBasicDetailsForm
            defaultValues={{
              name: currentUser.onboardingAgency.name || "",
              photo: currentUser.onboardingAgency.photo || "",
              bio: currentUser.onboardingAgency.bio || "",
              contactEmail: currentUser.onboardingAgency.contactEmail || "",
              contactPhone: currentUser.onboardingAgency.contactPhone || "",
            }}
            key={currentUser.onboardingAgency.name}
            nextStep={nextStep}
            photoUpload={currentUser.onboardingAgency.pictureUploadURL}
          />
        ) : null,
      },

      {
        title: "Brand's Username",
        heading: "Personalised brand link",
        description: "Get a personalized link for your brand",
        longDescription:
          "Get a personalised sharing link for your brand. Select a unique username and get your own custom link that you can share easily!",
        icon: LinkIcon,
        component: (
          <AgencyUsername
            defaultValues={{
              username: currentUser?.onboardingAgency?.username || undefined,
            }}
            key={4}
            nextStep={nextStep}
          />
        ),
      },
      {
        title: "Location",
        heading: "Where is your team based?",
        description: "Your brand's city",
        longDescription:
          "Enter the details about where your brand is setup to help people find you easily",
        icon: MapPin,
        component: <OnboardingLocationForm key={5} />,
      },
    ],
    [currentUser, currentUser?.onboardingAgency?.name, nextStep, redirectURL],
  );

  useEffect(() => {
    if (!currentUser && !dataLoading) {
      router.push(
        redirectURL ||
          `${getRoute("SignUp")}?redirectURL=${getRoute("AgencyOnboarding")}`,
      );
    }
    if (
      currentUser?.agencies.some(
        (agency) => agency.type === AgencyMemberType.Owner,
      )
    ) {
      router.push(redirectURL || getRoute("Home"));
    }
  }, [currentUser, dataLoading, redirectURL, router]);

  const routeLoading = !currentUser && !dataLoading;
  const MAX_STEPS = steps.length;

  function prevStep() {
    setStep((o) => Math.max(o - 1, 0));
  }

  const allowForward = step < maxTouchedStep;
  const currentStep = steps[step];
  const loading = dataLoading || routeLoading;

  return (
    <>
      <div className="w-full max-w-lg rounded-xl sm:p-5 sm:shadow-elevation-1">
        {!loading && (
          <div className="h-full">
            <div className="flex items-center justify-between">
              <div className="flex gap-4 font-poppins">
                {step > 0 ? (
                  <>
                    <button onClick={prevStep} type="button">
                      <CaretLeft />
                    </button>
                    ({step}/{MAX_STEPS - 1}) {currentStep?.title}
                  </>
                ) : null}
              </div>
              {allowForward ? (
                <button onClick={nextStep} type="button">
                  <CaretRight />
                </button>
              ) : null}
            </div>
            <div className="h-full sm:px-6">
              {currentStep?.heading ? (
                <h2 className="mb-1 mt-6 text-center font-poppins text-3xl font-semibold sm:mt-14">
                  {currentStep.heading}
                </h2>
              ) : null}
              {currentStep?.longDescription ? (
                <p className="mb-5 text-center text-gray-600 sm:mb-10">
                  {currentStep.longDescription}
                </p>
              ) : null}
              {steps[step]?.component}
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="animate-spin fill-primary " size={60} />
          </div>
        ) : null}
      </div>
      <div className="flex grow items-center justify-center px-4 max-sm:hidden">
        <OnboardingStepper currentStep={step - 1} steps={steps.slice(1)} />
      </div>
    </>
  );
}

export default AgencyOnboardingWizard;
