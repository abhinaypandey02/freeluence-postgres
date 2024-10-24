"use client";
import type { ChangeEvent } from "react";
import React, { useRef, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Input } from "ui/input";
import { Button } from "ui/button";
import Image from "next/image";
import categories from "commons/categories";
import genders from "commons/genders";
import { useAuthMutation } from "../../lib/apollo-client";
import { UPDATE_ONBOARDING_BASIC_DETAILS } from "../../lib/mutations";
import type { StorageFile } from "../../__generated__/graphql";

export default function OnboardingBasicDetailsForm({
  defaultValues,
  nextStep,
  photoUpload,
}: {
  defaultValues: {
    name: string;
    photo: string;
    bio: string;
    gender: string;
    category: string;
    dob: string;
  };
  nextStep: () => void;
  photoUpload: StorageFile;
}) {
  const { register, handleSubmit } = useForm({ defaultValues });
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const [profilePicture, setProfilePicture] = useState<File>();
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [updateBasicDetails, { loading }] = useAuthMutation(
    UPDATE_ONBOARDING_BASIC_DETAILS,
  );

  const displayURL = profilePicture
    ? URL.createObjectURL(profilePicture)
    : defaultValues.photo;

  const onSubmit: SubmitHandler<typeof defaultValues> = async (data) => {
    if (profilePicture) {
      setUploadingPicture(true);
      const res = await fetch(photoUpload.uploadURL, {
        method: "PUT",
        body: profilePicture,
      });
      if (!res.ok) return;
    }
    const res = await updateBasicDetails({
      data: {
        name: data.name,
        imageURL: profilePicture ? photoUpload.url : null,
        bio: data.bio,
        category: data.category,
        gender: data.gender,
        dob: data.dob,
      },
    });
    if (res.data?.updateOnboardingBasicDetails) {
      nextStep();
    }
  };
  return (
    <>
      <h2 className=" my-10 text-center text-4xl font-bold">
        Some details about you!
      </h2>
      <form
        className="flex flex-col items-center gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input className="block" placeholder="Name" {...register("name")} />
        <Input
          className="block"
          placeholder="Bio"
          textarea
          {...register("bio")}
        />
        <Input
          className="block"
          options={categories.map(({ title }) => ({
            label: title,
            value: title,
          }))}
          placeholder="Category"
          {...register("category")}
        />
        <Input
          className="block"
          options={genders.map((gender) => ({
            label: gender,
            value: gender,
          }))}
          placeholder="Gender"
          {...register("gender")}
        />
        <Input
          className="block"
          placeholder="Date of birth"
          type="date"
          {...register("dob")}
        />
        <Input
          className="hidden"
          onChange={(e) => {
            const event = e as unknown as ChangeEvent<HTMLInputElement>;
            const file = event.target.files?.[0];
            if (file) setProfilePicture(file);
          }}
          ref={ref}
          type="file"
        />
        {displayURL ? (
          <Image
            alt={defaultValues.name}
            height={300}
            src={displayURL}
            width={300}
          />
        ) : null}
        <Button
          loading={loading || uploadingPicture}
          onClick={() => ref.current?.click()}
        >
          Upload Image
        </Button>
        <Button loading={loading || uploadingPicture} type="submit">
          Next
        </Button>
      </form>
    </>
  );
}
