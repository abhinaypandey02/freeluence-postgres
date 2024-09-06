"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Route } from "../../../../constants/routes";

function InstagramRedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const params = window.location.hash.split("#")[1];
    const hashParams = new URLSearchParams(params);
    const redirectURL = hashParams.get("state") || searchParams.get("state");
    const error = hashParams.get("error") || searchParams.get("error");
    const accessToken = hashParams.get("access_token");
    const expiresIn = hashParams.get("expires_in");
    if (!error && accessToken && expiresIn)
      router.push(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/instagram?${params}&redirectURL=${redirectURL}`,
      );
    else if (redirectURL) router.push(redirectURL);
    else router.push(Route.SignUp);
  }, [router, searchParams]);
  return null;
}
export default function InstagramRedirectHandlerPage() {
  return (
    <Suspense>
      <InstagramRedirectHandler />
    </Suspense>
  );
}
