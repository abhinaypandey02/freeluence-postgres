"use client";
import React, { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import Form from "@/components/form";
import {
  handleGQLErrors,
  useAuthMutation,
  useAuthQuery,
} from "@/lib/apollo-client";
import { GET_CITIES, GET_COUNTRIES, GET_STATES } from "@/lib/queries";
import type { Currency } from "@/__generated__/graphql";
import { UPDATE_USER_LOCATION } from "@/lib/mutations";

interface FormFields {
  country?: number | null;
  state?: number | null;
  city?: number | null;
}

export default function OnboardingLocationForm({
  nextStep,
  setCurrency,
  defaultValues,
}: {
  nextStep: () => void;
  setCurrency: (currency: Currency) => void;
  defaultValues: FormFields;
}) {
  const form = useForm({ defaultValues });
  const [updateBasicDetails, { loading }] =
    useAuthMutation(UPDATE_USER_LOCATION);
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
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (data.state && data.country) {
      const res = await updateBasicDetails({
        updatedLocation: {
          city: data.city,
          state: data.state,
          country: data.country,
        },
      }).catch(handleGQLErrors);
      if (res?.data?.updateUserLocation) {
        setCurrency(res.data.updateUserLocation);
        nextStep();
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
        loading={loading || loadingCountries || loadingCities || loadingStates}
        type="submit"
      >
        Next
      </Button>
    </Form>
  );
}
