import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { TOOLS } from "@/config/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Active tools routes
  const toolRoutes: MetadataRoute.Sitemap = TOOLS.filter(
    (tool) => tool.status === "active"
  ).map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
