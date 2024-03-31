import Link from 'next/link'
import SearchBar from '../Search/SearchBar'

import { Separator } from '../ui/separator'

export default function NavBar() {
  return (
    <>
    <div className="flex items-center justify-between p-6 text-gray-500">
      <Link href="/">
        <p className="text-2xl font-bold">Steady Ground</p>
      </Link>

      <SearchBar />

      <div className="space-x-4">
        <Link href="/articles">
          <p className="hover:underline">Articles</p>
        </Link>
      </div>
     </div>
    <Separator />
    </>
  )
}