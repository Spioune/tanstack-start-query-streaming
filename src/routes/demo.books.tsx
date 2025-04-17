import { createFileRoute } from '@tanstack/react-router'
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { Suspense } from 'react'

const getBooks = createServerFn({
  method: 'GET',
}).handler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return [
    {
      name: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
    },
    {
      name: 'To Kill a Mockingbird',
      author: 'Harper Lee',
    },
  ]
})

export const Route = createFileRoute('/demo/books')({
  component: TanStackQueryDemo,
  loader: async (ctx) => {
    console.log('prefetching books')

    return getBooks
  },
})

function TanStackQueryDemo() {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Books</h1>
      {/* <ul>{data?.map((p) => <li key={p.name}>{p.name}</li>)}</ul> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Books />
      </Suspense>
    </div>
  )
}

function Books() {
  const booksPromise = Route.useLoaderData()
  const { data } = useSuspenseQuery({
    queryKey: ['books'],
    queryFn: () => booksPromise(),
  })

  return <ul>{data?.map((p) => <li key={p.name}>{p.name}</li>)}</ul>
}
