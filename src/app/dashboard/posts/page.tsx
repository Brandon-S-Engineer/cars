import PostsTable from '@/components/dashboard/posts-table'

type Post = {
  id: number
  title: string
  body: string
  userId: number
}

export default async function PostsPage() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 3600 },
  })
  const posts: Post[] = await res.json()

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>Posts</h1>
      <p className='text-sm text-muted-foreground'>Datos consumidos desde API externa</p>
      <PostsTable posts={posts} />
    </div>
  )
}
