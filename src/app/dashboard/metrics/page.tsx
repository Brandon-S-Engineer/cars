import { prisma } from '@/lib/db';
import MetricsClient from '@/components/dashboard/metrics-client';

export default async function MetricsPage() {
  const totalUsers = await prisma.user.count();
  const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } });
  const regularUsers = await prisma.user.count({ where: { role: 'USER' } });

  const usersPerDay = await prisma.user.groupBy({
    by: ['createdAt'],
    _count: { id: true },
    orderBy: { createdAt: 'asc' },
    take: 7,
  });

  const chartData = usersPerDay.map((entry) => ({
    date: new Date(entry.createdAt).toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
    }),
    usuarios: entry._count.id,
  }));

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>Metrics</h1>
      <MetricsClient
        totalUsers={totalUsers}
        adminUsers={adminUsers}
        regularUsers={regularUsers}
        chartData={chartData}
      />
    </div>
  );
}
