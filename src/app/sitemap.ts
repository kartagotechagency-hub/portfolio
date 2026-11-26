import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://kartagotech.agency";
  const lastModified = new Date();

  const staticPaths = ["", "/services", "/work", "/about", "/contact"];
  const projectPaths = projects.map((p) => `/work/${p.slug}`);
  const allPaths = [...staticPaths, ...projectPaths];

  return locales.flatMap((locale) =>
    allPaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1.0 : path.startsWith("/work/") ? 0.7 : 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en${path}`,
          fr: `${baseUrl}/fr${path}`,
        },
      },
    }))
  );
}
