import { getAllArticleProperties, getAllArticles, getMetadataFields } from "@/lib/articles";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles = await getAllArticleProperties()

  const articleEntries: MetadataRoute.Sitemap = await Promise.all(articles.map(async article => {
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/articles/${article.name}`
    }
  })) 

  return [
    ...articleEntries
  ]
} 