export type Spec = { label: string; valor: string }
export type Categoria = { id: string; nombre: string; specs: Spec[] }
export type Version = { id: string; nombre: string; categorias: Categoria[] }
export type ModeloFicha = { id: string; modelo: string; año: number; versiones: Version[] }

// ── Helpers ───────────────────────────────────────────────────────────────────

// Merges base categorías with per-category per-label overrides, then appends
// any extra specs listed in `extras` for each category.
function merge(
  base: Categoria[],
  overrides: Record<string, Record<string, string>>,
  extras: Record<string, Spec[]> = {},
): Categoria[] {
  return base.map((cat) => {
    const ov = overrides[cat.id] ?? {}
    const ex = extras[cat.id] ?? []
    const updated = cat.specs.map((s) => ({ label: s.label, valor: ov[s.label] ?? s.valor }))
    return { ...cat, specs: [...updated, ...ex] }
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// JEEP GRAND CHEROKEE 2026
// ─────────────────────────────────────────────────────────────────────────────

const GC_BASE: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                        valor: 'Hurricane Turbo W/ESS' },
      { label: 'Potencia',                     valor: '324 hp' },
      { label: 'Torque',                       valor: '332 lb-pie' },
      { label: 'Transmisión',                  valor: 'Automática 8 vel. 8HP80' },
      { label: 'Tracción',                     valor: '4X2 (FWD)' },
      { label: 'Sistema Selec-Terrain®',       valor: 'No incluido' },
      { label: 'Suspensión delantera',         valor: 'Independiente' },
      { label: 'Suspensión trasera',           valor: 'Independiente multilink' },
      { label: 'Suspensión neumática',         valor: 'No incluida' },
      { label: 'Diferencial frontal',          valor: 'No aplica (4X2)' },
      { label: 'Diferencial trasero (LSD)',    valor: 'No incluido' },
      { label: 'Receptor de remolque',         valor: 'No incluido' },
      { label: 'Dirección',                    valor: 'Eléctrica' },
      { label: 'Diámetro de giro',             valor: '11.3 m' },
      { label: 'Peso bruto vehicular',         valor: '2,744 kg' },
      { label: 'Capacidad de carga',           valor: '476 kg' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Pasajeros',                     valor: '5' },
      { label: 'Filas de asientos',             valor: '2' },
      { label: 'Tapicería',                     valor: 'Leatherette y gamuza' },
      { label: 'Techo interior',                valor: 'Negro' },
      { label: 'Asientos delanteros calef.',    valor: 'Sí' },
      { label: 'Asientos delanteros ventilados',valor: 'No incluidos' },
      { label: 'Asientos delanteros con masaje',valor: 'No incluidos' },
      { label: 'Ajuste asiento conductor',      valor: 'Eléctrico 8 vías' },
      { label: 'Memoria asiento conductor',     valor: 'No incluida' },
      { label: 'Ajuste asiento pasajero',       valor: 'Manual 4 vías' },
      { label: 'Memoria asiento pasajero',      valor: 'No incluida' },
      { label: 'Segunda fila',                  valor: '60/40 plegable' },
      { label: 'Segunda fila calefactable',     valor: 'No incluida' },
      { label: 'Segunda fila ventilada',        valor: 'No incluida' },
      { label: 'Segunda fila cortinillas',      valor: 'No incluidas' },
      { label: 'Tercera fila',                  valor: 'No incluida' },
      { label: 'Pantalla principal',            valor: 'Uconnect® 5 — 12.3" táctil' },
      { label: 'Clúster',                       valor: '10.25" TFT a color' },
      { label: 'Head-Up Display',               valor: 'No incluido' },
      { label: 'Pantalla interactiva pasajero', valor: 'No incluida' },
      { label: 'Visualiz. de mapas en clúster', valor: 'No incluida' },
      { label: 'Audio',                         valor: '6 altavoces premium' },
      { label: 'Amplificador',                  valor: 'No especificado' },
      { label: 'Supresión activa de ruido',     valor: 'Sí' },
      { label: 'Apple CarPlay / Android Auto',  valor: 'Sí' },
      { label: 'Iluminación ambiental',         valor: 'No incluida' },
      { label: 'Iluminación cortesía puertas',  valor: 'No incluida' },
      { label: 'Puerto USB 2ª fila',            valor: 'Sí' },
      { label: 'Puerto USB 3ª fila',            valor: 'No aplica' },
      { label: 'Espejo retrovisor interior',    valor: 'Estándar' },
      { label: 'Columna dirección con memoria', valor: 'No incluida' },
      { label: 'Control apertura de garage',    valor: 'No incluido' },
      { label: 'Aire acondicionado',            valor: 'Automático doble zona' },
      { label: 'Volante',                       valor: 'Tecnopiel' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Neumáticos',            valor: '265/50R20 Performance A/S' },
      { label: 'Rines',                 valor: 'Aluminio 20×8.5 negro brillante' },
      { label: 'Quemacocos',            valor: 'Eléctrico' },
      { label: 'Techo panorámico',      valor: 'No incluido' },
      { label: 'Exterior bitono',       valor: 'No' },
      { label: 'Luces delanteras',      valor: 'LED automáticas' },
      { label: 'Faros de niebla',       valor: 'No incluidos' },
      { label: 'Luces traseras',        valor: 'LED' },
      { label: 'Espejos plegado',       valor: 'Manual' },
      { label: 'Espejos señalización',  valor: 'No incluida' },
      { label: 'Maletero',              valor: 'Apertura eléctrica' },
      { label: 'Rieles en techo',       valor: 'Negro brillante' },
      { label: 'Longitud',              valor: '4,915 mm' },
      { label: 'Ancho sin espejos',     valor: '1,969 mm' },
      { label: 'Altura',                valor: '1,798 mm' },
      { label: 'Distancia entre ejes',  valor: '2,964 mm' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'Frenos ABS 4 ruedas',           valor: 'Sí' },
      { label: 'Control de estabilidad',         valor: 'Sí' },
      { label: 'Crucero adaptativo (ACC)',        valor: 'Con Stop & Go' },
      { label: 'Detección colisión frontal',     valor: 'Plus' },
      { label: 'Asistencia en intersección',     valor: 'Sí' },
      { label: 'Frenado peatones/ciclistas',     valor: 'Sí' },
      { label: 'Punto ciego y ruta transversal', valor: 'Sí' },
      { label: 'Visión envolvente 360°',         valor: 'No incluida' },
      { label: 'Advertencia distancia lateral',  valor: 'No incluida' },
      { label: 'Cámara Off-Road integrada',      valor: 'No incluida' },
      { label: 'Visión nocturna',                valor: 'No incluida' },
      { label: 'Asistencia de carril',           valor: 'Sí' },
      { label: 'Reconocimiento de señales',      valor: 'Sí' },
      { label: 'Control descenso en pendientes', valor: 'No incluido' },
      { label: 'Detección de fatiga',            valor: 'No incluida' },
      { label: 'Sensores de estacionamiento',    valor: 'Traseros con función stop' },
      { label: 'Autoestacionamiento',            valor: 'No incluido' },
      { label: 'Acceso pasivo (keyless)',         valor: 'Puertas frontales' },
      { label: 'Freno de estacionamiento',       valor: 'Eléctrico' },
      { label: 'Arranque en pendiente (HSA)',    valor: 'Sí' },
      { label: 'Bolsas de aire',                 valor: '8 (frontales + rodillas + laterales + cortina)' },
      { label: 'Monitor presión neumáticos',     valor: 'Sí' },
      { label: 'Alarma',                         valor: 'Sí' },
    ],
  },
]

const GC_LIMITED: Categoria[] = merge(GC_BASE, {
  desempeno: {
    'Tracción':                  'Quadra-Trac I® (4X4)',
    'Sistema Selec-Terrain®':    'Sí',
    'Diferencial frontal':       'Convencional con eje desconectable',
  },
  interior: {
    'Tapicería':                     'Piel Nappa',
    'Asientos delanteros ventilados':'Sí',
    'Ajuste asiento conductor':      'Eléctrico 8 vías',
    'Memoria asiento conductor':     'Sí',
    'Ajuste asiento pasajero':       'Eléctrico 8 vías',
    'Segunda fila calefactable':     'Sí',
    'Audio':                         '9 altavoces + subwoofer',
    'Amplificador':                  '506 W',
    'Iluminación ambiental':         'LED',
    'Espejo retrovisor interior':    'Electrocrómico digital',
    'Columna dirección con memoria': 'Sí',
    'Control apertura de garage':    'Sí',
  },
  exterior: {
    'Rines':                '20×8.5 negro (diseño Overland)',
    'Techo panorámico':     'Doble panel panorámico',
    'Faros de niebla':      'LED frontales',
    'Espejos señalización': 'Sí',
  },
  seguridad: {
    'Visión envolvente 360°':        'Sistema de visión envolvente 360°',
    'Advertencia distancia lateral': 'Sí',
    'Cámara Off-Road integrada':     'Sí',
    'Sensores de estacionamiento':   'Delanteros y traseros con función stop',
    'Acceso pasivo (keyless)':       '4 puertas y maletero',
  },
})

const GC_LIMITED_L: Categoria[] = merge(GC_LIMITED, {
  interior: {
    'Pasajeros':              '7',
    'Filas de asientos':      '3',
    'Tercera fila':           '50/50 plegable manualmente',
    'Puerto USB 3ª fila':     'Sí',
    'Head-Up Display':        'Sí',
    'Aire acondicionado':     'Automático 3 zonas',
  },
  seguridad: {
    'Visión nocturna': 'Con detección de peatones y animales',
  },
})

const GC_SUMMIT: Categoria[] = merge(GC_LIMITED_L, {
  desempeno: {
    'Tracción':                 'Quadra-Trac II® (4X4 tiempo completo)',
    'Diferencial trasero (LSD)':'Con limitador de deslizamiento',
    'Receptor de remolque':     'Clase IV (cableado 7 y 4 pines)',
    'Suspensión neumática':     'Quadra-Lift® neumática',
  },
  interior: {
    'Tapicería':                     'Piel Palermo',
    'Asientos delanteros con masaje':'Sí',
    'Ajuste asiento conductor':      'Eléctrico 12 vías',
    'Ajuste asiento pasajero':       'Eléctrico 12 vías',
    'Memoria asiento pasajero':      'Sí',
    'Segunda fila ventilada':        'Sí',
    'Segunda fila cortinillas':      'Manuales',
    'Audio':                         '19 altavoces premium',
    'Amplificador':                  '950 W',
    'Iluminación ambiental':         'LED multicolor',
    'Iluminación cortesía puertas':  'Sí',
    'Pantalla interactiva pasajero': 'Sí',
    'Visualiz. de mapas en clúster': 'Sí',
    'Aire acondicionado':            'Automático 4 zonas',
    'Volante':                       'Piel',
  },
  exterior: {
    'Neumáticos':      '275/45R21XL All Season',
    'Rines':           '21×9.0 maquinados',
    'Exterior bitono': 'Sí',
    'Espejos plegado': 'Eléctrico',
    'Maletero':        'Eléctrico con manos libres (pie)',
  },
  seguridad: {
    'Control descenso en pendientes': 'Sí',
    'Detección de fatiga':            'Sí',
    'Autoestacionamiento':            'Paralelo y perpendicular con función stop',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// JEEP COMMANDER OVERLAND  2025 / 2026
// ─────────────────────────────────────────────────────────────────────────────

const COMMANDER_BASE_CATS = (v: '2025' | '2026'): Categoria[] => [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                  valor: v === '2025' ? 'Turbo 1.3L 4 cilindros con Start & Stop' : '1.3 L Turbo' },
      { label: 'Potencia',               valor: '173 hp @ 5,750 rpm' },
      { label: 'Torque',                 valor: '199 lb-ft @ 1,850 rpm' },
      { label: 'Transmisión',            valor: v === '2025' ? 'Automática 6 vel. AutoStick®' : 'Automática 6 vel. Aisin Gen3 + paletas' },
      { label: 'Tracción',               valor: 'FWD' },
      { label: 'Suspensión',             valor: 'McPherson delantera y trasera' },
      { label: 'Capacidad de carga',     valor: v === '2025' ? '400 kg' : '540 kg' },
      { label: 'Capacidad de arrastre',  valor: '400 kg' },
      { label: 'Peso bruto vehicular',   valor: '2,255 kg' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',               valor: v === '2025' ? 'Piel Nappa Premium y gamuza café' : 'Piel Brown Commander' },
      { label: 'Pasajeros',               valor: '7' },
      { label: 'Asientos delanteros',     valor: v === '2025' ? 'Eléctricos 8 vías' : 'Eléctricos 8 vías con memoria' },
      { label: 'Pantalla principal',      valor: v === '2025' ? 'Uconnect® 10.1" + Clúster 10.25"' : 'Infoentretenimiento 10.1"' },
      { label: 'Audio',                   valor: v === '2025' ? 'Harman Kardon® 9 bocinas + Subwoofer' : 'Sistema de audio premium' },
      { label: 'Carga inalámbrica',       valor: 'Sí' },
      { label: 'Quemacocos',              valor: v === '2025' ? 'Dual panorámico CommandView®' : 'Eléctrico' },
      { label: 'Apple CarPlay / Android Auto', valor: v === '2025' ? 'Inalámbrico' : 'No especificado' },
      { label: 'Aire acondicionado',      valor: v === '2025' ? 'Automático bizona' : 'Sistema de A/C' },
      { label: 'Cajuela',                 valor: v === '2025' ? '661 L + hasta 1,760 L (filas abatidas)' : '661 L' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Rines',                valor: v === '2025' ? 'Aluminio 19" Pirelli 235/50 R19' : 'Overland 19" — 235/50 R19' },
      { label: 'Techo',                valor: 'Bitono negro' },
      { label: 'Maletero',             valor: v === '2025' ? 'Eléctrico con manos libres (pie)' : 'Eléctrico con manos libres' },
      { label: 'Luces delanteras',     valor: 'LED automáticas' },
      { label: 'Luces traseras',       valor: 'LED' },
      { label: 'Faros de niebla',      valor: 'LED' },
      { label: 'Longitud',             valor: '4,769 mm' },
      { label: 'Ancho sin espejos',    valor: '1,859 mm' },
      { label: 'Altura',               valor: '1,685 mm' },
      { label: 'Distancia entre ejes', valor: '2,794 mm' },
      { label: 'Colores exteriores',   valor: v === '2025' ? 'Negro carbón, Plata martillado, Blanco polar, Gris granito, Slash gold' : 'Negro, Plata metálico, Granito cristal, Slash gold' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'Frenos ABS',                    valor: 'Sí' },
      { label: 'Control de estabilidad',         valor: v === '2025' ? 'ESC' : 'VDC' },
      { label: 'Crucero adaptativo (ACC)',        valor: v === '2025' ? 'Con Stop & Go' : 'Sí' },
      { label: 'Punto ciego',                    valor: v === '2025' ? 'BSCPD (con ruta transversal de reversa)' : 'Monitoreo de punto ciego' },
      { label: 'Visión 360°',                    valor: v === '2025' ? 'No incluida' : 'Sistema de visión 360°' },
      { label: 'Asistencia de carril',           valor: v === '2025' ? 'Lane Departure Plus' : 'Asistencia de mantenimiento y cambio de carril' },
      { label: 'Reconocimiento de señales',      valor: v === '2025' ? 'Sí' : 'Sí' },
      { label: 'Detección colisión frontal',     valor: v === '2025' ? 'Plus (con peatones y ciclistas)' : 'Plus FWD' },
      { label: 'Control tracción All Speed',     valor: v === '2025' ? 'Sí' : 'Sí + TC+' },
      { label: 'Freno Hill Holder',              valor: v === '2025' ? 'HSA' : 'Hill Holder + Auto Hold' },
      { label: 'Limitador de velocidad activo',  valor: v === '2025' ? 'No especificado' : 'Sí' },
      { label: 'ISOFIX',                         valor: 'Sí' },
      { label: 'Autoestacionamiento',            valor: 'Paralelo y perpendicular' },
      { label: 'Monitor presión neumáticos',     valor: 'Sí' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const MODELOS: ModeloFicha[] = [
  {
    id: 'grand-cherokee-2026',
    modelo: 'Grand Cherokee',
    año: 2026,
    versiones: [
      { id: 'altitude-4x2',   nombre: 'Altitude 4X2',    categorias: GC_BASE },
      { id: 'limited-4x4',    nombre: 'Limited 4X4',     categorias: GC_LIMITED },
      { id: 'limited-l-4x4',  nombre: 'Limited L 4X4',   categorias: GC_LIMITED_L },
      { id: 'summit-4x4',     nombre: 'Summit 4X4',      categorias: GC_SUMMIT },
    ],
  },
  {
    id: 'commander-2026',
    modelo: 'Commander',
    año: 2026,
    versiones: [
      { id: 'overland-2026', nombre: 'Overland', categorias: COMMANDER_BASE_CATS('2026') },
    ],
  },
]

export function modeloLabel(m: ModeloFicha): string {
  return `${m.modelo} ${m.año}`
}
