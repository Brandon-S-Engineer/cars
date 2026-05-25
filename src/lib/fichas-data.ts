export type Spec = { label: string; valor: string }
export type Categoria = { id: string; nombre: string; specs: Spec[] }
export type Version = { id: string; nombre: string; categorias: Categoria[] }
export type ModeloFicha = { id: string; marca: string; modelo: string; año: number; versiones: Version[] }

export const MARCA_ORDER = ['Jeep', 'Dodge', 'Fiat', 'Peugeot', 'RAM']

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
// DODGE JOURNEY 2026
// ─────────────────────────────────────────────────────────────────────────────

const JOURNEY_SXT: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                   valor: '1.5 L Turbo DCVVT 4I GDI' },
      { label: 'Potencia',                valor: '156 HP' },
      { label: 'Torque',                  valor: '184 lb-pie' },
      { label: 'Transmisión',             valor: 'Automática 6 velocidades' },
      { label: 'Suspensión delantera',    valor: 'McPherson independiente' },
      { label: 'Suspensión trasera',      valor: 'Multi-link independiente' },
      { label: 'Frenos delanteros',       valor: 'Discos ventilados' },
      { label: 'Frenos traseros',         valor: 'Discos' },
      { label: 'Dirección',               valor: 'EPS (Asistencia Eléctrica)' },
      { label: 'Rines',                   valor: 'Aluminio bitono 18" cara pulida' },
      { label: 'Neumáticos',              valor: '235/55' },
      { label: 'Consumo carretera',       valor: '18.90 km/l' },
      { label: 'Consumo ciudad',          valor: '12.66 km/l' },
      { label: 'Consumo combinado',       valor: '14.87 km/l' },
      { label: 'Longitud',                valor: '4,695 mm' },
      { label: 'Ancho',                   valor: '1,885 mm' },
      { label: 'Altura',                  valor: '1,700 mm' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros delanteros',           valor: 'Halógenos' },
      { label: 'Faros de niebla',            valor: 'LED' },
      { label: 'DRL',                        valor: 'LED' },
      { label: 'Luces traseras',             valor: 'LED' },
      { label: 'Alerón trasero con luz LED', valor: 'Sí' },
      { label: 'Espejos laterales',          valor: 'Eléctricos abatibles, calefactables, con luz direccional' },
      { label: 'Espejos con tilt down',      valor: 'No incluido' },
      { label: 'Quemacocos',                 valor: 'Estándar (protección contra atascos)' },
      { label: 'Techo panorámico',           valor: 'No incluido' },
      { label: 'Cajuela eléctrica',          valor: 'No incluida' },
      { label: 'Estribos laterales',         valor: 'No incluidos' },
      { label: 'Rieles en techo',            valor: 'Funcionales integrados' },
      { label: 'Sensor de lluvia/luz',       valor: 'Sí' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',                       valor: 'Tela con insertos en piel sintética' },
      { label: 'Asiento conductor',               valor: 'Eléctrico 8 vías' },
      { label: 'Asiento pasajero',                valor: 'Manual' },
      { label: 'Memoria asiento conductor',       valor: 'No incluida' },
      { label: 'Asientos calefactables/ventilados', valor: 'No incluidos' },
      { label: 'Pantalla principal',              valor: '10" LCD' },
      { label: 'Panel de instrumentos',           valor: '12.3" LCD' },
      { label: 'A/C',                             valor: 'Automático doble zona' },
      { label: 'Espejo retrovisor interior',      valor: 'Manual día/noche' },
      { label: 'Iluminación ambiental',           valor: 'No incluida' },
      { label: 'Cargador inalámbrico',            valor: 'No incluido' },
      { label: 'Purificador de aire',             valor: 'No incluido' },
      { label: 'Segunda fila',                    valor: 'Abatible 60/40 y respaldos reclinables' },
      { label: 'Puertos USB delanteros',          valor: '2' },
      { label: 'Filtro de aire PM 2.5',           valor: 'Sí' },
      { label: 'Volante',                         valor: 'Multifuncional en piel, ajuste altura y profundidad' },
    ],
  },
  {
    id: 'tecnologia', nombre: 'Tecnología y Entretenimiento', specs: [
      { label: 'Apple CarPlay',              valor: 'No incluido' },
      { label: 'Android Auto',               valor: 'No incluido' },
      { label: 'MirrorLink®',                valor: 'No incluido' },
      { label: 'Keyless Entry & GO®',        valor: 'No incluido' },
      { label: 'Cámara de reversa',          valor: 'Sí' },
      { label: 'Visión 360°',                valor: 'No incluida' },
      { label: 'Audio',                      valor: '6 bocinas' },
      { label: 'Cargador tel. inalámbrico',  valor: 'No incluido' },
      { label: 'Cierre express',             valor: 'No incluido' },
      { label: 'Modo Sport',                 valor: 'No incluido' },
      { label: 'Sistema Start & Stop',       valor: 'Sí' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'ABS',                                    valor: 'Sí' },
      { label: 'ESP (Estabilidad Electrónica)',           valor: 'Sí' },
      { label: 'EBD (Distribución de frenado)',          valor: 'Sí' },
      { label: 'Freno de estacionamiento (EPB + AutoHold)', valor: 'Sí' },
      { label: 'Bolsas de aire',                         valor: 'Frontales + cortina + laterales delanteras' },
      { label: 'Advertencia colisión frontal (FCW)',     valor: 'No incluida' },
      { label: 'Advertencia salida de carril (LDW)',     valor: 'No incluida' },
      { label: 'Descenso de pendientes (HDC)',           valor: 'No incluido' },
      { label: 'Luces inteligentes Smartbeam',           valor: 'No incluidas' },
      { label: 'Arranque en pendiente (HSA)',            valor: 'Sí' },
      { label: 'Frenado hidráulico (HBA)',               valor: 'Sí' },
      { label: 'Sensores de estacionamiento',            valor: 'Delanteros y traseros' },
      { label: 'Cinturones 2ª fila con pretensores',    valor: 'No incluidos' },
      { label: 'ISOFIX',                                 valor: 'Sí' },
      { label: 'TPMS (presión de llantas)',              valor: 'Sí' },
      { label: 'Alarma antirrobo',                       valor: 'Sí' },
    ],
  },
]

const JOURNEY_SPORT: Categoria[] = merge(JOURNEY_SXT, {
  desempeno: {
    'Rines':              'Aluminio bitono 19" cara pulida',
    'Neumáticos':         '235/50',
  },
  exterior: {
    'Faros delanteros':  'LED',
    'Espejos con tilt down': 'Sí',
  },
  interior: {
    'Tapicería':                         'Piel sintética Leatherette negra',
    'Asiento conductor':                 'Eléctrico 10 vías con 3 memorias y entrada de cortesía',
    'Asiento pasajero':                  'Eléctrico 4 vías',
    'Memoria asiento conductor':         'Sí (3 memorias)',
    'Asientos calefactables/ventilados': 'Sí (3 niveles ajustables)',
    'Espejo retrovisor interior':        'Automático día/noche con USB',
    'Iluminación ambiental':             'Sí',
    'Cargador inalámbrico':              'Sí',
  },
  tecnologia: {
    'Apple CarPlay':             'Sí',
    'Android Auto':              'Sí',
    'Keyless Entry & GO®':       'Sí',
    'Cámara de reversa':         '— (incluido en visión 360°)',
    'Visión 360°':               'Sí',
    'Cargador tel. inalámbrico': 'Sí',
    'Cierre express':            'Sí (cristales y quemacocos)',
  },
  seguridad: {
    'Advertencia colisión frontal (FCW)':  'Sí',
    'Advertencia salida de carril (LDW)':  'Sí',
    'Descenso de pendientes (HDC)':        'Sí',
    'Luces inteligentes Smartbeam':        'Sí',
    'Cinturones 2ª fila con pretensores':  'Sí',
  },
})

const JOURNEY_GT_PLUS: Categoria[] = merge(JOURNEY_SPORT, {
  desempeno: {
    'Consumo carretera': '18.19 km/l',
    'Consumo ciudad':    '12.45 km/l',
    'Consumo combinado': '14.51 km/l',
  },
  exterior: {
    'Quemacocos':       'Techo panorámico',
    'Cajuela eléctrica':'Eléctrica con apertura intermedia y anti atrapadura',
    'Estribos laterales':'Sí (con logotipo DODGE)',
  },
  interior: {
    'Purificador de aire': 'Sí (ionizador de iones negativos)',
  },
  tecnologia: {
    'MirrorLink®':  'Sí',
    'Modo Sport':   'Sí',
    'Audio':        '8 bocinas',
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// DODGE ATTITUDE 2026
// ─────────────────────────────────────────────────────────────────────────────

const ATTITUDE_SXT: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                 valor: '1.5L Turbo GDI' },
      { label: 'Potencia',              valor: '168 HP' },
      { label: 'Torque',                valor: '184 lb-ft' },
      { label: 'Transmisión',           valor: 'Automática 7 vel. doble embrague (DCT)' },
      { label: 'Suspensión delantera',  valor: 'McPherson independiente' },
      { label: 'Suspensión trasera',    valor: 'Multi-link Beam' },
      { label: 'Frenos delanteros',     valor: 'Discos ventilados' },
      { label: 'Frenos traseros',       valor: 'Discos' },
      { label: 'Dirección',             valor: 'EPS (Asistencia Eléctrica)' },
      { label: 'Rines',                 valor: 'Aluminio bitono cara pulida 17"' },
      { label: 'Neumáticos',            valor: '225/50 R17' },
      { label: 'Consumo carretera',     valor: '22.55 km/l' },
      { label: 'Consumo ciudad',        valor: '15.43 km/l' },
      { label: 'Consumo combinado',     valor: '17.98 km/l' },
      { label: 'Longitud',              valor: '4,700 mm' },
      { label: 'Ancho',                 valor: '1,850 mm' },
      { label: 'Altura',                valor: '1,432 mm' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros delanteros',          valor: 'LED (ajuste de altura / función "Sígueme a casa")' },
      { label: 'DRL',                        valor: 'LED' },
      { label: 'Luces de niebla traseras',   valor: 'Sí' },
      { label: 'Faros automáticos',          valor: 'Sí' },
      { label: 'Alerón trasero',             valor: 'No incluido' },
      { label: 'Espejos laterales',          valor: 'Con ajuste eléctrico' },
      { label: 'Espejos abatibles',          valor: 'No incluidos (solo ajuste eléctrico)' },
      { label: 'Espejos calefactables',      valor: 'No incluidos' },
      { label: 'Espejos con señal de giro',  valor: 'No incluidos' },
      { label: 'Doble salida de escape',     valor: 'Cromada' },
      { label: 'Sensor de lluvia',           valor: 'Sí' },
      { label: 'Colores disponibles',        valor: 'Blanco brillante, Granito' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',                      valor: 'Tela' },
      { label: 'A/C',                             valor: 'Manual' },
      { label: 'Asiento conductor',              valor: 'Ajuste manual 6 vías' },
      { label: 'Asiento pasajero',               valor: 'Manual' },
      { label: 'Asientos ventilados',            valor: 'No incluidos' },
      { label: 'Keyless Entry & Go®',             valor: 'No incluido' },
      { label: 'Espejo retrovisor',              valor: 'Día/noche manual' },
      { label: 'Iluminación ambiental',          valor: 'No incluida' },
      { label: 'Paletas de cambio al volante',   valor: 'No incluidas' },
      { label: 'Quemacocos eléctrico',           valor: 'No incluido' },
      { label: 'Apoyo lumbar conductor',         valor: 'No incluido' },
      { label: 'Apoyabrazos 2ª fila',            valor: 'No incluido' },
      { label: 'Salida de aire trasera',         valor: 'No incluida' },
      { label: 'Ventanas un solo toque',         valor: 'No incluidas' },
      { label: 'Volante',                        valor: 'Sin forro en piel' },
      { label: 'Tomacorriente 12V',              valor: 'Sí (1ª fila)' },
      { label: 'Filtro de aire',                 valor: 'Sí' },
    ],
  },
  {
    id: 'tecnologia', nombre: 'Tecnología y Entretenimiento', specs: [
      { label: 'Panel de instrumentos',          valor: 'LCD 7" configurable' },
      { label: 'Pantalla infotainment',          valor: 'No incluida' },
      { label: 'Audio',                          valor: 'DTS 6 bocinas' },
      { label: 'Android Auto',                   valor: 'Sí' },
      { label: 'Apple CarPlay / MirrorLink',     valor: 'No incluido' },
      { label: 'Cargador inalámbrico',           valor: 'No incluido' },
      { label: 'Puertos USB 1ª fila',            valor: '2' },
      { label: 'Puerto USB 2ª fila',             valor: 'No incluido' },
      { label: 'Sonido de escape',               valor: 'No incluido' },
      { label: 'Sistema de manos libres',        valor: 'Sí' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'ABS',                                   valor: 'Sí' },
      { label: 'ESP (Estabilidad Electrónica)',          valor: 'Sí' },
      { label: 'EBD (Distribución de frenado)',         valor: 'Sí' },
      { label: 'EPB + AutoHold',                        valor: 'Sí' },
      { label: 'AEB (Frenado Autónomo de Emergencia)',  valor: 'No incluido' },
      { label: 'HBA (Frenado Hidráulico)',              valor: 'Sí' },
      { label: 'HSA (Arranque en pendiente)',           valor: 'Sí' },
      { label: 'Control de crucero',                    valor: 'Convencional' },
      { label: 'ACC (Crucero Adaptativo)',               valor: 'No incluido' },
      { label: 'FCW (Alerta colisión frontal)',         valor: 'No incluida' },
      { label: 'LDW (Alerta salida de carril)',         valor: 'No incluida' },
      { label: 'LKA (Mantenimiento de carril)',         valor: 'No incluida' },
      { label: 'ICA (Crucero Integrado)',               valor: 'No incluido' },
      { label: 'TJA (Asistente de atasco)',             valor: 'No incluido' },
      { label: 'HMA (Luces altas inteligentes)',        valor: 'No incluido' },
      { label: 'BSD (Detector de punto ciego)',         valor: 'No incluido' },
      { label: 'Cámara de reversa',                    valor: 'Sí' },
      { label: 'Sensores de estacionamiento',          valor: 'Solo traseros' },
      { label: 'Bolsas de aire',                       valor: 'Frontales + cortina + laterales delanteras' },
      { label: 'ISOFIX',                               valor: 'Sí' },
      { label: 'TPMS (presión de llantas)',            valor: 'Sí' },
      { label: 'Alarma antirrobo',                     valor: 'Sí' },
    ],
  },
]

const ATTITUDE_SPORT: Categoria[] = merge(ATTITUDE_SXT, {
  desempeno: {
    'Rines':              'Aluminio bitono cara pulida 18"',
    'Neumáticos':         '225/45 R18',
    'Consumo carretera':  '21.52 km/l',
    'Consumo ciudad':     '15.03 km/l',
    'Consumo combinado':  '17.39 km/l',
  },
  exterior: {
    'Espejos laterales':      'Con ajuste eléctrico + abatibles + calefactables + señal de giro',
    'Espejos abatibles':      'Sí',
    'Espejos calefactables':  'Sí',
    'Espejos con señal de giro': 'Sí',
    'Colores disponibles':    'Blanco brillante, Granito, Plata estelar, Negro brillante',
  },
  interior: {
    'Tapicería':                   'Piel sintética',
    'A/C':                          'Automático doble zona',
    'Asiento conductor':           'Eléctrico 6 vías',
    'Asiento pasajero':            'Manual',
    'Asientos ventilados':         'Sí',
    'Keyless Entry & Go®':          'Sí',
    'Espejo retrovisor':           'Día/noche manual + interfaz USB',
    'Iluminación ambiental':       'Inteligente multicolor',
    'Paletas de cambio al volante':'Sí',
    'Quemacocos eléctrico':        'Sí (antipellizco)',
    'Apoyabrazos 2ª fila':         'Sí',
    'Salida de aire trasera':      'Sí',
    'Ventanas un solo toque':      'Sí (antipellizco)',
    'Volante':                     'Forrado en piel',
  },
  tecnologia: {
    'Panel de instrumentos':      'LCD 10.25" configurable',
    'Pantalla infotainment':      '10.25" LCD a color',
    'Audio':                      'DTS 8 bocinas',
    'Apple CarPlay / MirrorLink': 'Sí (alámbrico)',
    'Puerto USB 2ª fila':         '1',
    'Sonido de escape':           'Sí',
  },
  seguridad: {
    'AEB (Frenado Autónomo de Emergencia)': 'Sí',
    'Control de crucero':                   'ACC (Adaptativo)',
    'ACC (Crucero Adaptativo)':             'Sí',
    'FCW (Alerta colisión frontal)':        'Sí',
    'LDW (Alerta salida de carril)':        'Sí',
    'LKA (Mantenimiento de carril)':        'Sí',
    'ICA (Crucero Integrado)':              'Sí',
    'TJA (Asistente de atasco)':            'Sí',
    'HMA (Luces altas inteligentes)':       'Sí',
    'Sensores de estacionamiento':          'Delanteros y traseros',
  },
})

const ATTITUDE_GT: Categoria[] = merge(ATTITUDE_SPORT, {
  desempeno: {
    'Rines':             'Aluminio negro satinado 18" (Performance)',
    'Neumáticos':        '225/45Z R18 alta velocidad',
    'Consumo carretera': '20.92 km/l',
    'Consumo ciudad':    '14.56 km/l',
    'Consumo combinado': '16.87 km/l',
  },
  exterior: {
    'Alerón trasero': 'Sí',
  },
  interior: {
    'Asiento pasajero':   'Eléctrico 4 vías',
    'Espejo retrovisor':  'Día/noche automático + interfaz USB',
    'Apoyo lumbar conductor': 'Sí (4 direcciones)',
  },
  tecnologia: {
    'Cargador inalámbrico': 'Sí',
  },
  seguridad: {
    'BSD (Detector de punto ciego)': 'Sí',
  },
})

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
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const MODELOS: ModeloFicha[] = [
  // ── Jeep ──────────────────────────────────────────────────────────────────
  {
    id: 'grand-cherokee-2026',
    marca: 'Jeep',
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
    marca: 'Jeep',
    modelo: 'Commander',
    año: 2026,
    versiones: [
      { id: 'overland-2026', nombre: 'Overland', categorias: COMMANDER_BASE_CATS('2026') },
    ],
  },
  // ── Dodge ─────────────────────────────────────────────────────────────────
  {
    id: 'attitude-2026',
    marca: 'Dodge',
    modelo: 'Attitude',
    año: 2026,
    versiones: [
      { id: 'sxt',   nombre: 'SXT',   categorias: ATTITUDE_SXT },
      { id: 'sport', nombre: 'Sport', categorias: ATTITUDE_SPORT },
      { id: 'gt',    nombre: 'GT',    categorias: ATTITUDE_GT },
    ],
  },
  {
    id: 'journey-2026',
    marca: 'Dodge',
    modelo: 'Journey',
    año: 2026,
    versiones: [
      { id: 'sxt',     nombre: 'SXT',     categorias: JOURNEY_SXT },
      { id: 'sport',   nombre: 'Sport',   categorias: JOURNEY_SPORT },
      { id: 'gt-plus', nombre: 'GT Plus', categorias: JOURNEY_GT_PLUS },
    ],
  },
  // ── Peugeot ───────────────────────────────────────────────────────────────
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
]

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

// Inject into MODELOS after the array close above
;(MODELOS as ModeloFicha[]).push({
  id: 'rifter-2026',
  marca: 'Peugeot',
  modelo: 'Rifter',
  año: 2026,
  versiones: [
    { id: 'puretech-gasolina', nombre: 'PureTech (Gasolina)',  categorias: RIFTER_PURETECH },
    { id: 'hdi-diesel',        nombre: 'HDI (Diésel)',         categorias: RIFTER_HDI },
  ],
})

// ─────────────────────────────────────────────────────────────────────────────
// PEUGEOT PARTNER RAPID 2026
// ─────────────────────────────────────────────────────────────────────────────

;(MODELOS as ModeloFicha[]).push({
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

;(MODELOS as ModeloFicha[]).push({
  id: 'manager-fl-2026',
  marca: 'Peugeot',
  modelo: 'Manager FL',
  año: 2026,
  versiones: [
    { id: 'l2h2', nombre: 'L2H2', categorias: MANAGER_FL_L2H2 },
    { id: 'l4h2', nombre: 'L4H2', categorias: MANAGER_FL_L4H2 },
  ],
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

;(MODELOS as ModeloFicha[]).push({
  id: 'partner-fl-2026',
  marca: 'Peugeot',
  modelo: 'Partner FL',
  año: 2026,
  versiones: [
    { id: 'puretech-maxi-pack', nombre: 'PureTech Maxi Pack', categorias: PARTNER_FL_PURETECH },
    { id: 'hdi-maxi',           nombre: 'HDI Maxi',           categorias: PARTNER_FL_HDI_MAXI },
    { id: 'hdi-maxi-pack',      nombre: 'HDI Maxi Pack',      categorias: PARTNER_FL_HDI_MAXI_PACK },
  ],
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

;(MODELOS as ModeloFicha[]).push({
  id: 'partner-fl-2027',
  marca: 'Peugeot',
  modelo: 'Partner FL',
  año: 2027,
  versiones: [
    { id: 'maxi-pack',     nombre: 'Maxi Pack',     categorias: PARTNER_FL_2027_MAXI          },
    { id: 'hdi-maxi-pack', nombre: 'HDI Maxi Pack', categorias: PARTNER_FL_2027_HDI_MAXI_PACK },
  ],
})

// ─────────────────────────────────────────────────────────────────────────────
// PEUGEOT RIFTER 2027  —  PureTech Allure Pack
// ─────────────────────────────────────────────────────────────────────────────

;(MODELOS as ModeloFicha[]).push({
  id: 'rifter-2027',
  marca: 'Peugeot',
  modelo: 'Rifter',
  año: 2027,
  versiones: [
    { id: 'puretech-gasolina', nombre: 'PureTech (Gasolina)', categorias: RIFTER_PURETECH },
    { id: 'hdi-diesel',        nombre: 'HDI (Diésel)',        categorias: RIFTER_HDI       },
  ],
})

// ─────────────────────────────────────────────────────────────────────────────
// DODGE DURANGO HELLCAT 2026  —  Road Predator Edition + Red Fury
// ─────────────────────────────────────────────────────────────────────────────

const DURANGO_ROAD_PREDATOR: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                      valor: '6.2L supercargado HEMI V8 SRT' },
      { label: 'Potencia',                   valor: '710 HP' },
      { label: 'Torque',                     valor: '645 lb-ft' },
      { label: 'Transmisión',                valor: 'Automática 8 velocidades' },
      { label: 'Tracción',                   valor: 'Quadra-Trac On Demand (AWD)' },
      { label: 'Sistema Selec-Trac',         valor: 'Sí' },
      { label: 'Diferencial trasero',        valor: 'Deslizamiento limitado' },
      { label: 'Dirección',                  valor: 'Eléctrica, ajuste alt. y telescópico, modo seleccionable' },
      { label: 'Suspensión',                 valor: 'De competición' },
      { label: 'Modos de manejo',            valor: 'SPORT + SRT Performance Pages + Launch Control' },
      { label: 'Paletas de cambio',          valor: 'Al volante' },
      { label: 'Aceleración 0-100 km/h',    valor: '3.5 s' },
      { label: 'Arranque',                   valor: 'Botón de arranque + remoto' },
      { label: 'Alternador',                 valor: '220 Amp' },
      { label: 'Batería',                    valor: '700 Amp, libre de mantenimiento' },
      { label: 'Alimentación 12V',           valor: 'Delantera y trasera' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Pasajeros',                  valor: '6 (3 filas)' },
      { label: 'Tapicería',                  valor: 'Piel laguna Demonic Red (alto desempeño)' },
      { label: 'A/C',                        valor: 'Automático 3 zonas' },
      { label: 'Asiento conductor',          valor: '8 vías + 4 vías lumbar, calefactable y ventilado' },
      { label: 'Asiento pasajero',           valor: '8 vías, calefactable y ventilado' },
      { label: '2ª fila',                    valor: 'Tipo capitán, calefactable' },
      { label: 'Consola trasera',            valor: 'Mini consola 2ª y 3ª fila' },
      { label: 'Volante',                    valor: 'SRT forrado en piel calefactable' },
      { label: 'Pantalla',                   valor: '10.1" táctil' },
      { label: 'Navegación',                 valor: 'GPS integrada' },
      { label: 'Audio',                      valor: '19 altavoces Harman Kardon + subwoofer, 825 W' },
      { label: 'Apple CarPlay / Android Auto', valor: 'Sí (inalámbrico)' },
      { label: 'Carga inalámbrica',          valor: 'Sí' },
      { label: 'USB / AUX',                  valor: '2 USB + AUX' },
      { label: 'Retrovisor interior',        valor: 'Electrocrómico' },
      { label: 'Iluminación interior',       valor: 'LED' },
      { label: 'Parabrisas',                 valor: 'Acústico' },
      { label: 'Supresión de ruido activa',  valor: 'Sí' },
      { label: 'Control garage universal',   valor: 'Sí' },
      { label: 'Cinturones',                 valor: 'Color Hammerhead Grey' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Rines',                      valor: '20" × 10" Forged Y-Spoke Lights Out' },
      { label: 'Neumáticos',                 valor: '295/45ZR20 BSW All Season' },
      { label: 'Frenos delanteros',          valor: 'Brembo® con calipers rojos' },
      { label: 'Cofre',                      valor: 'Pintado negro, diseño High Performance' },
      { label: 'Escape',                     valor: 'Doble punta color negro' },
      { label: 'Faros delanteros',           valor: 'LED automáticos' },
      { label: 'DRL',                        valor: 'LED' },
      { label: 'Luces traseras',             valor: 'LED' },
      { label: 'Espejos laterales',          valor: 'Calefactables, plegables, con indicadores y memoria, negro brillante' },
      { label: 'Espejo conductor',           valor: 'Electrocrómico' },
      { label: 'Acceso pasivo',              valor: 'Puertas delanteras' },
      { label: 'Portón trasero',             valor: 'Eléctrico' },
      { label: 'Quemacocos',                 valor: 'Eléctrico' },
      { label: 'Parrilla',                   valor: 'Color negro' },
      { label: 'Rieles en toldo',            valor: 'Negro' },
      { label: 'Color',                      valor: 'Destroyer Grey' },
      { label: 'Largo',                      valor: '5,101 mm' },
      { label: 'Ancho',                      valor: '1,924 mm' },
      { label: 'Alto',                       valor: '1,790 mm' },
      { label: 'Llanta de refacción',        valor: 'Incluida' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'Frenos ABS HD',              valor: 'Disco' },
      { label: 'Frenos Brembo®',             valor: 'Delanteros' },
      { label: 'Frenos asistencia lluvia',   valor: 'Sí + Ready Alert' },
      { label: 'Control estabilidad (ESC)',  valor: 'Sí' },
      { label: 'Control tracción (TC)',       valor: 'Sí' },
      { label: 'HSA (arranque en pendiente)', valor: 'Sí' },
      { label: 'Asistencia estacionamiento', valor: 'Frontal y trasero con STOP' },
      { label: 'Punto ciego y ruta transversal', valor: 'Sí' },
      { label: 'Control balance de remolque',valor: 'Sí' },
      { label: 'Cámara trasera',             valor: 'Sí' },
      { label: 'Bolsas de aire',             valor: 'Frontales + laterales + cortina 3 filas + rodilla conductor + complementarias' },
      { label: 'LATCH',                      valor: 'Sí' },
      { label: 'Monitor presión neumáticos', valor: 'Sí' },
      { label: 'Alarma',                     valor: 'Sí + antirrobo centralizado' },
      { label: 'Seguros de puertas',         valor: 'Eléctricos' },
    ],
  },
]

const DURANGO_RED_FURY: Categoria[] = merge(DURANGO_ROAD_PREDATOR, {
  interior: {
    'Pasajeros':       '5 (2 filas)',
    'Tapicería':       'Piel negro (alto desempeño)',
    '2ª fila':         'Calefactable',
    'Consola trasera': 'Mini consola 2ª fila',
    'Cinturones':      'Color rojo',
  },
  exterior: {
    'Color':               'Octane Red',
    'Llanta de refacción': 'No incluida',
  },
  seguridad: {
    'Bolsas de aire': 'Frontales + laterales + cortina + rodilla conductor + complementarias',
  },
})

;(MODELOS as ModeloFicha[]).push({
  id: 'durango-hellcat-2026',
  marca: 'Dodge',
  modelo: 'Durango Hellcat',
  año: 2026,
  versiones: [
    { id: 'road-predator', nombre: 'Road Predator Edition', categorias: DURANGO_ROAD_PREDATOR },
    { id: 'red-fury',      nombre: 'Red Fury',              categorias: DURANGO_RED_FURY      },
  ],
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

;(MODELOS as ModeloFicha[]).push({
  id: '2008-fl-2026',
  marca: 'Peugeot',
  modelo: '2008 FL',
  año: 2026,
  versiones: [
    { id: 'allure-pack', nombre: 'Allure Pack', categorias: P2008_ALLURE },
    { id: 'gt',          nombre: 'GT',          categorias: P2008_GT },
  ],
})

// ─────────────────────────────────────────────────────────────────────────────
// RAM 4000 2026  —  Reg Cab Chassis P / PL / Crew Cab Chassis
// ─────────────────────────────────────────────────────────────────────────────

const RAM_4000_REG_CAB_P: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                valor: '6.4L V8 HEMI Upgrade HD' },
      { label: 'Potencia',             valor: '405 HP @ 5,500 rpm' },
      { label: 'Torque',               valor: '429 lb-ft @ 4,000 rpm' },
      { label: 'Transmisión',          valor: 'Automática 8 velocidades' },
      { label: 'Tracción',             valor: 'Trasera' },
      { label: 'Selector tracción',    valor: 'No incluido' },
      { label: 'Dirección',            valor: 'Asistida' },
      { label: 'Suspensión delantera', valor: '3 links, barra transversal, resortes helicoidales, eje sólido y barra estabilizadora' },
      { label: 'Suspensión trasera',   valor: 'Muelles 2 etapas, eje sólido doble rodada, diferencial deslizamiento limitado, barra estabilizadora' },
      { label: 'Amortiguadores',       valor: 'Trabajo pesado' },
    ],
  },
  {
    id: 'dimensiones', nombre: 'Dimensiones y Capacidades', specs: [
      { label: 'Largo',                   valor: '5,977 mm' },
      { label: 'Ancho sin espejos',       valor: '2,118 mm' },
      { label: 'Alto',                    valor: '2,055 mm' },
      { label: 'Distancia entre ejes',    valor: '3,647 mm' },
      { label: 'Peso vehicular',          valor: '2,817 kg' },
      { label: 'Peso bruto vehicular',    valor: '—' },
      { label: 'Capacidad de carga',      valor: '3,305 kg' },
      { label: 'Capacidad de arrastre',   valor: '7,094 kg' },
      { label: 'Carga por ejes del/tra',  valor: '2,494 / 4,467 kg' },
      { label: 'Neumáticos',             valor: 'LT235/80R17E All Season' },
      { label: 'Rines',                   valor: 'Acero 17" negro' },
      { label: 'Llanta de refacción',     valor: 'Tamaño completo' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'A/C',                     valor: 'Sí, con filtro de cabina N95+BIO' },
      { label: 'Asiento conductor',       valor: 'Manual 4 posiciones' },
      { label: 'Asiento pasajero',        valor: 'Manual 4 posiciones' },
      { label: 'Asientos',                valor: 'Banco 40/20/40 en tela' },
      { label: 'Almacenamiento trasero',  valor: 'Detrás del asiento' },
      { label: 'Reposabrazos delantero',  valor: 'Con portavasos' },
      { label: 'Cabeceras delanteras',    valor: 'Ajuste 4 posiciones' },
      { label: 'Cabeceras traseras',      valor: 'No incluidas' },
      { label: 'Asiento trasero',         valor: 'No plegable' },
      { label: 'Bandeja de almacenamiento', valor: 'No incluida' },
      { label: 'Botón de arranque',       valor: 'Sí' },
      { label: 'Entrada remota sin llave', valor: 'No incluida' },
      { label: 'Cerraduras eléctricas',   valor: 'No incluidas' },
      { label: 'Consola superior',        valor: 'No incluida' },
      { label: 'Espejo retrovisor',       valor: 'Día/noche' },
      { label: 'Indicador temp. y brújula', valor: 'Sí' },
      { label: 'Piso',                    valor: 'Vinilo negro uso rudo' },
      { label: 'Palanca de cambios',      valor: 'Uretano en columna de dirección' },
      { label: 'Sistema antirrobo',       valor: 'Llave Sentry' },
      { label: 'Seguros de puertas',      valor: 'Manuales' },
      { label: 'Ventanas delanteras',     valor: 'Manuales' },
      { label: 'Ventanilla trasera',      valor: 'Fija' },
      { label: 'Pantalla',                valor: 'Táctil 8.4"' },
      { label: 'Clúster',                 valor: 'TFT color 3.5"' },
      { label: 'Apple CarPlay / Android Auto', valor: 'Sí' },
      { label: 'Audio',                   valor: '4 altavoces' },
      { label: 'Media Hub',               valor: '2 USB + auxiliar + carga y datos' },
      { label: 'Manos libres',            valor: 'Inalámbrico (teléfono y audio)' },
      { label: 'GPS',                     valor: 'Entrada de antena' },
      { label: 'Puerto USB carga remoto', valor: 'Sí' },
      { label: 'Toma 12V',               valor: 'Sí' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                   valor: 'LED automáticos con conducción diurna' },
      { label: 'Faros antiniebla',        valor: 'LED' },
      { label: 'Luces en toldo',          valor: 'Navegación' },
      { label: 'Espejos exteriores',      valor: 'Telescópicos ajuste manual, negro' },
      { label: 'Manijas de puerta',       valor: 'Negro' },
      { label: 'Parrilla',                valor: 'Malla negra mate' },
      { label: 'Ganchos de remolque',     valor: 'Sí' },
      { label: 'Arnés de remolque',       valor: '7 pines' },
      { label: 'Interruptores auxiliares', valor: 'Montados en consola central' },
      { label: 'Retardo apagado faros',   valor: 'Sí' },
      { label: 'Monitoreo voltaje ralentí', valor: 'Sí' },
      { label: 'Color exterior',          valor: 'Blanco brillante' },
      { label: 'Color interior',          valor: 'Negro' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'Frenos ABS',              valor: 'Disco en 4 ruedas' },
      { label: 'ESP (estabilidad)',        valor: 'Sí' },
      { label: 'Bolsas de aire',          valor: 'Delanteras multietapas' },
      { label: 'Colisión frontal',        valor: 'Sistema de asistencia plus' },
      { label: 'Frenado urgencia (peat./cicl.)', valor: 'Sí' },
      { label: 'Control crucero',         valor: 'Adaptativo con stop' },
      { label: 'Asistencia frenado',      valor: 'Ready Alert' },
      { label: 'Cinturones delanteros',   valor: 'Con ajuste de altura' },
      { label: 'Limpiaparabrisas',        valor: 'Intermitente' },
      { label: 'Aviso lámpara fundida LED', valor: 'Sí' },
      { label: 'Drive by Wire',           valor: 'Sí (acelerador electrónico)' },
      { label: 'Enfriador aceite trans.', valor: 'Auxiliar' },
      { label: 'Enfriamiento motor',      valor: 'Para trabajo pesado' },
    ],
  },
]

const RAM_4000_REG_CAB_PL: Categoria[] = merge(RAM_4000_REG_CAB_P, {
  desempeno: {
    'Transmisión': 'Automática 8 velocidades LCV',
  },
  dimensiones: {
    'Largo':                 '6,586 mm',
    'Ancho sin espejos':     '2,334 mm',
    'Alto':                  '2,029 mm',
    'Distancia entre ejes':  '4,249 mm',
    'Peso vehicular':        '2,843 kg',
    'Peso bruto vehicular':  '6,122 kg',
    'Capacidad de carga':    '3,279 kg',
    'Capacidad de arrastre': '7,067 kg',
  },
})

const RAM_4000_CREW_CAB: Categoria[] = merge(RAM_4000_REG_CAB_P, {
  desempeno: {
    'Transmisión':        'Automática 8 velocidades LCV',
    'Tracción':           '4x4',
    'Selector tracción':  'Electrónico en movimiento',
  },
  dimensiones: {
    'Largo':                '6,711 mm',
    'Alto':                 '2,047 mm',
    'Distancia entre ejes': '4,374 mm',
    'Peso vehicular':       '3,245 kg',
    'Capacidad de carga':   '2,877 kg',
    'Capacidad de arrastre':'6,663 kg',
  },
  interior: {
    'Almacenamiento trasero':   'Compartimento debajo del asiento trasero',
    'Reposabrazos delantero':   'No incluido',
    'Cabeceras traseras':       'Ajuste 2 posiciones',
    'Asiento trasero':          'Plegable',
    'Bandeja de almacenamiento':'Sí',
    'Entrada remota sin llave': 'Sí',
    'Cerraduras eléctricas':    'Sensibles a la velocidad',
    'Consola superior':         'Sí',
    'Seguros de puertas':       'Eléctricos',
    'Ventanas delanteras':      'Eléctricas un toque arriba y abajo',
    'Ventanilla trasera':       'Manual (trasera)',
    'Audio':                    '6 altavoces',
  },
})

;(MODELOS as ModeloFicha[]).push({
  id: 'ram-4000-2026',
  marca: 'RAM',
  modelo: 'RAM 4000',
  año: 2026,
  versiones: [
    { id: 'reg-cab-p',  nombre: 'Reg Cab Chassis P',  categorias: RAM_4000_REG_CAB_P  },
    { id: 'reg-cab-pl', nombre: 'Reg Cab Chassis PL', categorias: RAM_4000_REG_CAB_PL },
    { id: 'crew-cab',   nombre: 'Crew Cab Chassis',   categorias: RAM_4000_CREW_CAB   },
  ],
})

// ─────────────────────────────────────────────────────────────────────────────
// RAM 1500 2026  —  Tungsten / Tradesman I6 4x4
// ─────────────────────────────────────────────────────────────────────────────

const RAM_1500_TUNGSTEN: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                valor: '3.0L I6 Hurricane HO Twin Turbo ESS' },
      { label: 'Potencia',             valor: '540 HP @ 6,200 rpm' },
      { label: 'Torque',               valor: '521 lb-ft @ 3,500 rpm' },
      { label: 'Transmisión',          valor: 'Automática 8 velocidades' },
      { label: 'Tracción',             valor: '4x4 (4WD)' },
      { label: 'Caja de transferencia', valor: 'Electrónica' },
      { label: 'Dirección',            valor: 'Eléctrica asistida' },
      { label: 'Modos de conducción',  valor: 'Configurables' },
      { label: 'Suspensión delantera', valor: 'Independiente brazos cortos/largos, Quadra-Lift® neumática semiactiva, barra estabilizadora' },
      { label: 'Suspensión trasera',   valor: 'Independiente 5 enlaces, resortes helicoidales, Quadra-Lift® neumática semiactiva, enlaces aluminio fundido' },
      { label: 'Arranque remoto',       valor: 'Sí' },
      { label: 'Sistema motor',        valor: '—' },
      { label: 'Alternador',           valor: '—' },
      { label: 'Relación eje trasero', valor: '—' },
      { label: 'Consumo ciudad',       valor: '—' },
      { label: 'Consumo carretera',    valor: '—' },
      { label: 'Consumo combinado',    valor: '—' },
      { label: 'Batería',              valor: '—' },
      { label: 'Inversor',             valor: '—' },
      { label: 'Tanque de combustible', valor: '—' },
    ],
  },
  {
    id: 'dimensiones', nombre: 'Dimensiones y Capacidades', specs: [
      { label: 'Largo',                  valor: '5,916 mm' },
      { label: 'Ancho',                  valor: '2,084 mm' },
      { label: 'Alto',                   valor: '1,971 mm' },
      { label: 'Distancia entre ejes',   valor: '—' },
      { label: 'Volumen de carga',       valor: '1.5 m³' },
      { label: 'Capacidad de carga',     valor: '530 kg' },
      { label: 'Capacidad de arrastre',  valor: '4,150 kg' },
      { label: 'Neumáticos',             valor: 'Pirelli All Season 285/45R22XL' },
      { label: 'Rines',                  valor: '22×9.0 pulido con insertos' },
      { label: 'Llanta de repuesto',     valor: 'Tamaño completo' },
    ],
  },
  {
    id: 'remolque', nombre: 'Remolque', specs: [
      { label: 'Enganche',               valor: 'Receptor clase IV' },
      { label: 'Arnés',                  valor: '7 pines + conector 12 vías/1 vía' },
      { label: 'Gancho del remolque',    valor: 'Sí' },
      { label: 'Control freno remolque', valor: 'Sí' },
      { label: 'Control dirección inversa', valor: 'Sí' },
      { label: 'Comprobación de luces',  valor: 'Sí' },
      { label: 'Monitor presión remolque', valor: 'Sí' },
      { label: 'Control balanceo',       valor: 'Sí' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',              valor: 'Piel premium envolvente' },
      { label: 'A/C',                    valor: 'Automático zona dual, filtro N95+BIO' },
      { label: 'Asiento conductor',      valor: 'Eléctrico 20 posiciones + lumbar 4 dirs + masaje + memoria' },
      { label: 'Asiento pasajero',       valor: 'Eléctrico 20 posiciones + lumbar 4 dirs + masaje' },
      { label: 'Asientos delanteros',    valor: 'Calefacción y ventilación' },
      { label: 'Asientos traseros',      valor: 'Calefacción, ventilación y reclinables 60/40' },
      { label: 'Cabeceras delanteras',   valor: 'Eléctricas 4 direcciones' },
      { label: 'Volante',                valor: 'Piel calefactable con insertos fibra de carbono real' },
      { label: 'Pedales',                valor: 'Ajuste eléctrico, acabado brillante' },
      { label: 'Memoria',                valor: 'Asiento conductor, espejos y pedales' },
      { label: 'Columna de dirección',   valor: 'Telescópica y con inclinación' },
      { label: 'Espejo retrovisor',      valor: 'Digital con modo remolque' },
      { label: 'Freno estacionamiento',  valor: 'Eléctrico' },
      { label: 'Cerraduras',             valor: 'Eléctricas sensibles a la velocidad' },
      { label: 'Keyless Entry & Go',     valor: 'Sí' },
      { label: 'Cristales delanteros',   valor: 'Eléctricos 1 toque arriba y abajo' },
      { label: 'Ventana trasera',        valor: 'Corrediza eléctrica' },
      { label: 'Vidrios',                valor: 'Tintados con protección solar' },
      { label: 'Iluminación ambiental',  valor: 'LED' },
      { label: 'Control activo ruido',   valor: 'Sí (cabina)' },
      { label: 'Control garaje universal', valor: 'Sí' },
      { label: 'Almacenamiento 2ª fila', valor: 'Sí (piso)' },
      { label: 'Acentos',               valor: '—' },
      { label: 'Perilla selectora',      valor: 'Sí' },
      { label: 'Tapetes',                valor: 'Sí' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                  valor: 'LED bifunción automáticos' },
      { label: 'Luces antiniebla',       valor: 'LED premium' },
      { label: 'DRL',                    valor: 'LED' },
      { label: 'Luces traseras',         valor: 'LED' },
      { label: 'Animación iluminación',  valor: 'Frontal y trasera exterior' },
      { label: 'Espejos exteriores',     valor: 'Eléctricos premium, cromados, calefactados, plegables automáticos, atenuación automática, luz direccional/cortesía, gran angular convexo, luz aproximación' },
      { label: 'Estribos',               valor: 'Plegables eléctricos' },
      { label: 'Techo',                  valor: 'Corredizo panorámico doble panel' },
      { label: 'Performance Hood',       valor: '—' },
      { label: 'Escape',                 valor: 'Doble con puntas brillantes' },
      { label: 'Antena',                 valor: 'Aleta de tiburón' },
      { label: 'Manijas exteriores',     valor: 'Al color de la carrocería' },
      { label: 'Fascia delantera',       valor: 'Insertos en cromo; defensa trasera al color' },
      { label: 'Limpiaparabrisas',       valor: 'Sensibles a la lluvia' },
      { label: 'Portón trasero',         valor: 'Amortiguado con apertura remota + luz LED en manija' },
      { label: 'RAMBOX®',                valor: 'Sistema gestión de carga' },
      { label: 'Batea',                  valor: 'Protección aspersión + puerta multifunción + escalón desplegable + iluminación LED + 4 ganchos' },
      { label: 'Colores disponibles',    valor: 'Granite, Forger Blue, Molten Red, Bright White, Ivory White, Diamond Black' },
    ],
  },
  {
    id: 'tecnologia', nombre: 'Tecnología', specs: [
      { label: 'Pantalla principal',     valor: 'Táctil 14.4" — Apple CarPlay® y Android Auto' },
      { label: 'Clúster',                valor: 'TFT color 12"' },
      { label: 'Pantalla pasajero',      valor: '10.25"' },
      { label: 'Head-Up Display',        valor: 'Sí' },
      { label: 'Navegación GPS',         valor: 'Sí' },
      { label: 'Audio',                  valor: 'Klipsch® Premium — 23 bocinas' },
      { label: 'USB',                    valor: '2 con auxiliar + 2 con carga' },
      { label: 'Manos libres',           valor: 'Inalámbrico' },
      { label: 'Carga inalámbrica',      valor: '2 celulares simultáneos' },
      { label: 'Tomacorriente 12V',      valor: 'Sí' },
      { label: 'Tomacorriente 115V',     valor: 'Delantero y trasero' },
      { label: 'Info todoterreno',       valor: 'Páginas de información off-road' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'Frenos ABS',             valor: 'Disco en 4 ruedas' },
      { label: 'ESP + TCS',              valor: 'Sí' },
      { label: 'Control antivuelco',     valor: 'Sí' },
      { label: 'Bolsas de aire',         valor: 'Delanteras multietapas avanzadas + laterales delanteras + cortina trasera' },
      { label: 'ISOFIX',                 valor: 'Sí' },
      { label: 'Cámara',                 valor: 'Visión envolvente 360°' },
      { label: 'ParkSense®',             valor: 'Sensores delanteros y traseros con parada' },
      { label: 'Punto ciego y cruce',    valor: 'Detección activa' },
      { label: 'Control crucero',        valor: 'Adaptativo con Stop & Go' },
      { label: 'Colisión frontal',       valor: 'Asistencia plus' },
      { label: 'Colisión intersecciones', valor: 'Asistencia activa' },
      { label: 'Frenado emergencia',     valor: 'Peatonal + avanzada' },
      { label: 'Asistencia carril',      valor: 'Salida activa' },
      { label: 'Dirección evasiva',      valor: 'Sí' },
      { label: 'Luz alta automática',    valor: 'Sí' },
      { label: 'Señales de tráfico',     valor: 'Reconocimiento automático' },
      { label: 'Conductor somnoliento',  valor: 'Detección activa' },
      { label: 'TPMS',                   valor: 'Sí' },
      { label: 'Arranque en subidas',    valor: 'Sí' },
      { label: 'Sistema activo conducción', valor: 'Sí' },
      { label: 'Amortiguadores',         valor: 'Delanteros y traseros uso rudo' },
      { label: 'Barra estabilizadora',   valor: 'Delantera y trasera' },
    ],
  },
]

const RAM_1500_TRADESMAN: Categoria[] = merge(RAM_1500_TUNGSTEN, {
  desempeno: {
    'Motor':               '3.0L I6 Hurricane SO Twin Turbo',
    'Potencia':            '420 HP @ 5,200 rpm',
    'Torque':              '469 lb-ft @ 3,500 rpm',
    'Modos de conducción': '—',
    'Suspensión delantera':'Horquillas independientes con resortes, amortiguador de gas y barra estabilizadora',
    'Suspensión trasera':  '5 links con resortes, eje sólido y barra estabilizadora',
    'Arranque remoto':     '—',
    'Sistema motor':       'Stop-Start con batería auxiliar',
    'Alternador':          '230A',
    'Relación eje trasero':'3.92',
    'Consumo ciudad':      '8.0 km/L',
    'Consumo carretera':   '12.0 km/L',
    'Consumo combinado':   '9.4 km/L',
    'Batería':             '700 amp, libre de mantenimiento',
    'Inversor':            '400W',
    'Tanque de combustible':'98 L',
  },
  dimensiones: {
    'Distancia entre ejes':  '3,672 mm',
    'Capacidad de carga':    '860 kg',
    'Capacidad de arrastre': '5,130 kg',
    'Neumáticos':            '275/65R18 BSW AS LRR',
    'Rines':                 'Acero 18"',
  },
  remolque: {
    'Arnés':                     '7 pines',
    'Gancho del remolque':       '—',
    'Control freno remolque':    'Control electrónico',
    'Control dirección inversa': '—',
    'Comprobación de luces':     '—',
    'Monitor presión remolque':  '—',
    'Control balanceo':          '—',
  },
  interior: {
    'Tapicería':              'Tela',
    'A/C':                    'Manual, filtro N95+BIO',
    'Asiento conductor':      'Manual 4 posiciones',
    'Asiento pasajero':       'Manual 4 posiciones',
    'Asientos delanteros':    '—',
    'Asientos traseros':      'Abatible',
    'Cabeceras delanteras':   'Ajustables 4 direcciones',
    'Volante':                '—',
    'Pedales':                '—',
    'Memoria':                '—',
    'Columna de dirección':   '—',
    'Espejo retrovisor':      'Día/noche',
    'Vidrios':                '—',
    'Iluminación ambiental':  '—',
    'Control activo ruido':   '—',
    'Control garaje universal':'—',
    'Tapetes':                'Delanteros y traseros',
  },
  exterior: {
    'Faros':               'LED reflector automático luces altas y bajas',
    'Luces antiniebla':    '—',
    'Luces traseras':      '—',
    'Animación iluminación':'—',
    'Espejos exteriores':  'Negros, ajuste eléctrico, inserto convexo',
    'Estribos':            'Escalón de caja plegable',
    'Techo':               '—',
    'Escape':              '—',
    'Manijas exteriores':  'Negro',
    'Fascia delantera':    'Negra (parrilla y manijas negras)',
    'Limpiaparabrisas':    '—',
    'Portón trasero':      'Con amortiguación',
    'RAMBOX®':             '—',
    'Batea':               'Recubrimiento aspersión + iluminación + 4 ganchos ajustables + toma 115V exterior',
    'Colores disponibles': 'Silver Zynith, Diamond Black, Bright White',
  },
  tecnologia: {
    'Pantalla principal':  'Táctil 8.4" — Apple CarPlay® y Android Auto',
    'Clúster':             'TFT color 3.5"',
    'Pantalla pasajero':   '—',
    'Head-Up Display':     '—',
    'Navegación GPS':      'Antena GPS',
    'Audio':               '6 altavoces',
    'USB':                 'Media Hub: 2 USB + auxiliar',
    'Carga inalámbrica':   '—',
    'Tomacorriente 115V':  '—',
    'Info todoterreno':    '—',
  },
  seguridad: {
    'Bolsas de aire':          '6 (frontales + laterales + cortina)',
    'Cámara':                  'Trasera',
    'Colisión intersecciones': '—',
    'Frenado emergencia':      'Peatonal',
    'Dirección evasiva':       '—',
    'Señales de tráfico':      '—',
    'Conductor somnoliento':   '—',
    'Sistema activo conducción':'—',
    'Amortiguadores':          'Trabajo pesado',
    'Barra estabilizadora':    '—',
  },
})

const RAM_1500_TRADESMAN_V6_4X2: Categoria[] = merge(RAM_1500_TUNGSTEN, {
  desempeno: {
    'Motor':               '3.6L V6 24V VVT eTorque Engine',
    'Potencia':            '305 HP @ 6,400 rpm',
    'Torque':              '269 lb-ft @ 4,800 rpm',
    'Tracción':            '4x2 (Trasera)',
    'Caja de transferencia':'No incluida',
    'Modos de conducción': '—',
    'Suspensión delantera':'Horquillas independientes con resortes, amortiguador de gas y barra estabilizadora',
    'Suspensión trasera':  '5 links con resortes, eje sólido y barra estabilizadora',
    'Arranque remoto':     '—',
    'Sistema motor':       'eTorque mild-hybrid 48V',
    'Alternador':          '—',
    'Relación eje trasero':'3.55',
    'Consumo ciudad':      '9.31 km/L',
    'Consumo carretera':   '13.3 km/L',
    'Consumo combinado':   '10.8 km/L',
    'Batería':             '730 amp, libre de mantenimiento',
    'Inversor':            '—',
    'Tanque de combustible':'98 L',
  },
  dimensiones: {
    'Distancia entre ejes':  '3,672 mm',
    'Capacidad de carga':    '912 kg',
    'Capacidad de arrastre': '3,370 kg',
    'Neumáticos':            '275/65R18 BSW AS LRR',
    'Rines':                 'Acero 18"',
    'Llanta de repuesto':    'Tamaño completo temporal',
  },
  remolque: {
    'Arnés':                     '7 pines',
    'Gancho del remolque':       '—',
    'Control freno remolque':    '—',
    'Control dirección inversa': '—',
    'Comprobación de luces':     '—',
    'Monitor presión remolque':  '—',
    'Control balanceo':          'Sí',
  },
  interior: {
    'Tapicería':              'Tela',
    'A/C':                    'Manual, filtro N95+BIO',
    'Asiento conductor':      'Manual 4 posiciones',
    'Asiento pasajero':       'Manual 4 posiciones',
    'Asientos delanteros':    '—',
    'Asientos traseros':      'Abatible 60/40',
    'Cabeceras delanteras':   'Ajustables 4 direcciones',
    'Volante':                '—',
    'Pedales':                '—',
    'Memoria':                '—',
    'Columna de dirección':   '—',
    'Espejo retrovisor':      'Día/noche',
    'Vidrios':                '—',
    'Iluminación ambiental':  '—',
    'Control activo ruido':   '—',
    'Control garaje universal':'—',
    'Tapetes':                'Delanteros y traseros',
  },
  exterior: {
    'Faros':               'LED reflector automático luces altas y bajas',
    'Luces antiniebla':    '—',
    'DRL':                 'En faro de baja intensidad',
    'Luces traseras':      '—',
    'Animación iluminación':'—',
    'Espejos exteriores':  'Negros, ajuste eléctrico, calefactables, inserto convexo',
    'Estribos':            '—',
    'Techo':               '—',
    'Escape':              'Doble en color negro',
    'Manijas exteriores':  'Negro',
    'Fascia delantera':    'Negra (parrilla y manijas negras)',
    'Limpiaparabrisas':    '—',
    'Portón trasero':      'Con amortiguación',
    'RAMBOX®':             '—',
    'Batea':               '—',
    'Colores disponibles': '—',
  },
  tecnologia: {
    'Pantalla principal':  'Táctil 8.4" — Apple CarPlay® y Android Auto',
    'Clúster':             'TFT color 3.5"',
    'Pantalla pasajero':   '—',
    'Head-Up Display':     '—',
    'Navegación GPS':      'Antena GPS',
    'Audio':               '6 altavoces',
    'USB':                 'Media Hub: 2 USB + auxiliar',
    'Carga inalámbrica':   '—',
    'Tomacorriente 115V':  '—',
    'Info todoterreno':    '—',
  },
  seguridad: {
    'Bolsas de aire':          '6 (frontales + laterales + cortina)',
    'Cámara':                  'Trasera',
    'Colisión intersecciones': '—',
    'Frenado emergencia':      'Peatonal',
    'Dirección evasiva':       '—',
    'Señales de tráfico':      '—',
    'Conductor somnoliento':   '—',
    'Sistema activo conducción':'—',
    'Amortiguadores':          'Trabajo pesado',
    'Barra estabilizadora':    '—',
  },
})

const RAM_1500_RHO: Categoria[] = merge(RAM_1500_TUNGSTEN, {
  desempeno: {
    'Transmisión':          'Automática 8 velocidades + paletas al volante',
    'Caja de transferencia':'Electrónica Full Time, Control Selec-Speed™',
    'Suspensión delantera': 'Horquillas independientes con resortes helicoidales, amortiguadores Bilstein e2 Black Hawk® Active Performance y barra estabilizadora',
    'Suspensión trasera':   '5 links con resortes helicoidales, amortiguadores Bilstein e2 Black Hawk® Active Performance, eje sólido y barra estabilizadora',
  },
  dimensiones: {
    'Capacidad de carga':    '690 kg',
    'Capacidad de arrastre': '3,800 kg',
    'Neumáticos':            'Goodyear All Terrain LT325/65R18D',
    'Rines':                 'Beadlock de aluminio 18×9.0"',
  },
  interior: {
    'Tapicería':            'Piel envolvente',
    'Pedales':              'Ajuste eléctrico',
    'Control activo ruido': '—',
    'Perilla selectora':    '—',
    'Acentos':              'Fibra de carbono real',
    'Tapetes':              'Mopar® delanteros y traseros',
  },
  exterior: {
    'Faros':              'Proyección LED con bifunción automática',
    'Luces antiniebla':   'LED',
    'Espejos exteriores': 'Negros, eléctricos premium, calefactados, plegables automáticos, atenuación automática, luz direccional/cortesía, gran angular convexo, luz aproximación',
    'Estribos':           'Off-road',
    'Performance Hood':   'Sí',
    'Escape':             'Doble con puntas en negro',
    'Manijas exteriores': 'Negro',
    'Fascia delantera':   'Negra + guardafangos todoterreno + placa protectora caja transferencia',
    'RAMBOX®':            '—',
    'Batea':              'Protección aspersión + puerta eléctrica con apertura remota + escalón desplegable + iluminación LED + 4 ganchos',
    'Colores disponibles':'Hydro Blue, Flame Red, Billet Silver, Bright White, Diamond Black Crystal',
  },
  tecnologia: {
    'Audio':        'Harman Kardon® Premium — 19 bocinas',
    'Manos libres': '—',
  },
})

const RAM_1500_TRADESMAN_V6_4X4: Categoria[] = merge(RAM_1500_TRADESMAN_V6_4X2, {
  desempeno: {
    'Tracción':            '4x4',
    'Caja de transferencia':'Electrónica',
    'Consumo ciudad':      '9.05 km/L',
    'Consumo carretera':   '12.9 km/L',
    'Consumo combinado':   '10.5 km/L',
  },
  dimensiones: {
    'Capacidad de carga': '830 kg',
  },
})

;(MODELOS as ModeloFicha[]).push({
  id: 'ram-1500-2026',
  marca: 'RAM',
  modelo: 'RAM 1500',
  año: 2026,
  versiones: [
    { id: 'rho',               nombre: 'RHO',                 categorias: RAM_1500_RHO                },
    { id: 'tungsten',          nombre: 'Tungsten',            categorias: RAM_1500_TUNGSTEN            },
    { id: 'tradesman-v6-4x2',  nombre: 'Tradesman V6 4x2',   categorias: RAM_1500_TRADESMAN_V6_4X2   },
    { id: 'tradesman-v6-4x4',  nombre: 'Tradesman V6 4x4',   categorias: RAM_1500_TRADESMAN_V6_4X4   },
    { id: 'tradesman-i6-4x4',  nombre: 'Tradesman I6 4x4',   categorias: RAM_1500_TRADESMAN           },
  ],
})

export function modeloLabel(m: ModeloFicha): string {
  return `${m.modelo} ${m.año}`
}
