"use client";
import React, { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Input } from "ui/input";
import { Button } from "ui/button";
import Form from "ui/form";
import { useRouter } from "next/navigation";
import type { GraphQLError } from "graphql/error";
import {
  handleGQLErrors,
  useAuthMutation,
  useAuthQuery,
} from "../../lib/apollo-client";
import { UPDATE_AGENCY_ONBOARDING_LOCATION } from "../../lib/mutations";
import { GET_CITIES, GET_COUNTRIES, GET_STATES } from "../../lib/queries";
import { getRoute } from "../../constants/routes";

interface FormValues {
  country?: number | null;
  state?: number | null;
  city?: number | null;
}

export default function OnboardingLocationForm() {
  const form = useForm<FormValues>();
  const router = useRouter();
  const [updateBasicDetails, { called, reset }] = useAuthMutation(
    UPDATE_AGENCY_ONBOARDING_LOCATION,
  );
  const [fetchCountries, { data: countriesData, loading: loadingCountries }] =
    useAuthQuery(GET_COUNTRIES);
  const [fetchStates, { data: statesData, loading: loadingStates }] =
    useAuthQuery(GET_STATES);
  const [fetchCities, { data: citiesData, loading: loadingCities }] =
    useAuthQuery(GET_CITIES);

  useEffect(() => {
    void fetchCountries();
    const countryID = form.getValues("country"),
      stateID = form.getValues("state");
    if (countryID)
      void fetchStates({
        countryID,
      });
    if (stateID)
      void fetchCities({
        stateID,
      });
  }, [fetchCountries, fetchStates, fetchCities]);
  useEffect(() => {
    const sub = form.watch((value, { name }) => {
      if (name === "country" && value[name])
        void fetchStates({
          countryID: value[name],
        });
      if (name === "state" && value[name])
        void fetchCities({
          stateID: value[name],
        });
    });
    return sub.unsubscribe;
  }, [form.watch, fetchCities, form, fetchStates]);

  const countries = countriesData?.countries;
  const states = statesData?.states;
  const cities = citiesData?.cities;
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.state && data.country) {
      const res = await updateBasicDetails({
        locationDetails: {
          city: data.city,
          state: data.state,
          country: data.country,
        },
      }).catch((e) => {
        handleGQLErrors(e as GraphQLError);
        reset();
      });
      if (res?.data?.addAgencyLocation) {
        router.push(`${getRoute("Profile")}/${res.data.addAgencyLocation}`);
        router.refresh();
      }
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
        label="Country"
        name="country"
        options={countries || []}
        placeholder="Select your country"
        rules={{ required: true }}
      />
      {states ? (
        <Input
          className="block"
          label="State"
          name="state"
          options={states}
          placeholder="Select your state"
          rules={{ required: true }}
        />
      ) : null}
      {cities ? (
        <Input
          className="block"
          label="City"
          name="city"
          options={cities}
          placeholder="Select your city"
        />
      ) : null}
      <Button
        className="ml-auto"
        disabled={!form.watch("city")}
        loading={called || loadingCountries || loadingCities || loadingStates}
        type="submit"
      >
        Register my brand
      </Button>
    </Form>
  );
}
