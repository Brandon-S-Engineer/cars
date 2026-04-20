import PostsTable, { type Post } from '@/components/dashboard/posts-table'

const TITLES = [
  'Q2 roadmap sync notes', 'Engineering onboarding guide', 'Incident report: api latency',
  'Design system v2 principles', 'Data retention policy update', 'Weekly product review',
  'Customer research findings', 'Infrastructure cost analysis', 'Security audit — action items',
  'Feature launch postmortem', 'Team offsite recap', 'Hiring plan draft',
  'Performance review template', 'Brand refresh proposal', 'Analytics migration plan',
  'Release notes — build 241', 'Mobile app rewrite RFC', 'Pricing experiment results',
  'Integration partner update', 'Customer success playbook',
]

const BODIES = [
  'Reviewed the upcoming quarter priorities with the team. Three major workstreams identified.',
  'Updated the process to reflect the new org structure. Slack channels and tooling changes attached.',
  'Full writeup of the mitigation steps and root cause. Follow-up actions assigned to on-call rotation.',
  'Shipped the new components after design review. Storybook and migration guide are live.',
  'Policy takes effect next month. Engineering and legal have signed off on the changes.',
  'Tracked progress against OKRs. Two items at risk, mitigation plan in the doc.',
]

const AUTHORS = [
  'Sofia Garcia', 'Mateo Rodriguez', 'Lucia Martinez', 'Diego Lopez',
  'Valentina Hernandez', 'Santiago Gonzalez',
]

const TAGS = ['engineering', 'product', 'design', 'ops', 'security', 'research']

function seededRng(seed: number) {
  let s = seed
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
}

function generatePosts(count = 36): Post[] {
  const rng = seededRng(7)
  const now = new Date('2026-04-18').getTime()
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: TITLES[Math.floor(rng() * TITLES.length)],
    body: BODIES[Math.floor(rng() * BODIES.length)],
    author: AUTHORS[Math.floor(rng() * AUTHORS.length)],
    tag: TAGS[Math.floor(rng() * TAGS.length)],
    status: (rng() < 0.7 ? 'published' : rng() < 0.5 ? 'draft' : 'archived') as Post['status'],
    views: Math.floor(rng() * 5000),
    createdAt: new Date(now - Math.floor(rng() * 90) * 86400000),
  }))
}

export default function PostsPage() {
  const posts = generatePosts()
  return <PostsTable posts={posts} />
}
