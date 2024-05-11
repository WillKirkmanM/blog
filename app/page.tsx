import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" 
import Link from "next/link";

import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles()

  return (
    <>
      <div className="flex justify-center mt-10">
        <h2 className="text-2xl text-left">Your Articles</h2>
      </div>
      {articles.map(article => (
        <div key={article.name} className="flex justify-center">
          <Card className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <CardHeader>
              <Link href={`/articles/${article.name}`} className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                <CardTitle>{article.title}</CardTitle>
              </Link>
              <CardDescription className="mt-2 text-gray-500">{article.description}</CardDescription>
            </CardHeader>
          </Card>
        </div>
))}
   </>
  );
}
