import { prisma } from '@/lib/db';
import UsersTable from '@/components/dashboard/users-table';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className='space-y-4'>
      <h1 className='text-2xl font-semibold'>Users</h1>
      <UsersTable users={users} />
    </div>
  );
}
