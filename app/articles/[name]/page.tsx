import fs from "fs";
import path from "path";

import { MDXRemote } from "next-mdx-remote/rsc";
import { getMetadataFields, getArticle, getStaticParams } from "@/lib/articles"
import TheMDXRemote from "@/components/MDX/TheMDXRemote";

type Parameters = {
  params: { 
    name: string 
  };
};

export async function generateMetadata({ params }: Parameters) {
  const { title, description, canonicalURL } = await getMetadataFields(params);

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalURL,
    },
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join("content/articles"));
  const params = getStaticParams(files);

  return params;
}

export default async function BlogPage({params}: Parameters) {
  const props = await getArticle(params);

  const components = {};

  return (
    <>
      <div className="antialiased max-w-2xl mb-40 mx-4 mt-8 lg:mx-auto flex flex-col items-start">
        <div className="title font-medium text-2xl tracking-tighter max-w-[1000px]">
          <h1>{props.frontMatter.title}</h1>
        </div>

        <div className="prose prose-quoteless prose-neutral dark:prose-invert">
          <TheMDXRemote content={props.content} />
        </div>
      </div>
    </>
  )
}