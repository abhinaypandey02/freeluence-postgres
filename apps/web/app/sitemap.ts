import type { MetadataRoute } from "next";
import { Route } from "../constants/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    {
      url: Route.Home,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: Route.SignUp,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: Route.Search,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: Route.PrivacyPolicy,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: Route.TermsConditions,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: Route.Login,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
  const users = (await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/get-all-users-sitemap`,
  ).then((data) => data.json())) as number[];
  routes.push(
    ...users.map((user) => ({
      url: `${Route.Profile}/${user}`,
      lastModified: new Date(),
      changeFrequency:
        "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: 1,
    })),
  );
  return routes;
}
