'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowUp, ArrowDown, MoreHorizontal, Eye, Pencil, Trash2, Download, Plus, Inbox } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export type Post = {
  id: number
  title: string
  body: string
  author: string
  tag: string
  status: 'published' | 'draft' | 'archived'
  views: number
  createdAt: Date
}

type SortKey = 'title' | 'author' | 'tag' | 'status' | 'views' | 'createdAt'

const STATUS_CFG = {
  published: { label: 'Published', variant: 'success' as const, dot: 'bg-emerald-500' },
  draft: { label: 'Draft', variant: 'muted' as const, dot: 'bg-amber-500' },
  archived: { label: 'Archived', variant: 'outline' as const, dot: 'bg-muted-foreground' },
}

const fmtDate = (d: Date) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function DropdownMenu({ trigger, children }: { trigger: React.ReactNode; children: (close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-1 min-w-[160px] rounded-md border border-border bg-popover shadow-md p-1">
            {children(() => setOpen(false))}
          </div>
        </>
      )}
    </div>
  )
}

function DropdownItem({ onClick, danger, children }: { onClick?: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn('w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center gap-2 hover:bg-muted/60', danger && 'text-red-600 hover:bg-red-500/10')}
    >
      {children}
    </button>
  )
}

export default function PostsTable({ posts: initialPosts }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tagFilter, setTagFilter] = useState('all')
  const [sortBy, setSortBy] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'createdAt', dir: 'desc' })
  const [page, setPage] = useState(0)
  const pageSize = 10

  const tags = useMemo(() => Array.from(new Set(posts.map((p) => p.tag))), [posts])

  const filtered = useMemo(() => {
    let r = posts
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') r = r.filter((p) => p.status === statusFilter)
    if (tagFilter !== 'all') r = r.filter((p) => p.tag === tagFilter)
    r = [...r].sort((a, b) => {
      const av = a[sortBy.key]
      const bv = b[sortBy.key]
      if (av < bv) return sortBy.dir === 'asc' ? -1 : 1
      if (av > bv) return sortBy.dir === 'asc' ? 1 : -1
      return 0
    })
    return r
  }, [posts, search, statusFilter, tagFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const toggleSort = (k: SortKey) =>
    setSortBy((s) => (s.key === k ? { key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' }))

  function SortHead({ k, children }: { k: SortKey; children: React.ReactNode }) {
    return (
      <th
        className="text-left px-3 py-2.5 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
        onClick={() => toggleSort(k)}
      >
        <span className="inline-flex items-center gap-1">
          {children}
          {sortBy.key === k && (sortBy.dir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
        </span>
      </th>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">Workspace articles, drafts and archived content.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Export</Button>
          <Button size="sm"><Plus className="h-3.5 w-3.5" />New post</Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search posts…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-[140px]">
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </Select>
          <Select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="w-[140px]">
            <option value="all">All tags</option>
            {tags.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <div className="ml-auto text-xs text-muted-foreground font-mono">{filtered.length} results</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground w-16">ID</th>
                <SortHead k="title">Title</SortHead>
                <SortHead k="author">Author</SortHead>
                <SortHead k="tag">Tag</SortHead>
                <SortHead k="status">Status</SortHead>
                <SortHead k="views">Views</SortHead>
                <SortHead k="createdAt">Date</SortHead>
                <th className="w-10 px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Inbox className="h-8 w-8 opacity-40" />
                      <div className="text-sm">No posts found</div>
                    </div>
                  </td>
                </tr>
              ) : (
                paged.map((p) => {
                  const s = STATUS_CFG[p.status]
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">#{p.id}</td>
                      <td className="px-3 py-3 max-w-[320px]">
                        <div className="font-medium truncate">{p.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{p.body}</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={p.author} size={22} />
                          <span className="text-sm truncate">{p.author}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="outline">{p.tag}</Badge>
                      </td>
                      <td className="px-3 py-3">
                        <div className="inline-flex items-center gap-1.5">
                          <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
                          <span className="text-xs">{s.label}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-xs">{p.views.toLocaleString()}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground font-mono">{fmtDate(p.createdAt)}</td>
                      <td className="px-3 py-3">
                        <DropdownMenu
                          trigger={
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          }
                        >
                          {(close) => (
                            <>
                              <DropdownItem onClick={() => { toast('Opened preview'); close() }}>
                                <Eye className="h-3.5 w-3.5" />Preview
                              </DropdownItem>
                              <DropdownItem onClick={() => { toast('Edit coming soon'); close() }}>
                                <Pencil className="h-3.5 w-3.5" />Edit
                              </DropdownItem>
                              <div className="h-px bg-border my-1" />
                              <DropdownItem
                                danger
                                onClick={() => { setPosts((ps) => ps.filter((x) => x.id !== p.id)); toast('Post deleted'); close() }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />Delete
                              </DropdownItem>
                            </>
                          )}
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{' '}
            <span className="font-mono">
              {filtered.length === 0 ? 0 : page * pageSize + 1}–{Math.min((page + 1) * pageSize, filtered.length)}
            </span>{' '}
            of <span className="font-mono">{filtered.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              ‹
            </Button>
            <div className="text-xs px-2 font-mono">{page + 1} / {totalPages}</div>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              ›
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
