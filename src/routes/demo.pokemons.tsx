import { createFileRoute } from '@tanstack/react-router'
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { Suspense } from 'react'

const getPokemons = createServerFn({
  method: 'GET',
}).handler(async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return [
    {
      name: 'bulbasaur',
      type: 'grass',
    },
    {
      name: 'ivysaur',
      type: 'grass',
    },
  ]
})

export const Route = createFileRoute('/demo/pokemons')({
  component: TanStackQueryDemo,
  loader: async (ctx) => {
    console.log('prefetching pokemons')
    ctx.context.queryClient.prefetchQuery({
      queryKey: ['pokemons'],
      queryFn: () => getPokemons(),
    })
  },
})

function TanStackQueryDemo() {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Pokemons</h1>
      {/* <ul>{data?.map((p) => <li key={p.name}>{p.name}</li>)}</ul> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Pokemons />
      </Suspense>
    </div>
  )
}

function Pokemons() {
  const { data } = useSuspenseQuery({
    queryKey: ['pokemons'],
    queryFn: () => getPokemons(),
  })

  return <ul>{data?.map((p) => <li key={p.name}>{p.name}</li>)}</ul>
}
