import { Categoria, ModeloFicha, merge } from './_shared'

// ─────────────────────────────────────────────────────────────────────────────
// FIAT PULSE 2026  —  Drive (base) y Drive Plus
// ─────────────────────────────────────────────────────────────────────────────

const PULSE_DRIVE: Categoria[] = [
  {
    id: 'desempeno', nombre: 'Desempeño', specs: [
      { label: 'Motor',                  valor: '1.3 L' },
      { label: 'Potencia',               valor: '97 hp @ 6,000 rpm' },
      { label: 'Torque',                 valor: '94 lb-pie @ 4,000 rpm' },
      { label: 'Transmisión',            valor: 'Manual 5 velocidades' },
      { label: 'Modo Sport',             valor: 'No incluido' },
      { label: 'Tanque de combustible',  valor: '48 L' },
      { label: 'Tracción',               valor: 'Delantera' },
      { label: 'Dirección',              valor: 'Asistida electrónicamente' },
      { label: 'Frenos delanteros',      valor: 'Discos ventilados' },
      { label: 'Frenos traseros',        valor: 'Tambor' },
      { label: 'Suspensión delantera',   valor: 'McPherson con ruedas independientes, brazos basculantes con barra estabilizadora' },
      { label: 'Suspensión trasera',     valor: 'Eje de torsión con ruedas semi-independientes' },
      { label: 'Consumo ciudad',         valor: '15.54 km/L' },
      { label: 'Consumo carretera',      valor: '23.15 km/L' },
      { label: 'Consumo combinado',      valor: '18.24 km/L' },
    ],
  },
  {
    id: 'exterior', nombre: 'Exterior', specs: [
      { label: 'Faros',                       valor: 'LED' },
      { label: 'Luces diurnas (DRL)',         valor: 'LED' },
      { label: 'Luces traseras',              valor: 'LED' },
      { label: 'Fascia delantera',            valor: 'Body color con inserto negro (nuevo diseño)' },
      { label: 'Limpiaparabrisas trasero',    valor: 'Sí' },
      { label: 'Espejos laterales',           valor: 'Ajuste eléctrico, direccionales, abatibles manualmente' },
      { label: 'Manijas exteriores',          valor: 'Color negro' },
      { label: 'Rieles portaequipaje',        valor: 'Sí' },
      { label: 'Spoiler trasero',             valor: 'Sí' },
      { label: 'Sensor de temperatura externa',valor: 'Sí' },
      { label: 'Rines',                       valor: 'Aluminio 16" (diseño nuevo)' },
      { label: 'Neumáticos',                  valor: '195/60 R16' },
      { label: 'Llanta de refacción',         valor: 'Compacta' },
      { label: 'Longitud',                    valor: '4,095 mm' },
      { label: 'Ancho sin espejos',           valor: '1,777 mm' },
      { label: 'Altura',                      valor: '1,578 mm' },
      { label: 'Distancia entre ejes',        valor: '2,532 mm' },
      { label: 'Capacidad de cajuela',        valor: '370 L' },
      { label: 'Colores disponibles',         valor: 'Blanco Banchisa, Plata Bari, Rojo Montecarlo, Gris Silverstone' },
    ],
  },
  {
    id: 'interior', nombre: 'Interior', specs: [
      { label: 'Tapicería',                   valor: 'Tela Plus' },
      { label: 'A/C',                         valor: 'Automático con filtro antipolen' },
      { label: 'Ajuste longitudinal asientos',valor: 'Manual' },
      { label: 'Asiento conductor',           valor: 'Con ajuste de altura' },
      { label: 'Cajuela iluminada',           valor: 'Sí' },
      { label: 'Cristales eléctricos',        valor: 'Delanteros y traseros con anti-pellizco' },
      { label: 'Descansabrazos delantero',    valor: 'No incluido' },
      { label: 'Desempañador trasero',        valor: 'Con temporizador' },
      { label: 'Espejo retrovisor',           valor: 'Día/Noche' },
      { label: 'Seguros eléctricos',          valor: 'Sí' },
      { label: 'Audio',                       valor: '4 bocinas + 2 tweeters' },
      { label: 'Viseras con espejo vanidad',  valor: 'Sí' },
      { label: 'Volante',                     valor: 'Con ajuste de altura' },
    ],
  },
  {
    id: 'tecnologia', nombre: 'Tecnología y Entretenimiento', specs: [
      { label: 'Keyless Entry & Go®',          valor: 'No incluido' },
      { label: 'Cargador inalámbrico',         valor: 'Sí' },
      { label: 'Cargador USB trasero',         valor: 'Tipo A + Tipo C' },
      { label: 'Clúster',                      valor: 'TFT 3.5" B/N' },
      { label: 'Controles audio/teléfono al volante',valor: 'Sí' },
      { label: 'Media Center',                 valor: 'USB Tipo A y C (datos y carga)' },
      { label: 'Pantalla principal',           valor: 'Uconnect® táctil 8.4"' },
      { label: 'Apple CarPlay / Android Auto', valor: 'Inalámbrico (hasta 2 teléfonos)' },
      { label: 'Radio',                        valor: 'AM/FM + USB + AUX + voz + streaming' },
      { label: 'Cámara de reversa',            valor: 'HD con ParkView® líneas activas' },
    ],
  },
  {
    id: 'seguridad', nombre: 'Seguridad', specs: [
      { label: 'Alarma',                                  valor: 'Sí' },
      { label: 'Arranque en pendiente (HSA)',             valor: 'Con freno automático' },
      { label: 'Asistencia de frenado de emergencia',     valor: 'Sí' },
      { label: 'Bolsas de aire frontales',                valor: 'Conductor y pasajero' },
      { label: 'Bolsas laterales delanteras',             valor: 'Dual (torso y cabeza)' },
      { label: 'Cabeceras del. y tras.',                  valor: 'Ajuste de altura' },
      { label: 'Cierre eléctrico tanque combustible',     valor: 'Sí' },
      { label: 'Cinturones traseros',                     valor: '3 puntos en todas las posiciones' },
      { label: 'Cinturones delanteros',                   valor: 'Ajuste de altura + pretensionador' },
      { label: 'Control de tracción (TCS)',               valor: 'Con bloqueo electrónico' },
      { label: 'Control de velocidad crucero',            valor: 'Sí' },
      { label: 'Control de estabilidad (ESC)',            valor: 'Sí' },
      { label: 'Distribución electrónica de frenado (EBD)',valor: 'Sí' },
      { label: 'Frenos ABS',                              valor: 'Sí' },
      { label: 'Inmovilizador de motor',                  valor: 'Sí' },
      { label: 'Llave',                                   valor: 'Con apertura remota' },
      { label: 'Regulador altura de faros',               valor: 'Sí' },
      { label: 'Sensores estacionamiento',                valor: 'Traseros' },
      { label: 'Alerta sonora y visual de cinturones',    valor: 'Delanteros y traseros' },
      { label: 'ISOFIX',                                  valor: 'Sí' },
      { label: 'Follow Me Home',                          valor: 'Sí' },
      { label: 'TPMS',                                    valor: 'Sí' },
    ],
  },
]

const PULSE_DRIVE_PLUS: Categoria[] = merge(PULSE_DRIVE, {
  desempeno: {
    'Transmisión':       'CVT (7 velocidades simuladas)',
    'Modo Sport':        'Sí',
    'Consumo ciudad':    '17.36 km/L',
    'Consumo carretera': '21.86 km/L',
    'Consumo combinado': '19.13 km/L',
  },
  interior: {
    'Descansabrazos delantero': 'Con portavasos',
  },
  tecnologia: {
    'Keyless Entry & Go®': 'Sí',
  },
})

export const MODELOS_FIAT: ModeloFicha[] = [
  {
    id: 'fiat-pulse-2026',
    marca: 'Fiat',
    modelo: 'Pulse',
    año: 2026,
    versiones: [
      { id: 'drive',      nombre: 'Drive',      categorias: PULSE_DRIVE      },
      { id: 'drive-plus', nombre: 'Drive Plus', categorias: PULSE_DRIVE_PLUS },
    ],
  },
]
