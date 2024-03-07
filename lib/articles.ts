import fs from "fs"
import path from "path"

import matter from "gray-matter"
import { notFound } from "next/navigation";

type GetPostProps = { name: String }

export async function getPost({ name }: GetPostProps ) {
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

export function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), "content/articles");
  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter(
      (fileName) => !fileName.startsWith(".") && fileName.endsWith(".mdx")
    );

  const posts = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontMatter } = matter(fileContents);

    return {
      slug: fileName.replace(".mdx", ""),
      ...frontMatter,
    };
  });

  return posts;
}