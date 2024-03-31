import { getAllArticles } from "@/lib/articles"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ArticlesPage() {
  let articles = getAllArticles()

  return (
    <div className="m-28">
      <p className="text-2xl font-medium tracking-tighter">Articles</p>
        {articles.map(article => (
          <div key={article.name}>
            <Card className="max-w-sm rounded overflow-hidden shadow-lg m-4">
              <CardHeader>
                <a href={`/articles/${article.name}`} className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                  <CardTitle>{article.title}</CardTitle>
                </a>
                <CardDescription className="mt-2 text-gray-500">{article.description}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
    </div>
  )
}