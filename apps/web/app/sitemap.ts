import type { MetadataRoute } from "next";
import { Route } from "../constants/routes";
import { getBlogPosts } from "./blogs/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: Route.Home,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: Route.Search,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: Route.Postings,
      lastModified: new Date(),
      changeFrequency: "daily",
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
  ];
  // const { users, campaigns } = (await fetch(
  //   `${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/get-sitemap-data`,
  // ).then((data) => data.json())) as {
  //   campaigns: number[];
  //   users: string[];
  // };
  // routes.push(
  //   ...users.map((user) => ({
  //     url: `${Route.Profile}/${user}`,
  //     lastModified: new Date(),
  //     changeFrequency:
  //       "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
  //     priority: 0.9,
  //   })),
  // );
  // routes.push(
  //   ...campaigns.map((user) => ({
  //     url: `${Route.Postings}/${user}`,
  //     lastModified: new Date(),
  //     changeFrequency:
  //       "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
  //     priority: 0.9,
  //   })),
  // );
  getBlogPosts().forEach((post) => {
    routes.push({
      url: `${Route.Blogs}/${post?.id}`,
      lastModified: post?.date || new Date(),
      changeFrequency:
        "weekly" as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: 1,
    });
  });
  return routes.map((route) => ({
    ...route,
    url: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL + route.url,
  }));
}
