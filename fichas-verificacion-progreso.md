# Verificación de fichas vs PDF — progreso

> Archivo de trabajo de Fable. Estados: ⬜ pendiente · 🔄 en curso · ✅ verificado/corregido.
> Al retomar ("continuar"): buscar el primer ⬜/🔄, leer su PDF en `PDF/`, comparar contra
> la fuente en `src/lib/fichas/<marca>.ts` (¡los datos usan merge(BASE, overrides)!),
> corregir en la fuente, marcar ✅ aquí, commit+push por marca.
> Al terminar TODO: regenerar export con `npx tsx scripts/export-fichas.ts` y commit final.

## Jeep (`src/lib/fichas/jeep.ts`)

- ✅ grand-cherokee-2026 (4 vers.) — `PDF/ficha-tecnica-12may26-jeep-gcherokee-2026-07may2026-v2.pdf`
- ✅ commander-2026 (1 vers.) — `PDF/ficha-tecnica-12may26-jeep-commander-2026-07may2026-v2.pdf`
- ✅ jeep-compass-2026 (3 vers.) — `PDF/ficha-tecnica-12may26-jeep-compass-high-altitude-2026-06may2026-v2.pdf` + `PDF/ficha-tecnica-12may26-jeep-compass-limited-premium-altitude-2026-07may2026-v2.pdf`
- ✅ cherokee-hibrido-2026 (2 vers.) — sin errores
- ✅ grand-wagoneer-l-2026 (1 vers.) — sin errores
- ✅ renegade-2026 (2 vers.) — sin errores
- ✅ wrangler-2026 (4 vers.) — `PDF/diptico-12may26-jeep-wrangler-2026-v2.pdf`
- ✅ jt-2026 (3 vers.) — `PDF/diptico-12may26-jeep-jt-26-.pdf`

## Dodge (`src/lib/fichas/dodge.ts`)

- ✅ attitude-2026 (3 vers.) — sin errores
- ✅ journey-2026 (3 vers.) — `PDF/ficha-tecnica-oct25-dodge-journey-2026-digital.pdf` (10 correcciones)
- ✅ durango-hellcat-2026 (2 vers.) — sin errores (ver dudas)

## Fiat (`src/lib/fichas/fiat.ts`)

- ✅ fiat-pulse-2026 (2 vers.) — sin errores
- ✅ fiat-pulse-abarth-2026 (1 vers.) — sin errores
- ✅ fiat-fastback-2026 (1 vers.) — sin errores

## Peugeot (`src/lib/fichas/peugeot.ts`)

- ✅ expert-2026 (2 vers.) — 1 corrección (cierre centralizado SC)
- ✅ rifter-2026 (2 vers.) — 1 corrección (color "Taranaki" eliminado: es el diseño del rin)
- ✅ partner-rapid-2026 (1 vers.) — 1 adición (cierre centralizado auto.)
- ✅ manager-fl-2026 (2 vers.) — ~15 correcciones/adiciones (ficha estaba muy incompleta vs PDF)
- ✅ partner-fl-2026 (3 vers.) — 2 correcciones (piso área de carga, alto área de carga)
- ✅ partner-fl-2027 (2 vers.) — sin errores (override redundante de alto de carga eliminado)
- ✅ rifter-2027 (2 vers.) — sin errores (los PDFs 2027 son idénticos a 2026; reusar arrays es correcto)
- ✅ 2008-fl-2026 (2 vers.) — 1 corrección importante (paquete ADAS completo es exclusivo GT)

## RAM (`src/lib/fichas/ram.ts`)

- ⬜ ram-4000-2026 (3 vers.) — `PDF/ficha-tecnica-12may26-ram-4000-2026-11may2026-v2.pdf`
- ⬜ ram-1500-2026 (8 vers.) — `PDF/ficha-tecnica-12may26-ram-1500-2026-07may2026-v4.pdf` + `PDF/ficha-tecnica-12may26-ram-1500-tungsten-2026-07may2026-v2.pdf` + `PDF/ficha-tecnica-12may26-ram-1500-tradesman-2026-07may2026-v3.pdf` + `PDF/ficha-tecnica-12may26-ram-1500-2026-rho-07may2026-v2.pdf`
- ⬜ ram-1200-2026 (6 vers.) — `PDF/ficha-tecnica-12may26-ram-1200-2026-07may2026-v2 (1).pdf`
- ⬜ ram-700-2026 (5 vers.) — `PDF/ficha-tecnica-12may26-ram-700-2026-07may2026-v3.pdf`

## Correcciones aplicadas (log)

- **grand-cherokee-2026 / Limited 4X4** · exterior · Rines: «20×8.5 negro (diseño Overland)» → «20×8.5 en color negro» (PDF no menciona Overland).
- **commander-2026** · interior · Asientos delanteros: «Eléctricos 8 vías con memoria» → «Eléctricos 8 vías (conductor con memoria)» (PDF: solo conductor con memoria).
- **jeep-compass-2026 / High Altitude** · desempeño · Paletas al volante: heredaba «Sí» → «No — cambios Autostick en palanca» (PDF HA lista Autostick, no paletas).
- **jeep-compass-2026 / High Altitude** · interior · Ajuste lumbar conductor: «Eléctrico 2 vías» → «2 vías» (PDF no dice eléctrico).
- **jeep-compass-2026 / High Altitude** · exterior · Faros de niebla: heredaba «LED» → «—» (no aparecen en el PDF del HA).
- **jeep-compass-2026 / High Altitude** · exterior · Neumáticos: «235/45R19» → «235/45R19 BSW All Season» (detalle del PDF).
- **jeep-compass-2026 / High Altitude** · seguridad · Asistencia estacionamiento: heredaba «Paralelo y perpendicular» → «Trasera» (PDF HA solo lista asistencia trasera).

- **wrangler-2026 / Willys** · seguridad · Cámara Off-Road: «Sí» → «No incluida»; se agregó override «Sí» en Sahara (la tabla del díptico marca "-" solo en Willys).
- **jt-2026 / Willys** · desempeño · Placa protección bajo chasis: «Sí» → «No incluida»; Salida 115V auxiliar: «Sí + 115V AC exterior» → «No incluida»; Inversor de potencia: «400 W» → «No incluido». Se agregaron como «Sí» en Rubicon (Mojave hereda).

- **journey-2026 / SXT (base)** · exterior · Faros delanteros: «Halógenos» → «LED» (PDF: LED en las 3 versiones).
- **journey-2026 / SXT (base)** · exterior · Espejos laterales: SXT NO tiene abatibles/calefactables (solo eléctricos con luz direccional); Sport/GT sí (override agregado).
- **journey-2026 / SXT (base)** · exterior · Sensor de lluvia/luz: «Sí» → «No incluido» en SXT; Sport/GT sí.
- **journey-2026 / Sport** · exterior · Quemacocos/Techo panorámico: el Sport trae techo panorámico (no quemacocos estándar); el código lo daba solo al GT Plus y además GT mostraba «Techo panorámico: No incluido» (inconsistencia interna corregida).
- **journey-2026 / SXT (base)** · seguridad · HDC: «No incluido» → «Sí» (de serie en las 3).
- **journey-2026 / SXT (base)** · seguridad · Cinturones 2ª fila con pretensores: «No incluidos» → «Sí» (de serie en las 3).
- **journey-2026 / Sport** · seguridad · Smartbeam: el Sport NO lo trae (solo GT Plus); override movido de Sport a GT Plus.
- **journey-2026 / SXT (base)** · tecnología · Android Auto, Keyless Entry & GO, Cargador inalámbrico y Modo Sport: «No incluido» → «Sí» (de serie en las 3 versiones según PDF).
- **journey-2026 / GT Plus** · interior · Tapicería: se agregó «(roja opcional)» (PDF: Leatherette rojo OPCIONAL solo GT Plus).

- **expert-2026 / SC Furgón** · seguridad · Cierre centralizado auto.: «No incluido» → «Con bloqueo automático durante la conducción» (PDF lo lista en ambas versiones; override del FL reducido).
- **rifter (2026/2027)** · exterior · Colores: se eliminó «Taranaki» de la lista (es el nombre del diseño del rin de aluminio 16", no un color).
- **partner-rapid-2026** · seguridad · Se agregó «Cierre centralizado auto.: Con bloqueo automático durante la conducción» (estaba en el PDF, faltaba en el código).
- **manager-fl-2026** · ficha enriquecida vs PDF: motor «2.2L Turbo Diésel Euro VI (2,184 cc)», potencia «138 hp @ 3,500 rpm», suspensiones (McPherson / barra torsión reforzada), frenos (discos vent./sólidos), largo área de carga 3,120 mm (L2H2) y 4,070 mm (L4H2), pared divisoria desmontable, toma 12V en carga, pantalla 7" CarPlay/AA, clúster LCD 3.5", faros halógeno c/DRL, espejos calefactables eléctricos, puerta lateral corrediza, puertas traseras 50/50 270°, AFU, asistente viento cruzado, cámara de reversa, suspensión reforzada. Se eliminaron «Alerta atención conductor» y «Placa protección motor» (no están en el PDF).
- **partner-fl-2026 / HDI Maxi** · carga · Piso área de carga: la cubierta plástica es SOLO del Maxi Pack (PDF); base corregida a «Sin cubierta plástica» + override en Maxi Pack.
- **partner-fl-2026 / HDI Maxi Pack** · carga · Alto área de carga: el PDF muestra «1,200 – 1,270» abarcando ambas versiones; se eliminó el override «1,270 mm» del Maxi Pack (y el override redundante del 2027).
- **2008-fl-2026 / Allure Pack** · seguridad · ADAS: el paquete COMPLETO (atención conductor, colisión frontal, asistencia de carril, reconocimiento de señales, luces automáticas) es exclusivo del GT — la tabla del PDF marca ○ Allure / ● GT para todo el bloque. Allure corregido a «No incluido» en las 5; GT con override «Sí».

## Dudas (PDF no lo especifica o es ilegible; se dejó el valor del código)

- jeep-compass-2026 / High Altitude: Tanque 60 L, Maletero 476/1,180 L, Auto Hold, Limitador de velocidad, Smart Key — el PDF del HA no los menciona; se mantuvieron heredados de Altitude.
- wrangler-2026 / Rubicon 2P: el PDF oficial dice «Distancia entre ejes 1,460 mm» (typo evidente del PDF; el real es ~2,459 mm). El código replica el PDF. Decidir si corregir contra el dato real.
- jt-2026 / interior Willys (parasol, guantera, calefacción asientos): la tabla del díptico es ilegible por OCR en esas celdas; se mantuvo el código (No incluidos en Willys, Sí en Rubicon/Mojave).
- jt-2026: Cableado/receptor remolque en Wrangler Willys/Sahara — tabla ilegible, se mantuvo el código.
- durango-hellcat-2026 / Road Predator: «Llanta de refacción: Incluida» — su PDF no la menciona (el de Red Fury sí dice explícito que NO trae). Se mantuvo el código.
- durango-hellcat-2026 / Red Fury: A/C «Automático 3 zonas» (heredado) — el PDF de Red Fury solo dice «automático» sin zonas. Se mantuvo el heredado.
- attitude-2026: el PDF lista «Llanta de refacción compacta» en las 3 versiones; no existe ese spec en el código (omisión menor, no se agregó).
