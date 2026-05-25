import { Categoria, ModeloFicha, merge } from './_shared'

// ─────────────────────────────────────────────────────────────────────────────
// PEUGEOT EXPERT 2026  —  SC Furgón (base) y FL Furgón (facelift con i-Cockpit)
// ─────────────────────────────────────────────────────────────────────────────

const EXPERT_SC_CATS: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                  valor: 'Turbo Diésel directo 2.0L (1,997 cc)' },
      { label: 'Potencia',               valor: '150 hp @ 4,000 rpm' },
      { label: 'Torque neto',            valor: '370 Nm @ 2,000 rpm' },
      { label: 'Combustible',            valor: 'Diésel' },
      { label: 'Transmisión',            valor: 'Manual 6 velocidades' },
      { label: 'Dirección',              valor: 'Asistencia Eléctrica' },
      { label: 'Suspensión delantera',   valor: 'Pseudo MacPherson reforzada' },
      { label: 'Suspensión trasera',     valor: 'Barra de torsión realzada' },
      { label: 'Frenos delanteros',      valor: 'Discos ventilados' },
      { label: 'Frenos traseros',        valor: 'Discos sólidos' },
      { label: 'Velocidad máxima',       valor: '170 km/h' },
      { label: 'Aceleración 0-100 km/h', valor: '10.6 s' },
      { label: 'Tanque de combustible',  valor: '70 litros' },
      { label: 'Consumo ciudad',         valor: '13.7 km/l' },
      { label: 'Consumo carretera',      valor: '19.2 km/l' },
      { label: 'Consumo combinado',      valor: '16.7 km/l' },
      { label: 'Emisiones CO₂',          valor: '146 g/km' },
    ],
  },
  {
    id: 'carga', nombre: 'Área de Carga', specs: [
      { label: 'Volumen de carga',       valor: '6.1 m³' },
      { label: 'Capacidad de carga',     valor: '1,400 kg' },
      { label: 'Largo área de carga',    valor: '2,862 mm' },
      { label: 'Ancho área de carga',    valor: '1,636 mm' },
      { label: 'Alto área de carga',     valor: '1,397 mm' },
      { label: 'Ganchos de sujeción',    valor: '8 en piso' },
      { label: 'Pared divisoria',        valor: 'Fija entre cabina y área de carga' },
      { label: 'Acceso lateral',         valor: 'Puerta corrediza' },
      { label: 'Acceso trasero',         valor: 'Puertas simétricas 50/50 apertura 180°' },
      { label: 'Peso vehicular',         valor: '1,665 kg' },
      { label: 'Peso bruto vehicular',   valor: '3,060 kg' },
    ],
  },
  {
    id: 'dimensiones', nombre: 'Dimensiones', specs: [
      { label: 'Largo total',            valor: '5,333 mm' },
      { label: 'Ancho con retrovisores', valor: '2,204 mm' },
      { label: 'Alto',                   valor: '1,935 – 1,940 mm' },
      { label: 'Neumáticos',             valor: '215/65/R16' },
      { label: 'Rines',                  valor: 'Acero de 16" con tapón central' },
      { label: 'Pasajeros',              valor: '3 (conductor + banca 2 personas)' },
      { label: 'Puertas',                valor: '5' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',              valor: 'Tela' },
      { label: 'A/C',                    valor: 'Manual' },
      { label: 'Asiento conductor',      valor: 'Individual con reposacabezas, descansabrazos y ajuste de altura/profundidad/inclinación' },
      { label: 'Asientos pasajeros',     valor: 'Banca delantera para 2 con reposacabezas y almacenamiento inferior' },
      { label: 'Pantalla',               valor: 'Táctil 5" monocromática' },
      { label: 'Clúster',                valor: 'Analógico' },
      { label: 'Audio',                  valor: 'Radio AM/FM con entrada USB' },
      { label: 'Toma de 12V',            valor: 'Sí' },
      { label: 'Cristales delanteros',   valor: 'Eléctricos One Touch Up & Down' },
      { label: 'Freno de estacionamiento', valor: 'Mecánico' },
      { label: 'Volante',                valor: 'Con control de audio, ajuste de altura y profundidad' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                  valor: 'Halógeno' },
      { label: 'Encendido automático',   valor: 'Sí (Pack Visibilidad)' },
      { label: 'Sensor de lluvia',       valor: 'Sí (Pack Visibilidad)' },
      { label: 'Espejos laterales',      valor: 'Con ajuste eléctrico' },
      { label: 'Tercera luz de freno',   valor: 'Sí' },
      { label: 'Color disponible',       valor: 'Blanco Icy' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'ABS',                       valor: 'Sí' },
      { label: 'ESP (Estabilidad)',          valor: 'Sí' },
      { label: 'ASR (Tracción)',             valor: 'Sí' },
      { label: 'Bolsas de aire',            valor: 'Frontales conductor y pasajero' },
      { label: 'AFU (Frenado urgencia)',    valor: 'Sí' },
      { label: 'Arranque en pendiente',     valor: 'Hill Assist Control' },
      { label: 'Control crucero',           valor: 'Sí + limitador de velocidad' },
      { label: 'Cámara de reversa',         valor: 'No incluida' },
      { label: 'Cierre centralizado auto.', valor: 'No incluido' },
      { label: 'Sensores estacionamiento',  valor: 'Traseros' },
      { label: 'Monitor presión llantas',   valor: 'Sí' },
      { label: 'Alerta atención conductor', valor: 'Sí' },
      { label: 'Desbloqueo en colisión',    valor: 'Automático' },
      { label: 'Placa protección motor',    valor: 'Sí' },
      { label: 'Llanta de refacción',       valor: 'Homogénea' },
    ],
  },
]

const EXPERT_FL_CATS: Categoria[] = merge(EXPERT_SC_CATS, {
  interior: {
    'Pantalla': 'Táctil 10" — Apple CarPlay® y Android Auto®',
    'Clúster':  'Digital 10"',
    'Audio':    'Radio AM/FM + USB + Conectividad inalámbrica',
  },
  seguridad: {
    'Cámara de reversa':         '180°',
    'Cierre centralizado auto.': 'Con bloqueo automático durante la conducción',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// PEUGEOT RIFTER 2026  —  dos motorizaciones, misma versión Allure Pack
// ─────────────────────────────────────────────────────────────────────────────

const RIFTER_PURETECH: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                  valor: 'PureTech 1.2L Turbo Gasolina (1,199 cc)' },
      { label: 'Potencia',               valor: '130 hp @ 5,500 rpm' },
      { label: 'Torque neto',            valor: '230 Nm @ 1,750 rpm' },
      { label: 'Combustible',            valor: 'Gasolina' },
      { label: 'Transmisión',            valor: 'Automática 8 velocidades' },
      { label: 'Dirección',              valor: 'Asistencia Eléctrica' },
      { label: 'Suspensión delantera',   valor: 'Pseudo MacPherson' },
      { label: 'Suspensión trasera',     valor: 'Barra de torsión' },
      { label: 'Frenos delanteros',      valor: 'Discos ventilados' },
      { label: 'Frenos traseros',        valor: 'Discos sólidos' },
      { label: 'Velocidad máxima',       valor: '185 km/h' },
      { label: 'Aceleración 0-100 km/h', valor: '12.5 s' },
      { label: 'Tanque de combustible',  valor: '60 litros' },
      { label: 'Consumo ciudad',         valor: '15.6 km/l' },
      { label: 'Consumo carretera',      valor: '19.2 km/l' },
      { label: 'Consumo combinado',      valor: '17.5 km/l' },
      { label: 'Emisiones CO₂',          valor: '129 g/km' },
      { label: 'Capacidad de arrastre',  valor: '950 kg' },
    ],
  },
  {
    id: 'dimensiones', nombre: 'Dimensiones y Capacidades', specs: [
      { label: 'Largo total',            valor: '4,755 mm' },
      { label: 'Ancho con retrovisores', valor: '2,107 mm' },
      { label: 'Alto',                   valor: '1,837 mm' },
      { label: 'Pasajeros',              valor: '7 (3 filas)' },
      { label: 'Puertas',                valor: '5' },
      { label: 'Neumáticos',             valor: '215/65/R16' },
      { label: 'Rines',                  valor: 'Aluminio 16" Taranaki' },
      { label: 'Volumen cajuela',        valor: '209 L (mín) / 4,000 L (máx)' },
      { label: 'Peso vehicular',         valor: '1,540 kg' },
      { label: 'Peso bruto vehicular',   valor: '2,280 kg' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',                    valor: 'Tela' },
      { label: 'A/C',                           valor: 'Automático Bi-Zona' },
      { label: 'Asiento conductor',            valor: 'Ajuste de altura, profundidad, inclinación y lumbar' },
      { label: 'Asiento pasajero',             valor: 'Retráctil, ajuste profundidad/inclinación, capacidad 50 kg' },
      { label: 'Asientos delanteros',          valor: 'Con descansabrazos y mesas tipo avión en respaldos' },
      { label: '2ª fila',                      valor: 'Individuales 3×1/3 con easybreak y reposacabezas' },
      { label: '3ª fila',                      valor: 'Plegables y desmontables con reposacabezas' },
      { label: 'Pantalla principal',           valor: 'Táctil 10" — Apple CarPlay® y Android Auto®' },
      { label: 'Clúster',                      valor: 'Digital 10" (Peugeot i-Cockpit®)' },
      { label: 'Volante',                      valor: 'Diámetro reducido, piel calefactable, ajuste alt./prof.' },
      { label: 'Paletas de cambio',            valor: 'Paddle Shifter' },
      { label: 'Selector velocidades',         valor: 'e-Toggle' },
      { label: 'Audio / conectividad',         valor: 'AM/FM + USB + Inalámbrico' },
      { label: 'Cristales del. y 2ª fila',     valor: 'Eléctricos One Touch Up' },
      { label: 'Cristales 3ª fila',            valor: 'Fijos' },
      { label: 'Freno de estacionamiento',     valor: 'Eléctrico' },
      { label: 'Consola central',              valor: 'Alta con A/C y USB para 2ª fila' },
      { label: 'Espejo retrovisor',            valor: 'Interior día/noche' },
      { label: 'Tomacorriente 12V',            valor: 'Sí' },
      { label: 'Ganchos cajuela',              valor: '4' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                  valor: 'LED' },
      { label: 'Faros antiniebla',       valor: 'Sí' },
      { label: 'Sensor de luz y lluvia', valor: 'Sí (Pack Visibilidad)' },
      { label: 'Acceso manos libres',    valor: 'Sí (con botón de encendido)' },
      { label: 'Espejos laterales',      valor: 'Calefactables, ajuste y plegado eléctrico' },
      { label: 'Puertas laterales',      valor: 'Corredizas derecha e izquierda' },
      { label: 'Puerta trasera',         valor: 'Tipo portón con medallón calefactable' },
      { label: 'Barras de techo',        valor: 'Sí' },
      { label: 'Cristales traseros',     valor: 'Tintados' },
      { label: 'Tercera luz de freno',   valor: 'Sí' },
      { label: 'Colores disponibles',    valor: 'Blanco Icy, Gris Artense, Azul Libeccio, Taranaki' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'ABS',                       valor: 'Sí' },
      { label: 'ESP + ASR',                 valor: 'Sí' },
      { label: 'Bolsas de aire',            valor: '6 (frontales + laterales + cortina)' },
      { label: 'AFU (Frenado urgencia)',     valor: 'Sí' },
      { label: 'Arranque en pendiente',     valor: 'Hill Assist Control' },
      { label: 'Control crucero',           valor: 'Sí + limitador de velocidad' },
      { label: 'Stop & Start',              valor: 'Sí' },
      { label: 'Cámara de reversa',         valor: 'Visión 180°' },
      { label: 'Sensores estacionamiento',  valor: 'Traseros' },
      { label: 'ISOFIX',                    valor: 'Sí' },
      { label: 'Seguro niños puertas lat.', valor: 'Eléctrico' },
      { label: 'Monitor presión llantas',   valor: 'Sí' },
      { label: 'Alerta atención conductor', valor: 'Sí' },
      { label: 'Placa protección motor',    valor: 'Sí' },
      { label: 'Llanta de refacción',       valor: 'Sí' },
    ],
  },
]

const RIFTER_HDI: Categoria[] = merge(RIFTER_PURETECH, {
  desempeno: {
    'Motor':                 '1.6L Turbo HDI Diésel (1,560 cc)',
    'Potencia':              '90 hp @ 4,000 rpm',
    'Torque neto':           '230 Nm @ 1,500 rpm',
    'Combustible':           'Diésel',
    'Transmisión':           'Manual 5 velocidades',
    'Velocidad máxima':      '162 km/h',
    'Aceleración 0-100 km/h':'17 s',
    'Tanque de combustible': '53 litros',
    'Consumo ciudad':        '18.2 km/l',
    'Consumo carretera':     '20.0 km/l',
    'Consumo combinado':     '19.6 km/l',
    'Emisiones CO₂':         '134 g/km',
    'Capacidad de arrastre': '850 kg',
  },
  dimensiones: {
    'Peso vehicular':       '1,522 kg',
    'Peso bruto vehicular': '2,260 kg',
  },
  interior: {
    'Paletas de cambio':  'No aplica (transmisión manual)',
    'Selector velocidades':'No aplica (transmisión manual)',
  },
  exterior: {
    'Acceso manos libres': 'No incluido',
  },
  seguridad: {
    'Stop & Start': 'No incluido',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// PEUGEOT MANAGER FL 2026  —  L2H2 (base) y L4H2 (carrocería larga)
// ─────────────────────────────────────────────────────────────────────────────

const MANAGER_FL_L2H2: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                  valor: '2.2L Turbo Diésel Euro VI' },
      { label: 'Potencia',               valor: '138 hp' },
      { label: 'Torque neto',            valor: '350 Nm @ 1,400 rpm' },
      { label: 'Combustible',            valor: 'Diésel' },
      { label: 'Transmisión',            valor: 'Manual 6 velocidades' },
      { label: 'Tracción',               valor: 'FWD' },
      { label: 'Dirección',              valor: 'Asistencia Eléctrica (EPS)' },
      { label: 'Suspensión delantera',   valor: 'McPherson' },
      { label: 'Suspensión trasera',     valor: 'Barra de torsión' },
      { label: 'Frenos delanteros',      valor: 'Discos' },
      { label: 'Frenos traseros',        valor: 'Discos' },
      { label: 'Velocidad máxima',       valor: '132 km/h' },
      { label: 'Tanque de combustible',  valor: '90 litros' },
      { label: 'Tanque AdBlue',          valor: '19 litros' },
    ],
  },
  {
    id: 'carga', nombre: 'Área de Carga', specs: [
      { label: 'Volumen de carga',       valor: '11.5 m³' },
      { label: 'Capacidad de carga',     valor: '1,850 kg' },
      { label: 'Ancho área de carga',    valor: '1,870 mm' },
      { label: 'Alto área de carga',     valor: '1,932 mm' },
    ],
  },
  {
    id: 'dimensiones', nombre: 'Dimensiones', specs: [
      { label: 'Largo total',            valor: '5,413 mm' },
      { label: 'Ancho total',            valor: '2,609 mm' },
      { label: 'Alto total',             valor: '2,524 mm' },
      { label: 'Peso vehicular',         valor: '2,010 kg' },
      { label: 'Peso bruto vehicular',   valor: '4,005 kg' },
      { label: 'Pasajeros',              valor: '2' },
      { label: 'Neumáticos',             valor: '215/75/R16' },
      { label: 'Rines',                  valor: 'Acero 16"' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',              valor: 'Tela' },
      { label: 'A/C',                    valor: 'Manual' },
      { label: 'Asiento conductor',      valor: 'Individual con ajuste manual' },
      { label: 'Asiento(s) pasajero',    valor: 'Individual con ajuste manual' },
      { label: 'Almacenamiento bajo asiento conductor', valor: 'No incluido' },
      { label: 'Freno de estacionamiento', valor: 'Mecánico' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                  valor: 'Halógeno' },
      { label: 'Espejos laterales',      valor: 'Con ajuste eléctrico' },
      { label: 'Señalizaciones laterales', valor: 'No incluidas' },
      { label: 'Color disponible',       valor: 'Blanco Icy' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'ABS',                    valor: 'Sí' },
      { label: 'ESP + ASR',              valor: 'Sí' },
      { label: 'Bolsas de aire',         valor: 'Frontales conductor y pasajero' },
      { label: 'Arranque en pendiente',  valor: 'Hill Assist Control' },
      { label: 'Control crucero',        valor: 'Sí + limitador de velocidad' },
      { label: 'Sensores estacionamiento', valor: 'Traseros' },
      { label: 'Monitor presión llantas', valor: 'Sí' },
      { label: 'Alerta atención conductor', valor: 'Sí' },
      { label: 'Placa protección motor', valor: 'Sí' },
    ],
  },
]

const MANAGER_FL_L4H2: Categoria[] = merge(MANAGER_FL_L2H2, {
  carga: {
    'Volumen de carga': '15 m³',
  },
  dimensiones: {
    'Largo total':    '6,363 mm',
    'Peso vehicular': '2,155 kg',
    'Pasajeros':      '3',
  },
  interior: {
    'Asiento(s) pasajero':  'Banca "Eat&Work" para 2 pasajeros',
    'Almacenamiento bajo asiento conductor': 'Sí',
  },
  exterior: {
    'Señalizaciones laterales': 'Sí',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// PEUGEOT PARTNER FL 2026  —  PureTech Maxi Pack / HDI Maxi / HDI Maxi Pack
// ─────────────────────────────────────────────────────────────────────────────

const PARTNER_FL_PURETECH: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                  valor: 'PureTech 1.2L Turbo Gasolina (1,199 cc)' },
      { label: 'Potencia',               valor: '110 hp @ 5,500 rpm' },
      { label: 'Torque neto',            valor: '205 Nm @ 1,750 rpm' },
      { label: 'Combustible',            valor: 'Gasolina' },
      { label: 'Transmisión',            valor: 'Manual 6 velocidades' },
      { label: 'Dirección',              valor: 'Asistencia Eléctrica' },
      { label: 'Suspensión delantera',   valor: 'Pseudo MacPherson' },
      { label: 'Suspensión trasera',     valor: 'Barra de torsión' },
      { label: 'Frenos delanteros',      valor: 'Discos ventilados' },
      { label: 'Frenos traseros',        valor: 'Discos sólidos' },
      { label: 'Velocidad máxima',       valor: '171 km/h' },
      { label: 'Aceleración 0-100 km/h', valor: '11.6 s' },
      { label: 'Tanque de combustible',  valor: '60 litros' },
      { label: 'Consumo ciudad',         valor: '15.0 km/l' },
      { label: 'Consumo carretera',      valor: '19.1 km/l' },
      { label: 'Consumo combinado',      valor: '17.4 km/l' },
      { label: 'Emisiones CO₂',          valor: '131.4 g/km' },
    ],
  },
  {
    id: 'carga', nombre: 'Área de Carga', specs: [
      { label: 'Volumen de carga',       valor: '3.9 – 4.4 m³' },
      { label: 'Capacidad de carga',     valor: '950 kg' },
      { label: 'Capacidad de arrastre',  valor: '850 kg' },
      { label: 'Largo área de carga',    valor: '2,167 – 3,440 mm' },
      { label: 'Ancho área de carga',    valor: '1,630 mm' },
      { label: 'Alto área de carga',     valor: '1,270 mm' },
      { label: 'Ganchos de sujeción',    valor: '6 en piso de área de carga' },
      { label: 'Piso área de carga',     valor: 'Cubierta plástica' },
      { label: 'Pared divisoria',        valor: 'Fija con escotilla de conexión cabina–carga' },
      { label: 'Iluminación de carga',   valor: 'Sí' },
      { label: 'Acceso lateral',         valor: 'Puerta corrediza' },
      { label: 'Acceso trasero',         valor: 'Puertas 60/40 apertura 180°, bisagras antirrobo' },
      { label: 'Peso vehicular',         valor: '1,389 kg' },
      { label: 'Peso bruto vehicular',   valor: '2,290 kg' },
    ],
  },
  {
    id: 'dimensiones', nombre: 'Dimensiones', specs: [
      { label: 'Largo total',            valor: '4,751 mm' },
      { label: 'Ancho con retrovisores', valor: '2,107 mm' },
      { label: 'Alto',                   valor: '1,860 mm' },
      { label: 'Pasajeros',              valor: '3' },
      { label: 'Puertas',                valor: '5' },
      { label: 'Neumáticos',             valor: '215/65/R16' },
      { label: 'Rines',                  valor: 'Acero 16" con tapón central' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',              valor: 'Tela' },
      { label: 'A/C',                    valor: 'Manual' },
      { label: 'Asiento conductor',      valor: 'Ajuste inclinación, altura y profundidad' },
      { label: 'Asiento central',        valor: 'Con almacenamiento inferior y cerradura; tableta de escritura giratoria en respaldo' },
      { label: 'Asiento pasajero',       valor: 'Modulable — permite conexión con área de carga' },
      { label: 'Pantalla principal',     valor: '10" — Apple CarPlay® y Android Auto®' },
      { label: 'Clúster',                valor: 'Panel de instrumentos elevado (i-Cockpit®)' },
      { label: 'Volante',                valor: 'Diámetro reducido con ajuste de altura y profundidad' },
      { label: 'Audio',                  valor: 'Radio AM/FM + USB + conectividad inalámbrica' },
      { label: 'Cristales delanteros',   valor: 'Eléctricos One Touch Up' },
      { label: 'Freno de estacionamiento', valor: 'Eléctrico' },
      { label: 'Consola superior',       valor: 'Portadocumentos' },
      { label: 'Toma de 12V',            valor: 'Sí (cabina)' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                  valor: 'Halógeno' },
      { label: 'Faros antiniebla',       valor: 'Sí' },
      { label: 'Sensor de luz y lluvia', valor: 'Sensor de luz y lluvia (Pack Visibilidad)' },
      { label: 'Espejos laterales',      valor: 'Calefactables, ajuste y plegado eléctrico' },
      { label: 'Pack Robustez',          valor: 'Sí (+30 mm realce, placa motor, Grip Control con Hill Assist Descent)' },
      { label: 'Colores disponibles',    valor: 'Blanco Icy, Gris Artense' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'ABS',                    valor: 'Sí' },
      { label: 'ESP + ASR',              valor: 'Sí' },
      { label: 'AFU (frenado urgencia)', valor: 'Sí' },
      { label: 'Stop & Start',           valor: 'Sí' },
      { label: 'Hill Assist Control',    valor: 'Sí' },
      { label: 'Control crucero',        valor: 'Sí + limitador de velocidad' },
      { label: 'Bolsas de aire',         valor: 'Frontales y laterales conductor y pasajero (4)' },
      { label: 'Cámara de reversa',      valor: 'Sí' },
      { label: 'Sensores estacionamiento', valor: 'Traseros' },
      { label: 'Monitor presión llantas', valor: 'Sí' },
      { label: 'Alerta atención conductor', valor: 'Sí' },
      { label: 'Placa protección motor', valor: 'Sí' },
      { label: 'Llanta de refacción',    valor: 'Homogénea' },
    ],
  },
]

const PARTNER_FL_HDI_MAXI: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                  valor: '1.6L Turbo HDI Diésel (1,560 cc)' },
      { label: 'Potencia',               valor: '90 hp @ 4,000 rpm' },
      { label: 'Torque neto',            valor: '230 Nm @ 1,500 rpm' },
      { label: 'Combustible',            valor: 'Diésel' },
      { label: 'Transmisión',            valor: 'Manual 5 velocidades' },
      { label: 'Dirección',              valor: 'Asistencia Eléctrica' },
      { label: 'Suspensión delantera',   valor: 'Pseudo MacPherson' },
      { label: 'Suspensión trasera',     valor: 'Barra de torsión' },
      { label: 'Frenos delanteros',      valor: 'Discos ventilados' },
      { label: 'Frenos traseros',        valor: 'Discos sólidos' },
      { label: 'Velocidad máxima',       valor: '160 km/h' },
      { label: 'Aceleración 0-100 km/h', valor: '13.5 s' },
      { label: 'Tanque de combustible',  valor: '53 litros' },
      { label: 'Consumo ciudad',         valor: '18.5 km/l' },
      { label: 'Consumo carretera',      valor: '20.8 km/l' },
      { label: 'Consumo combinado',      valor: '20.0 km/l' },
      { label: 'Emisiones CO₂',          valor: '130 g/km' },
    ],
  },
  {
    id: 'carga', nombre: 'Área de Carga', specs: [
      { label: 'Volumen de carga',       valor: '3.9 m³' },
      { label: 'Capacidad de carga',     valor: '950 kg' },
      { label: 'Capacidad de arrastre',  valor: '850 kg' },
      { label: 'Largo área de carga',    valor: '2,167 mm' },
      { label: 'Ancho área de carga',    valor: '1,630 mm' },
      { label: 'Alto área de carga',     valor: '1,200 – 1,270 mm' },
      { label: 'Ganchos de sujeción',    valor: '6 en piso de área de carga' },
      { label: 'Piso área de carga',     valor: 'Cubierta plástica' },
      { label: 'Pared divisoria',        valor: 'Fija (sin escotilla)' },
      { label: 'Iluminación de carga',   valor: 'Sí' },
      { label: 'Acceso lateral',         valor: 'Puerta corrediza' },
      { label: 'Acceso trasero',         valor: 'Puertas 60/40 apertura 180°, bisagras antirrobo' },
      { label: 'Peso vehicular',         valor: '1,369 kg' },
      { label: 'Peso bruto vehicular',   valor: '2,320 kg' },
    ],
  },
  {
    id: 'dimensiones', nombre: 'Dimensiones', specs: [
      { label: 'Largo total',            valor: '4,751 mm' },
      { label: 'Ancho con retrovisores', valor: '2,107 mm' },
      { label: 'Alto',                   valor: '1,820 mm' },
      { label: 'Pasajeros',              valor: '2' },
      { label: 'Puertas',                valor: '5' },
      { label: 'Neumáticos',             valor: '205/60/R16' },
      { label: 'Rines',                  valor: 'Acero 16" con tapón central' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',              valor: 'Tela' },
      { label: 'A/C',                    valor: 'Manual' },
      { label: 'Asiento conductor',      valor: 'Ajuste inclinación, altura y profundidad' },
      { label: 'Asiento central',        valor: 'No incluido' },
      { label: 'Asiento pasajero',       valor: 'Individual — ajuste inclinación y profundidad' },
      { label: 'Pantalla principal',     valor: '10" — Apple CarPlay® y Android Auto®' },
      { label: 'Clúster',                valor: 'Panel de instrumentos elevado (i-Cockpit®)' },
      { label: 'Volante',                valor: 'Diámetro reducido con ajuste de altura y profundidad' },
      { label: 'Audio',                  valor: 'Radio AM/FM + USB + conectividad inalámbrica' },
      { label: 'Cristales delanteros',   valor: 'Eléctricos' },
      { label: 'Freno de estacionamiento', valor: 'Mecánico' },
      { label: 'Consola superior',       valor: 'Portadocumentos' },
      { label: 'Toma de 12V',            valor: 'Sí (cabina)' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                  valor: 'Halógeno' },
      { label: 'Faros antiniebla',       valor: 'No incluidos' },
      { label: 'Sensor de luz y lluvia', valor: 'Solo sensor de luz (Pack Visibilidad)' },
      { label: 'Espejos laterales',      valor: 'Calefactables, ajuste eléctrico (sin plegado)' },
      { label: 'Pack Robustez',          valor: 'No incluido' },
      { label: 'Colores disponibles',    valor: 'Blanco Icy' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'ABS',                    valor: 'Sí' },
      { label: 'ESP + ASR',              valor: 'Sí' },
      { label: 'AFU (frenado urgencia)', valor: 'Sí' },
      { label: 'Stop & Start',           valor: 'No incluido' },
      { label: 'Hill Assist Control',    valor: 'Sí' },
      { label: 'Control crucero',        valor: 'Sí + limitador de velocidad' },
      { label: 'Bolsas de aire',         valor: 'Frontales y laterales conductor y pasajero (4)' },
      { label: 'Cámara de reversa',      valor: 'No incluida' },
      { label: 'Sensores estacionamiento', valor: 'Traseros' },
      { label: 'Monitor presión llantas', valor: 'Sí' },
      { label: 'Alerta atención conductor', valor: 'Sí' },
      { label: 'Placa protección motor', valor: 'Sí' },
      { label: 'Llanta de refacción',    valor: 'Homogénea' },
    ],
  },
]

const PARTNER_FL_HDI_MAXI_PACK: Categoria[] = merge(PARTNER_FL_HDI_MAXI, {
  desempeno: {
    'Aceleración 0-100 km/h': '13.9 s',
  },
  carga: {
    'Volumen de carga':    '3.9 – 4.4 m³',
    'Largo área de carga': '2,167 – 3,440 mm',
    'Alto área de carga':  '1,270 mm',
    'Pared divisoria':     'Fija con escotilla de conexión cabina–carga',
    'Peso vehicular':      '1,400 kg',
    'Peso bruto vehicular':'2,340 kg',
  },
  dimensiones: {
    'Alto':       '1,860 mm',
    'Pasajeros':  '3',
    'Neumáticos': '215/65/R16',
  },
  interior: {
    'Asiento central':          'Con almacenamiento inferior y cerradura; tableta de escritura giratoria en respaldo',
    'Asiento pasajero':         'Modulable — permite conexión con área de carga',
    'Cristales delanteros':     'Eléctricos One Touch Up',
    'Freno de estacionamiento': 'Eléctrico',
  },
  exterior: {
    'Faros antiniebla':       'Sí',
    'Sensor de luz y lluvia': 'Sensor de luz y lluvia (Pack Visibilidad)',
    'Espejos laterales':      'Calefactables, ajuste y plegado eléctrico',
    'Pack Robustez':          'Sí (+30 mm realce, placa motor, Grip Control con Hill Assist Descent)',
    'Colores disponibles':    'Blanco Icy, Gris Artense',
  },
  seguridad: {
    'Cámara de reversa': 'Sí',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// PEUGEOT PARTNER FL 2027  —  Maxi Pack (PureTech)
// ─────────────────────────────────────────────────────────────────────────────

const PARTNER_FL_2027_MAXI: Categoria[] = merge(PARTNER_FL_PURETECH, {
  exterior: { 'Colores disponibles': 'Blanco Icy' },
})

const PARTNER_FL_2027_HDI_MAXI_PACK: Categoria[] = merge(PARTNER_FL_HDI_MAXI_PACK, {
  carga:    { 'Alto área de carga':  '1,200 – 1,270 mm' },
  exterior: { 'Colores disponibles': 'Blanco Icy' },
})

// ─────────────────────────────────────────────────────────────────────────────
// PEUGEOT 2008 FL 2026  —  Allure Pack (base) y GT
// ─────────────────────────────────────────────────────────────────────────────

const P2008_ALLURE: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                  valor: 'PureTech 1.2L Turbo Gasolina (1,199 cc)' },
      { label: 'Potencia',               valor: '130 hp @ 5,500 rpm' },
      { label: 'Torque neto',            valor: '230 Nm @ 1,750 rpm' },
      { label: 'Combustible',            valor: 'Gasolina' },
      { label: 'Transmisión',            valor: 'Automática 6 velocidades (AT6)' },
      { label: 'Tracción',               valor: 'Delantera (FWD)' },
      { label: 'Dirección',              valor: 'Asistencia Eléctrica' },
      { label: 'Suspensión delantera',   valor: 'Pseudo MacPherson' },
      { label: 'Suspensión trasera',     valor: 'Barra de torsión' },
      { label: 'Frenos delanteros',      valor: 'Discos ventilados' },
      { label: 'Frenos traseros',        valor: 'Discos sólidos' },
      { label: 'Velocidad máxima',       valor: '199 km/h' },
      { label: 'Aceleración 0-100 km/h', valor: '10.2 s' },
      { label: 'Tanque de combustible',  valor: '44 litros' },
      { label: 'Consumo ciudad',         valor: '15.2 km/l' },
      { label: 'Consumo carretera',      valor: '20.9 km/l' },
      { label: 'Consumo combinado',      valor: '17.3 km/l' },
      { label: 'Emisiones CO₂',          valor: '130.4 g/km' },
    ],
  },
  {
    id: 'dimensiones', nombre: 'Dimensiones y Capacidades', specs: [
      { label: 'Largo',                  valor: '4,304 mm' },
      { label: 'Ancho con retrovisores', valor: '1,987 mm' },
      { label: 'Alto',                   valor: '1,523 – 1,550 mm' },
      { label: 'Pasajeros',              valor: '5' },
      { label: 'Puertas',                valor: '5' },
      { label: 'Neumáticos',             valor: '215/60 R17' },
      { label: 'Rines',                  valor: 'Aluminio 17" bi-tono' },
      { label: 'Cajuela',                valor: '434 / 1,467 L' },
      { label: 'Peso vehicular',         valor: '1,225 kg' },
      { label: 'Peso bruto vehicular',   valor: '1,730 kg' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',                  valor: 'Tela y piel' },
      { label: 'A/C',                        valor: 'Automático' },
      { label: 'Asiento conductor',          valor: 'Confort — ajuste manual de altura y profundidad' },
      { label: 'Asiento pasajero',           valor: 'Confort — ajuste manual de altura y profundidad' },
      { label: 'Asientos calefactables',     valor: 'No incluidos' },
      { label: 'Masaje conductor',           valor: 'No incluido' },
      { label: 'Cargador inalámbrico',       valor: 'Sí' },
      { label: 'Cristales',                  valor: 'Eléctricos delanteros y traseros One Touch, antipinzamiento' },
      { label: 'Espejo retrovisor',          valor: 'Electrocrómico' },
      { label: 'Freno de estacionamiento',   valor: 'Eléctrico' },
      { label: 'Pack Ambience LED',          valor: 'No incluido' },
      { label: 'Clúster',                    valor: 'Digital 10"' },
      { label: 'Pantalla',                   valor: '10" HD táctil' },
      { label: 'Audio',                      valor: 'AM/FM + conectividad inalámbrica + USB + Apple CarPlay® y Android Auto®' },
      { label: 'Volante',                    valor: 'Multifunción diámetro reducido, ajuste altura y profundidad' },
      { label: 'Toma de 12V',                valor: 'Sí' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                  valor: 'LED con sensor de luz y lluvia' },
      { label: 'Espejos laterales',      valor: 'Ajuste y plegado eléctrico' },
      { label: 'Acceso',                 valor: 'Manos libres con botón de encendido' },
      { label: 'Techo panorámico',       valor: 'Retráctil' },
      { label: 'Acabado techo',          valor: 'Estándar' },
      { label: 'Barras de techo',        valor: 'Negro brillante' },
      { label: 'Cristales traseros',     valor: 'Tintados' },
      { label: 'Colores disponibles',    valor: 'Blanco Okénite, Gris Artense, Gris Selenium, Rojo Elixir' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'ABS',                            valor: 'Sí' },
      { label: 'ESP',                            valor: 'Desconectable' },
      { label: 'AFU (frenado urgencia)',         valor: 'Sí' },
      { label: 'Grip Control',                   valor: '3 modos + Hill Assist Descent Control' },
      { label: 'Hill Assist',                    valor: 'Sí' },
      { label: 'Bolsas de aire',                 valor: '6 (frontales + laterales fila 1 + cortina)' },
      { label: 'Cámara de reversa',              valor: '180°' },
      { label: 'Monitoreo ángulos muertos',      valor: 'No incluido' },
      { label: 'Sensores estacionamiento',       valor: 'Delanteros y traseros' },
      { label: 'Cierre centralizado auto.',      valor: 'Con bloqueo automático durante la conducción' },
      { label: 'Control crucero',                valor: 'Sí + limitador de velocidad' },
      { label: 'ISOFIX',                         valor: '3 puntos de sujeción' },
      { label: 'Monitor presión neumáticos',     valor: 'Sí' },
      { label: 'Llanta de refacción',            valor: '16"' },
      { label: 'ADAS — Atención conductor',      valor: 'Sí' },
      { label: 'ADAS — Colisión frontal',        valor: 'No incluida' },
      { label: 'ADAS — Asistencia de carril',    valor: 'Sí' },
      { label: 'ADAS — Reconocimiento señales',  valor: 'Sí' },
      { label: 'ADAS — Luces automáticas',       valor: 'Sí' },
    ],
  },
]

const P2008_GT: Categoria[] = merge(P2008_ALLURE, {
  interior: {
    'Tapicería':              'Alcántara',
    'Asiento conductor':      'Dynamic alcántara calefactable con ajuste eléctrico',
    'Asiento pasajero':       'Dynamic alcántara con ajuste manual',
    'Asientos calefactables': 'Sí (conductor)',
    'Masaje conductor':       'Sí',
    'Pack Ambience LED':      'Sí (8 colores)',
    'Clúster':                '3D "Quartz" con efecto holográfico',
  },
  exterior: {
    'Faros':          'FULL LED con sensor de luz y lluvia',
    'Acabado techo':  '"Black Diamond"',
  },
  seguridad: {
    'Cámara de reversa':        '360°',
    'Monitoreo ángulos muertos':'Sí',
    'ADAS — Colisión frontal':  'Sí + frenado de emergencia',
  },
})

export const MODELOS_PEUGEOT: ModeloFicha[] = [
  {
    id: 'expert-2026',
    marca: 'Peugeot',
    modelo: 'Expert',
    año: 2026,
    versiones: [
      { id: 'furgon-sc', nombre: 'SC Furgón', categorias: EXPERT_SC_CATS },
      { id: 'furgon-fl', nombre: 'FL Furgón', categorias: EXPERT_FL_CATS },
    ],
  },
  {
    id: 'rifter-2026',
    marca: 'Peugeot',
    modelo: 'Rifter',
    año: 2026,
    versiones: [
      { id: 'puretech-gasolina', nombre: 'PureTech (Gasolina)',  categorias: RIFTER_PURETECH },
      { id: 'hdi-diesel',        nombre: 'HDI (Diésel)',         categorias: RIFTER_HDI },
    ],
  },
  {
  id: 'partner-rapid-2026',
  marca: 'Peugeot',
  modelo: 'Partner Rapid',
  año: 2026,
  versiones: [
    {
      id: 'partner-rapid',
      nombre: 'Partner Rapid',
      categorias: [
        {
          id: 'desempeno', nombre: 'Desempeño', specs: [
            { label: 'Motor',                  valor: 'FireFly 1.3L Gasolina (1,332 cc)' },
            { label: 'Potencia',               valor: '97 hp @ 6,000 rpm' },
            { label: 'Torque neto',            valor: '129 Nm @ 4,250 rpm' },
            { label: 'Transmisión',            valor: 'Manual 5 velocidades' },
            { label: 'Dirección',              valor: 'Hidráulica' },
            { label: 'Suspensión delantera',   valor: 'McPherson' },
            { label: 'Suspensión trasera',     valor: 'Eje rígido' },
            { label: 'Frenos delanteros',      valor: 'Disco ventilado' },
            { label: 'Frenos traseros',        valor: 'Tambor' },
            { label: 'Velocidad máxima',       valor: '163 km/h' },
            { label: 'Tanque de combustible',  valor: '55 litros' },
            { label: 'Consumo ciudad',         valor: '15.12 km/l' },
            { label: 'Consumo carretera',      valor: '21.13 km/l' },
            { label: 'Consumo combinado',      valor: '17.34 km/l' },
            { label: 'Emisiones CO₂',          valor: '135.4 g/km' },
          ],
        },
        {
          id: 'carga', nombre: 'Área de Carga', specs: [
            { label: 'Volumen de carga',       valor: '3.3 m³' },
            { label: 'Capacidad de carga',     valor: '650 kg' },
            { label: 'Capacidad de arrastre',  valor: '400 kg' },
            { label: 'Largo área de carga',    valor: '1,868 mm' },
            { label: 'Ancho área de carga',    valor: '1,324 mm' },
            { label: 'Alto área de carga',     valor: '1,368 mm' },
            { label: 'Ganchos de sujeción',    valor: '4 en área de carga' },
            { label: 'Pared divisoria',        valor: 'Fija entre cabina y área de carga' },
            { label: 'Iluminación de carga',   valor: 'Sí' },
            { label: 'Acceso trasero',         valor: 'Puertas 60/40 con apertura 180° y cerradura' },
            { label: 'Peso vehicular',         valor: '1,151 kg' },
            { label: 'Peso bruto vehicular',   valor: '1,801 kg' },
          ],
        },
        {
          id: 'dimensiones', nombre: 'Dimensiones', specs: [
            { label: 'Largo total',            valor: '4,407 mm' },
            { label: 'Ancho con retrovisores', valor: '1,885 mm' },
            { label: 'Alto',                   valor: '1,900 mm' },
            { label: 'Pasajeros',              valor: '2 (conductor + 1)' },
            { label: 'Puertas',                valor: '4' },
            { label: 'Neumáticos',             valor: '175/70/R14' },
            { label: 'Rines',                  valor: 'Acero 14" con embellecedores' },
            { label: 'Color disponible',       valor: 'Blanco Banquise' },
          ],
        },
        {
          id: 'interior', nombre: 'Interior', specs: [
            { label: 'Tapicería',              valor: 'Tela' },
            { label: 'A/C',                    valor: 'Manual' },
            { label: 'Asiento conductor',      valor: 'Ajuste de altura, inclinación y profundidad' },
            { label: 'Asiento pasajero',       valor: 'Ajuste de inclinación y profundidad' },
            { label: 'Cristales delanteros',   valor: 'Eléctricos (one touch para conductor)' },
            { label: 'Freno de estacionamiento', valor: 'Mecánico' },
            { label: 'Almacenamiento',         valor: 'Consola central + guantera superior abierta + guantera inferior cerrada' },
            { label: 'Audio',                  valor: 'Pre-acondicionamiento radio, 4 bocinas y antena' },
            { label: 'Toma de 12V',            valor: 'Sí (cabina)' },
            { label: 'Volante',                valor: 'Con ajuste de altura' },
          ],
        },
        {
          id: 'exterior', nombre: 'Exterior', specs: [
            { label: 'Faros',                  valor: 'Halógeno con función "follow me home"' },
            { label: 'Faros antiniebla',       valor: 'Sí' },
            { label: 'Espejos laterales',      valor: 'Con ajuste eléctrico' },
            { label: 'Tercera luz de freno',   valor: 'Sí' },
          ],
        },
        {
          id: 'seguridad', nombre: 'Seguridad', specs: [
            { label: 'ABS',                    valor: 'Sí' },
            { label: 'ESP + ASR',              valor: 'Sí' },
            { label: 'Bolsas de aire',         valor: 'Frontales conductor y pasajero' },
            { label: 'Arranque en pendiente',  valor: 'Hill Assist Control' },
            { label: 'ESS (freno emergencia)', valor: 'Señal de luces de frenado de emergencia' },
            { label: 'Sensores estacionamiento', valor: 'Traseros' },
            { label: 'Monitor presión llantas', valor: 'Sí' },
            { label: 'Alarma antirrobo',       valor: 'Perimétrica' },
            { label: 'Placa protección motor', valor: 'Sí' },
            { label: 'Llanta de refacción',    valor: 'Sí' },
          ],
        },
      ],
    },
  ],
  },
  {
    id: 'manager-fl-2026',
    marca: 'Peugeot',
    modelo: 'Manager FL',
    año: 2026,
    versiones: [
      { id: 'l2h2', nombre: 'L2H2', categorias: MANAGER_FL_L2H2 },
      { id: 'l4h2', nombre: 'L4H2', categorias: MANAGER_FL_L4H2 },
    ],
  },
  {
    id: 'partner-fl-2026',
    marca: 'Peugeot',
    modelo: 'Partner FL',
    año: 2026,
    versiones: [
      { id: 'puretech-maxi-pack', nombre: 'PureTech Maxi Pack', categorias: PARTNER_FL_PURETECH },
      { id: 'hdi-maxi',           nombre: 'HDI Maxi',           categorias: PARTNER_FL_HDI_MAXI },
      { id: 'hdi-maxi-pack',      nombre: 'HDI Maxi Pack',      categorias: PARTNER_FL_HDI_MAXI_PACK },
    ],
  },
  {
    id: 'partner-fl-2027',
    marca: 'Peugeot',
    modelo: 'Partner FL',
    año: 2027,
    versiones: [
      { id: 'maxi-pack',     nombre: 'Maxi Pack',     categorias: PARTNER_FL_2027_MAXI          },
      { id: 'hdi-maxi-pack', nombre: 'HDI Maxi Pack', categorias: PARTNER_FL_2027_HDI_MAXI_PACK },
    ],
  },
  {
    id: 'rifter-2027',
    marca: 'Peugeot',
    modelo: 'Rifter',
    año: 2027,
    versiones: [
      { id: 'puretech-gasolina', nombre: 'PureTech (Gasolina)', categorias: RIFTER_PURETECH },
      { id: 'hdi-diesel',        nombre: 'HDI (Diésel)',        categorias: RIFTER_HDI       },
    ],
  },
  {
    id: '2008-fl-2026',
    marca: 'Peugeot',
    modelo: '2008 FL',
    año: 2026,
    versiones: [
      { id: 'allure-pack', nombre: 'Allure Pack', categorias: P2008_ALLURE },
      { id: 'gt',          nombre: 'GT',          categorias: P2008_GT },
    ],
  },
]
