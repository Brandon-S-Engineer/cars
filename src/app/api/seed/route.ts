import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { email: 'admin@test.com', name: 'Admin', password: hashedPassword, role: 'ADMIN' },
  })

  const names = ['Sofia García', 'Carlos López', 'María Martínez', 'Juan Rodríguez', 'Ana Sánchez', 'Luis Hernández', 'Carmen Díaz', 'Pedro Morales']

  for (const name of names) {
    const email = `${name.split(' ')[0].toLowerCase()}@test.com`
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name, password: hashedPassword, role: 'USER' },
    })
  }

  return NextResponse.json({ ok: true })
}
