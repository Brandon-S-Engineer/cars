'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  chartData: { date: string; usuarios: number }[];
};

export default function MetricsClient({ totalUsers, adminUsers, regularUsers, chartData }: Props) {
  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{adminUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{regularUsers}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Usuarios registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width='100%'
            height={300}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray='3 3'
                className='stroke-muted'
              />
              <XAxis
                dataKey='date'
                className='text-xs'
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className='text-xs'
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                }}
              />
              <Line
                type='monotone'
                dataKey='usuarios'
                stroke='hsl(var(--primary))'
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
