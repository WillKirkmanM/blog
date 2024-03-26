import fs from "fs"
import path from "path"

import matter from "gray-matter"
import mammoth from "mammoth"

import { formattedLastModifiedDate } from "./utils"

type Article = {
  name: string,
  title: string,
  description: string
}

type ArticleProperties = {
  frontMatter: any | undefined,
  name: string | undefined,
  content: string | undefined
  HTMLContent: string | undefined
}

type ArticleName = { name: string }

export async function getArticle({ name }: ArticleName): Promise<ArticleProperties> {
  name = decodeURIComponent(name) // When there are spaces in the name, it returns %20 which is a space (https://www.w3schools.com/tags/ref_urlencode.ASP). This function removes everything we don't want when processing.

  let articlePath = "content/articles/" + name
  if (fs.existsSync(articlePath + ".docx")) {
    let { value: HTMLContent } = await mammoth.convertToHtml({ path: articlePath + ".docx" })

    return {
      frontMatter: undefined,
      name: undefined,
      content: undefined,
      HTMLContent
    }
  }

  if (fs.existsSync(articlePath + ".mdx")) {
    const markdownFile = fs.readFileSync(
      path.join(articlePath + ".mdx"), "utf-8");
    let { data: frontMatter, content } = matter(markdownFile);

    // Replaces https://google.com with [https://google.com](https://google.com)
    content = content.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)'); 

    return {
      frontMatter,
      name,
      content,
      HTMLContent: undefined
    };
  }

  return { frontMatter: undefined, name: undefined, content: undefined, HTMLContent: undefined }
}

export function getAllArticles() {
  const articleDirectory = path.join(process.cwd(), "content/articles");
  const fileNames = fs
    .readdirSync(articleDirectory)
    .filter((fileName) => !fileName.startsWith(".") && (fileName.endsWith(".mdx") || fileName.endsWith(".docx")));

  let articles: Article[] = [];

  fileNames.map((fileName) => {
    const fullPath = path.join(articleDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const name = fileName.split(".")[0]
    const title = fileName.replace(".docx", "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")

    const description = `Written ${formattedLastModifiedDate(fullPath)}`

    if (fileName.endsWith(".docx")) {
      articles.push({
        name,
        title,
        description
      })
    }

    if (fileName.endsWith(".mdx")) {
      const { data: frontMatter } = matter(fileContents);
      const { title, description } = frontMatter

      articles.push({
        name,
        title,
        description
      })
    }
  })

  return articles;
}

type ParamsArray = { name: String }[]

export function getStaticParams(files: string[]): ParamsArray {
  let params = []

  for (const filename of files) {
    params.push({ name: filename.split(".")[0] });
  }

  return params
}

export async function getMetadataFields({ name }: ArticleName) {
  const article = await getArticle({ name: name })

  let title, description

  if (article.HTMLContent) {
    title = name.replace(".docx", "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    description = "To be implemented."
  }

  if (article.content) {
    title = article.frontMatter.title;
    description = article.frontMatter.description;
  }

  const canonicalURL = `${process.env.next_public_base_url}/${name}`;

  return { title, description, canonicalURL }
}
