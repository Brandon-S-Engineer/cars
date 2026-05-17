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

  const edithPassword = await bcrypt.hash('Eory2507', 10)
  await prisma.user.upsert({
    where: { email: 'edithia.07@gmail.com' },
    update: {},
    create: { email: 'edithia.07@gmail.com', name: 'Edith Soria', password: edithPassword, role: 'ADMIN' },
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

  const plantillas = [
    { orden: 1,  pregunta: '¿Qué documentos necesito para tramitar un crédito?', respuesta: 'Necesitas identificación oficial vigente (INE), comprobante de domicilio reciente (no mayor a 3 meses), comprobante de ingresos (últimas 3 nóminas o estados de cuenta) y RFC. Si eres independiente, presentas 6-12 estados de cuenta que muestren depósitos regulares.' },
    { orden: 2,  pregunta: '¿Cuánto es el enganche mínimo?', respuesta: 'El enganche mínimo es del 10% del valor del vehículo, aunque lo más recomendable es el 20-30% para obtener mejores condiciones y mensualidades más bajas. A mayor enganche, menor tasa de interés.' },
    { orden: 3,  pregunta: '¿Puedo comprar un auto si estoy en Buró de Crédito?', respuesta: 'Sí, es posible. Trabajamos con varias instituciones financieras y algunas tienen mayor flexibilidad. Puedes mejorar tus posibilidades aumentando el enganche o presentando un aval. Cada caso se evalúa individualmente.' },
    { orden: 4,  pregunta: '¿Puedo dar mi auto como parte de pago?', respuesta: 'Sí, podemos valuar tu auto y aplicarlo como parte del enganche. El valor depende del modelo, año, condición y kilometraje. Te damos el avalúo sin compromiso.' },
    { orden: 5,  pregunta: '¿Cuánto tiempo tarda la aprobación del crédito?', respuesta: 'Con la documentación completa, la aprobación tarda entre 24 y 48 horas hábiles. En algunos casos podemos agilizarlo el mismo día.' },
    { orden: 6,  pregunta: '¿Cuándo puedo recibir mi auto?', respuesta: 'Una vez aprobado el crédito y cubierto el enganche, coordinamos la entrega en 1 a 3 días hábiles. Si el auto está en existencia, puede ser incluso el mismo día de la firma.' },
    { orden: 7,  pregunta: '¿Cuáles son las tasas de interés?', respuesta: 'Las tasas van desde el 12.99% hasta el 26.65% anual dependiendo de tu perfil crediticio, el monto del enganche y el plazo elegido. Manejamos plazos de 36, 48, 60 y 72 meses.' },
    { orden: 8,  pregunta: '¿Qué incluye la mensualidad?', respuesta: 'La mensualidad incluye capital, intereses y seguros (vida y daños). No hay cargos ocultos; todo viene desglosado en tu contrato.' },
    { orden: 9,  pregunta: '¿Qué garantía tiene el auto?', respuesta: 'Todos los autos nuevos incluyen garantía de fábrica. Los vehículos Jeep, Ram y Dodge cuentan con 3 años o 100,000 km en garantía básica, lo que ocurra primero.' },
    { orden: 10, pregunta: '¿Puedo hacer pagos anticipados?', respuesta: 'Depende de la institución financiera. Algunas permiten pagos anticipados sin penalización; otras cobran una comisión. Te informamos las condiciones exactas del banco que te apruebe.' },
    { orden: 11, pregunta: '¿Qué pasa con las placas y el registro?', respuesta: 'Nosotros nos encargamos de todos los trámites de emplacamiento y facturación. Solo necesitas traer tu documentación completa el día de la entrega.' },
    { orden: 12, pregunta: '¿Qué modelos tienen disponibles?', respuesta: 'Contamos con inventario de Jeep, modelos mainstream y vehículos comerciales. Escríbeme qué modelo o tipo de auto te interesa y te digo disponibilidad, colores y precios actuales.' },
    { orden: 13, pregunta: '¿Tienen promociones o descuentos?', respuesta: 'Sí, manejamos precios especiales en modelos seleccionados y unidades demo. Dime qué auto te interesa y te digo si tiene precio de oferta vigente.' },
    { orden: 14, pregunta: '¿Hasta qué edad puedo solicitar crédito?', respuesta: 'Puedes solicitar crédito hasta los 69 años. A mayor edad, el plazo disponible puede ser más corto para que el crédito quede liquidado antes de cierta edad límite.' },
    { orden: 15, pregunta: '¿Necesito seguro además del crédito?', respuesta: 'El seguro de daños y la protección de vida del crédito son obligatorios y van incluidos en la mensualidad. No necesitas contratarlos por separado.' },
  ]

  for (const p of plantillas) {
    const exists = await prisma.plantilla.findFirst({ where: { pregunta: p.pregunta } })
    if (!exists) await prisma.plantilla.create({ data: p })
  }

  return NextResponse.json({ ok: true })
}
