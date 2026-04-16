'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Shield, User, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type RecentUser = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
}

type Props = {
  userName: string
  totalUsers: number
  adminUsers: number
  regularUsers: number
  recentUsers: RecentUser[]
  chartData: { month: string; usuarios: number }[]
}

const stats = (total: number, admins: number, regular: number) => [
  {
    label: 'Total Usuarios',
    value: total,
    icon: Users,
    trend: '+12%',
    trendUp: true,
  },
  {
    label: 'Administradores',
    value: admins,
    icon: Shield,
    trend: '+2%',
    trendUp: true,
  },
  {
    label: 'Usuarios Regulares',
    value: regular,
    icon: User,
    trend: '+10%',
    trendUp: true,
  },
  {
    label: 'Crecimiento',
    value: '32%',
    icon: TrendingUp,
    trend: 'vs mes anterior',
    trendUp: true,
  },
]

export default function OverviewClient({ userName, totalUsers, adminUsers, regularUsers, recentUsers, chartData }: Props) {
  const cards = stats(totalUsers, adminUsers, regularUsers)

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-2xl font-semibold'>Good morning, {userName} 👋</h1>
        <p className='text-muted-foreground text-sm mt-1'>
          {new Date().toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label}>
              <CardContent className='pt-6'>
                <div className='flex items-start justify-between'>
                  <div>
                    <p className='text-sm text-muted-foreground'>{card.label}</p>
                    <p className='text-3xl font-bold mt-1'>{card.value}</p>
                    <p className={`text-xs mt-2 ${card.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>↑ {card.trend}</p>
                  </div>
                  <div className='bg-primary/10 p-2 rounded-md'>
                    <Icon className='h-5 w-5 text-primary' />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <Card className='col-span-2'>
          <CardHeader>
            <CardTitle className='text-base font-medium'>Actividad de usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width='100%'
              height={280}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  className='stroke-muted'
                />
                <XAxis
                  dataKey='month'
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='usuarios'
                  stroke='hsl(var(--primary))'
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-base font-medium'>Distribución</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 pt-2'>
            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span className='text-muted-foreground'>Administradores</span>
                <span className='font-medium'>{adminUsers}</span>
              </div>
              <div className='h-2 bg-muted rounded-full'>
                <div
                  className='h-2 bg-primary rounded-full'
                  style={{ width: `${totalUsers ? (adminUsers / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span className='text-muted-foreground'>Usuarios</span>
                <span className='font-medium'>{regularUsers}</span>
              </div>
              <div className='h-2 bg-muted rounded-full'>
                <div
                  className='h-2 bg-emerald-500 rounded-full'
                  style={{ width: `${totalUsers ? (regularUsers / totalUsers) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base font-medium'>Usuarios recientes</CardTitle>
            <a
              href='/dashboard/users'
              className='text-sm text-primary hover:underline'>
              Ver todos →
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b'>
                <th className='text-left pb-3 text-muted-foreground font-medium'>Nombre</th>
                <th className='text-left pb-3 text-muted-foreground font-medium'>Email</th>
                <th className='text-left pb-3 text-muted-foreground font-medium'>Rol</th>
                <th className='text-left pb-3 text-muted-foreground font-medium'>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr
                  key={user.id}
                  className='border-b last:border-0 hover:bg-muted/30 transition-colors'>
                  <td className='py-3 font-medium'>{user.name ?? '—'}</td>
                  <td className='py-3 text-muted-foreground'>{user.email}</td>
                  <td className='py-3'>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{user.role === 'ADMIN' ? 'Admin' : 'Usuario'}</span>
                  </td>
                  <td className='py-3 text-muted-foreground'>{new Date(user.createdAt).toLocaleDateString('es-MX')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
