import fs from "fs";
import path from "path";

import { MDXRemote } from "next-mdx-remote/rsc";
import { getPost } from "@/lib/articles"
import matter from "gray-matter";

type Parameters = {
  params: { 
    name: string 
  };
};

export async function generateMetadata({ params }: Parameters) {
  const post = await getPost(params);
  const title = post.frontMatter.title;
  const description = post.frontMatter.description;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${params.name}`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("content/articles"));
  const params = [];

  for (const filename of files) {
    const fullPath = path.join("content/articles", filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data: frontMatter } = matter(fileContents);

    const postDate = new Date(frontMatter.date);
    const currentDate = new Date();
    const isFuture = postDate > currentDate;

    if (!isFuture) {
      params.push({ slug: filename.replace(".mdx", "") });
    }
  }
  return params;
}

export default async function BlogPage({params}: Parameters) {
  const props = await getPost(params);

  const components = {};

  return (
    <>
      <div className="antialiased max-w-2xl mb-40 flex flex-col md:flex-row mx-4 mt-8 lg:mx-auto">
        <div className="title font-medium text-2xl tracking-tighter max-w-[1000px]">
          <h1>{props.frontMatter.title}</h1>
        </div>

        <div className="prose prose-quoteless prose-neutral dark:prose-invert">
          <article className="mdx">
            <MDXRemote source={props.content} components={components} />
          </article>
        </div>
      </div>
    </>
  );
}