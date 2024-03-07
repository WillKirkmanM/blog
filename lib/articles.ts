import fs from "fs"
import path from "path"

import matter from "gray-matter"


type Article = {
  name: string,
  title: string,
  description: string
}

type ArticleName = { name: string }

export async function getArticle({ name }: ArticleName) {
  const markdownFile = fs.readFileSync(
    path.join("content/articles", name + ".mdx"),
    "utf-8"
  );
  const { data: frontMatter, content } = matter(markdownFile);

  return {
    frontMatter,
    name,
    content,
  };

}

export function getAllArticles() {
  const articleDirectory = path.join(process.cwd(), "content/articles");
  const fileNames = fs
    .readdirSync(articleDirectory)
    .filter(
      (fileName) => !fileName.startsWith(".") && fileName.endsWith(".mdx")
    );

  const articles: Article[] = fileNames.map((fileName) => {
    const fullPath = path.join(articleDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontMatter } = matter(fileContents);

    return {
      name: fileName.replace(".mdx", ""),
      title: frontMatter.title,
      description: frontMatter.description,
    };
  });

  return articles;
}

type ParamsArray = { name: String }[]

export function getStaticParams(files: string[]): ParamsArray {
  let params = []

  for (const filename of files) {
    const fullPath = path.join("content/articles", filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data: frontMatter } = matter(fileContents);

    const articleDate = new Date(frontMatter.date);
    const currentDate = new Date();
    const isFuture = articleDate > currentDate;

    if (!isFuture) {
      params.push({ name: filename.replace(".mdx", "") });
    }
  }

  return params
}

export async function getMetadataFields({ name }: ArticleName) {
  const article = await getArticle({ name: name })

  const title = article.frontMatter.title;
  const description = article.frontMatter.description;

  const canonicalURL = `${process.env.next_public_base_url}/${name}`;

  return { title, description, canonicalURL }
}