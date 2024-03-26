import fs from "fs"
import path from "path"

import matter from "gray-matter"
import mammoth from "mammoth"


type ArticleProperties = {
  name: string,
  title: string,
  description: string
}

type Article = {
  frontMatter: any | undefined,
  name: string | undefined,
  content: string | undefined
  HTMLContent: string | undefined
}

type ArticleName = { name: string }

export async function getArticle({ name }: ArticleName): Promise<Article> {
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
    const { data: frontMatter, content } = matter(markdownFile);

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
    .filter(
      (fileName) => !fileName.startsWith(".") && (fileName.endsWith(".mdx") || fileName.endsWith(".docx"))
    );

  let articles: ArticleProperties[] = [];
  fileNames.map((fileName) => {
    const fullPath = path.join(articleDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    if (fileName.endsWith(".docx")) {
      articles.push({
        name: fileName.split(".")[0],
        title: "Word Document",
        description: "To be implemented"
      }
      )
    }

    if (fileName.endsWith(".mdx")) {
      const { data: frontMatter } = matter(fileContents);

      articles.push({
        name: fileName.split(".")[0],
        title: frontMatter.title,
        description: frontMatter.description,
      })
    }
  })

  return articles;
}

type ParamsArray = { name: String }[]

export function getStaticParams(files: string[]): ParamsArray {
  let params = []

  for (const filename of files) {
    // const fullPath = path.join("content/articles", filename);
    // const fileContents = fs.readFileSync(fullPath, "utf8");
    params.push({ name: filename.split(".")[0] });
  }

  return params
}

export async function getMetadataFields({ name }: ArticleName) {
  const article = await getArticle({ name: name })

  let title, description

  if (article.HTMLContent) {
    title = name.replace("-", " ").toUpperCase()
    description = "To be implemented."
  }

  if (article.content) {
    title = article.frontMatter.title;
    description = article.frontMatter.description;
  }

  const canonicalURL = `${process.env.next_public_base_url}/${name}`;

  return { title, description, canonicalURL }
}
