"use client"

import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

export default function SearchBar() {
  
  interface Result {
    id:          string;
    score:       number;
    terms:       string[];
    queryTerms:  string[];
    match:       string[];
    title:       string;
    name:        string;
    description: string;
  }
  const [results, setResults] = useState<Result[]>([]);

  const search = async (query: string) => {
    const response = await fetch(`/api/articles?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    setResults(data.results);
  }

  return (
    <div className="relative mx-auto w-1/2 mt-10">
      <Input 
        className="  w-full border-2 border-gray-300 rounded-md"
        placeholder="Search an Article"
        onChange={(e) => {
          search(e.target.value);
        }}
      />
      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg">
          {results.map((result, index) => (
            <Link key={index} href={`/articles/${result.name}`}>
              <p className="block p-2 hover:bg-gray-100">{result.title}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}