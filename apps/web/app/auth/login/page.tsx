"use client";
import React, { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "ui/input";
import { Button } from "ui/button";
import Link from "next/link";
import { useLoginWithEmail } from "../../../lib/auth-client";
import { Route } from "../../../constants/routes";
import useTurnstileToken from "../use-turnstile-token";
import AuthLayout from "../components/auth-layout";

const defaultValues = {
  email: "",
  password: "",
  c_password: "",
  name: "",
};

const CONTAINER_ID = "captcha-container";

export default function LoginPage() {
  const { register, handleSubmit } = useForm({ defaultValues });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { turnstileToken, resetTurnstileToken } =
    useTurnstileToken(CONTAINER_ID);
  const [success, setSuccess] = useState(false);

  const loginWithEmail = useLoginWithEmail();
  const onSubmit: SubmitHandler<typeof defaultValues> = async (data) => {
    if (!turnstileToken) {
      return;
    }
    setIsLoading(true);
    if (await loginWithEmail(data.email, data.password, turnstileToken)) {
      setSuccess(true);
      router.push(Route.Home);
      router.refresh();
    } else {
      setIsLoading(false);
      resetTurnstileToken();
    }
  };

  return (
    <AuthLayout newUser={false}>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="email"
          >
            Email address
          </label>
          <div className="mt-2">
            <Input
              className="block"
              placeholder="Email"
              {...register("email", { required: true })}
            />
          </div>
        </div>

        <div>
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="mt-2">
            <Input
              className="block"
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              id="remember-me"
              name="remember-me"
              type="checkbox"
            />
            <label
              className="ml-3 block text-sm leading-6 text-gray-900"
              htmlFor="remember-me"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm leading-6">
            <Link className="link-accent font-semibold" href="#">
              Forgot password?
            </Link>
          </div>
        </div>
        <div id={CONTAINER_ID} />

        <div>
          <Button
            className="w-full"
            loading={!turnstileToken || isLoading}
            success={success}
            type="submit"
          >
            Login
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}

export const dynamic = "force-dynamic";
