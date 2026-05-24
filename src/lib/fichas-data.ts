export type Spec = { label: string; valor: string }
export type Categoria = { id: string; nombre: string; specs: Spec[] }
export type FichaTecnica = {
  id: string
  modelo: string
  año: number
  version: string
  categorias: Categoria[]
}

export const FICHAS: FichaTecnica[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // JEEP COMMANDER OVERLAND 2025
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'commander-2025-overland',
    modelo: 'Commander',
    año: 2025,
    version: 'Overland',
    categorias: [
      {
        id: 'desempeno',
        nombre: 'Desempeño',
        specs: [
          { label: 'Motor', valor: 'Turbo 1.3L de 4 cilindros con Start & Stop' },
          { label: 'Potencia', valor: '173 HP @ 5,750 rpm' },
          { label: 'Torque', valor: '199 lb-ft @ 1,850 rpm' },
          { label: 'Transmisión', valor: 'Automática 6 vel. con modo manual AutoStick®' },
          { label: 'Tanque de combustible', valor: '60 L' },
          { label: 'Tracción', valor: 'FWD' },
          { label: 'Suspensión', valor: 'McPherson delantera y trasera' },
          { label: 'Dirección', valor: 'Con asistencia eléctrica' },
          { label: 'Capacidad de carga', valor: '400 kg' },
          { label: 'Capacidad de arrastre', valor: '400 kg' },
          { label: 'Peso bruto vehicular', valor: '2,255 kg' },
          { label: 'Peso vehicular', valor: '1,557 kg' },
        ],
      },
      {
        id: 'dimensiones',
        nombre: 'Dimensiones',
        specs: [
          { label: 'Longitud total', valor: '4,769 mm' },
          { label: 'Ancho sin espejos', valor: '1,859 mm' },
          { label: 'Altura total', valor: '1,685 mm' },
          { label: 'Distancia entre ejes', valor: '2,794 mm' },
          { label: 'Cajuela (todas filas abatidas)', valor: '1,760 L' },
        ],
      },
      {
        id: 'interior',
        nombre: 'Interior',
        specs: [
          { label: 'Tapicería', valor: 'Piel Nappa Premium y gamuza café' },
          { label: 'Pasajeros', valor: '7' },
          { label: 'Segunda fila', valor: 'Plegable 60/40' },
          { label: 'Tercera fila', valor: 'Plegable 50/50' },
          { label: 'Asientos delanteros', valor: 'Eléctricos 8 vías' },
          { label: 'Clúster', valor: 'Premium 10.25" TFT a color' },
          { label: 'Pantalla principal', valor: 'Uconnect® 10.1" táctil' },
          { label: 'Audio', valor: 'Harman Kardon® 9 bocinas + Subwoofer' },
          { label: 'Carga inalámbrica', valor: 'Sí' },
          { label: 'Quemacocos', valor: 'Dual panorámico CommandView®' },
          { label: 'Apple CarPlay / Android Auto', valor: 'Inalámbrico' },
          { label: 'Puerto USB', valor: 'Tipo A y C (1ª y 2ª fila) + Tipo A (3ª fila)' },
          { label: 'Toldo interior', valor: 'Negro' },
          { label: 'Control A/C', valor: 'Automático bizona' },
        ],
      },
      {
        id: 'exterior',
        nombre: 'Exterior',
        specs: [
          { label: 'Rines', valor: 'Aluminio de 19"' },
          { label: 'Neumáticos', valor: '235/50 R19 Pirelli' },
          { label: 'Luces delanteras', valor: 'LED automáticas' },
          { label: 'Luces traseras', valor: 'LED' },
          { label: 'Luces de niebla', valor: 'LED' },
          { label: 'Espejos', valor: 'Eléctricos, plegables, con DRL y Tilt-Down' },
          { label: 'Maletero', valor: 'Eléctrico con Open \'N Go (manos libres)' },
          { label: 'Techo', valor: 'Bitono negro' },
          { label: 'Rieles en toldo', valor: 'Negro' },
          { label: 'Colores exteriores', valor: 'Negro carbón, Plata martillado, Blanco polar, Gris granito, Slash gold' },
        ],
      },
      {
        id: 'seguridad',
        nombre: 'Seguridad',
        specs: [
          { label: 'Bolsas de aire', valor: 'Frontales, laterales, cortina + rodilla conductor' },
          { label: 'ABS + EBD', valor: 'Sí' },
          { label: 'Control de estabilidad (ESC)', valor: 'Sí' },
          { label: 'Control de tracción (TCS)', valor: 'A cualquier velocidad' },
          { label: 'Freno de estacionamiento', valor: 'Eléctrico + Auto Hold' },
          { label: 'Crucero adaptativo (ACC)', valor: 'Con función Stop & Go' },
          { label: 'Detección de colisión frontal', valor: 'Plus (con peatones y ciclistas)' },
          { label: 'Punto ciego', valor: 'BSCPD (con ruta transversal de reversa)' },
          { label: 'Asistencia de carril', valor: 'Lane Departure Plus' },
          { label: 'Reconocimiento de señales', valor: 'No especificado' },
          { label: 'Visión 360°', valor: 'No incluido' },
          { label: 'Autoestacionamiento', valor: 'Paralelo y perpendicular' },
          { label: 'Detección de fatiga', valor: 'Sí' },
          { label: 'Monitor de presión de neumáticos', valor: 'Sí' },
          { label: 'ISOFIX', valor: 'Sí' },
          { label: 'Arranque remoto', valor: 'Sí (Keyless Enter \'N Go®)' },
          { label: 'Limitador de velocidad activo', valor: 'No especificado' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // JEEP COMMANDER OVERLAND 2026
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'commander-2026-overland',
    modelo: 'Commander',
    año: 2026,
    version: 'Overland',
    categorias: [
      {
        id: 'desempeno',
        nombre: 'Desempeño',
        specs: [
          { label: 'Motor', valor: '1.3 L Turbo' },
          { label: 'Potencia', valor: '173 hp @ 5,750 rpm' },
          { label: 'Torque', valor: '199 lb-ft @ 1,850 rpm' },
          { label: 'Transmisión', valor: 'Automática 6 vel. (Aisin Gen3) con paletas' },
          { label: 'Tanque de combustible', valor: '60 litros' },
          { label: 'Tracción', valor: 'FWD' },
          { label: 'Suspensión', valor: 'McPherson delantera y trasera' },
          { label: 'Dirección', valor: 'Electroasistida' },
          { label: 'Capacidad de carga', valor: '540 kg' },
          { label: 'Capacidad de arrastre', valor: '400 kg' },
          { label: 'Peso bruto vehicular', valor: '2,255 kg' },
          { label: 'Peso vehicular', valor: 'No especificado' },
        ],
      },
      {
        id: 'dimensiones',
        nombre: 'Dimensiones',
        specs: [
          { label: 'Longitud total', valor: '4,769 mm' },
          { label: 'Ancho sin espejos', valor: '1,859 mm' },
          { label: 'Altura total', valor: '1,685 mm' },
          { label: 'Distancia entre ejes', valor: '2,794 mm' },
          { label: 'Cajuela (todas filas abatidas)', valor: '661 L (normal) — máximo no especificado' },
        ],
      },
      {
        id: 'interior',
        nombre: 'Interior',
        specs: [
          { label: 'Tapicería', valor: 'Piel Brown Commander' },
          { label: 'Pasajeros', valor: '7' },
          { label: 'Segunda fila', valor: 'Plegable 60/40' },
          { label: 'Tercera fila', valor: 'Plegable 50/50' },
          { label: 'Asientos delanteros', valor: 'Eléctricos 8 vías con memoria' },
          { label: 'Clúster', valor: 'No especificado por separado' },
          { label: 'Pantalla principal', valor: 'Infoentretenimiento 10.1"' },
          { label: 'Audio', valor: 'Sistema de audio premium' },
          { label: 'Carga inalámbrica', valor: 'Sí (almohadilla)' },
          { label: 'Quemacocos', valor: 'Eléctrico' },
          { label: 'Apple CarPlay / Android Auto', valor: 'No especificado' },
          { label: 'Puerto USB', valor: 'Trasero Tipo A+C + Puerto remoto USB' },
          { label: 'Toldo interior', valor: 'Recubrimiento obscurecido' },
          { label: 'Control A/C', valor: 'Sistema de aire acondicionado' },
        ],
      },
      {
        id: 'exterior',
        nombre: 'Exterior',
        specs: [
          { label: 'Rines', valor: 'Overland de 19"' },
          { label: 'Neumáticos', valor: '235/50 R19' },
          { label: 'Luces delanteras', valor: 'LED automáticas / inteligentes' },
          { label: 'Luces traseras', valor: 'LED' },
          { label: 'Luces de niebla', valor: 'LED' },
          { label: 'Espejos', valor: 'Eléctricos, plegables, con iluminación de cortesía y Tilt-Down' },
          { label: 'Maletero', valor: 'Eléctrico con manos libres' },
          { label: 'Techo', valor: 'Bitono negro' },
          { label: 'Rieles en toldo', valor: 'Sí' },
          { label: 'Colores exteriores', valor: 'Negro, Plata metálico, Granito cristal, Slash gold' },
        ],
      },
      {
        id: 'seguridad',
        nombre: 'Seguridad',
        specs: [
          { label: 'Bolsas de aire', valor: 'Frontales, laterales, cortina + rodilla conductor' },
          { label: 'ABS + EBD', valor: 'Sí' },
          { label: 'Control de estabilidad (ESC)', valor: 'VDC (Vehicle Dynamic Control)' },
          { label: 'Control de tracción (TCS)', valor: 'All Speed + TC+' },
          { label: 'Freno de estacionamiento', valor: 'Eléctrico + Hill Holder + Auto Hold' },
          { label: 'Crucero adaptativo (ACC)', valor: 'Sí' },
          { label: 'Detección de colisión frontal', valor: 'Plus FWD (con peatones)' },
          { label: 'Punto ciego', valor: 'Monitoreo de punto ciego' },
          { label: 'Asistencia de carril', valor: 'Asistencia de mantenimiento y cambio de carril' },
          { label: 'Reconocimiento de señales', valor: 'Sí' },
          { label: 'Visión 360°', valor: 'Sistema de visión 360°' },
          { label: 'Autoestacionamiento', valor: 'Paralelo y perpendicular' },
          { label: 'Detección de fatiga', valor: 'Sí' },
          { label: 'Monitor de presión de neumáticos', valor: 'Sí' },
          { label: 'ISOFIX', valor: 'Sí' },
          { label: 'Arranque remoto', valor: 'Sí (llave de control inteligente)' },
          { label: 'Limitador de velocidad activo', valor: 'Sí' },
        ],
      },
    ],
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export const MODELOS = [...new Set(FICHAS.map((f) => f.modelo))].sort()

export function getFicha(id: string): FichaTecnica | undefined {
  return FICHAS.find((f) => f.id === id)
}

export function fichaLabel(f: FichaTecnica): string {
  return `${f.modelo} ${f.año} ${f.version}`
}
