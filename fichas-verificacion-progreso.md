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

- ⬜ fiat-pulse-2026 (2 vers.) — `PDF/ficha-tecnica-12may26-fiat-pulse-2026-vertical-07may2026-v7.pdf`
- ⬜ fiat-pulse-abarth-2026 (1 vers.) — `PDF/ficha-tecnica-12may26-fiat-abarth-vertical-26-07may2026-v6.pdf`
- ⬜ fiat-fastback-2026 (1 vers.) — `PDF/ficha-tecnica-12may26-fiat-fastback-2026-vertical-07may2026-v8.pdf`

## Peugeot (`src/lib/fichas/peugeot.ts`)

- ⬜ expert-2026 (2 vers.) — `PDF/ficha-tecnica-abr25-peugeot-expert-fl-2026-'web'.pdf` + `PDF/ficha-tecnica-may25-peugeot-expert-sc-2026-'web'.pdf`
- ⬜ rifter-2026 (2 vers.) — `PDF/ficha-tecnica-feb25-peugeot-nueva-rifter-puretech-my26-feb25 (2).pdf` + `PDF/ficha-tecnica-feb25-peugeot-nueva-rifter-allure-pack-fl-hdi-my26-feb25 (2).pdf`
- ⬜ partner-rapid-2026 (1 vers.) — `PDF/ficha-tecnica-enero26-peugeot-partner-firefly-my26-ene26.pdf`
- ⬜ manager-fl-2026 (2 vers.) — `PDF/ficha-tecnica-ene26-peugeot-manager-fl-my26_nov25 (2).pdf`
- ⬜ partner-fl-2026 (3 vers.) — `PDF/ficha-tecnica-abr25-peugeot-partner-hdi-fl-2026-'web'.pdf` + `PDF/ficha-tecnica-abr25-peugeot-partner-puretech-fl-2026-'web' (3).pdf`
- ⬜ partner-fl-2027 (2 vers.) — `PDF/ficha-tecnica-21may26-partner-puretech-fl-2027-'impresion'.pdf` + `PDF/ficha-tecnica-21may26-partner-hdi-fl-2027-14may2026-v1-'digital'.pdf`
- ⬜ rifter-2027 (2 vers.) — `PDF/ficha-tecnica-19may26-peugeot-rifter-puretech-allure-pack-azul-2027-'digital'.pdf` + `PDF/ficha-tecnica-19may26-peugeot-rifter-hdi-allure-pack-azul-2027-'impresion'.pdf`
- ⬜ 2008-fl-2026 (2 vers.) — `PDF/ficha-tecnica-abr25-peugeot-2008-2026-impresion (1).pdf`

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

## Dudas (PDF no lo especifica o es ilegible; se dejó el valor del código)

- jeep-compass-2026 / High Altitude: Tanque 60 L, Maletero 476/1,180 L, Auto Hold, Limitador de velocidad, Smart Key — el PDF del HA no los menciona; se mantuvieron heredados de Altitude.
- wrangler-2026 / Rubicon 2P: el PDF oficial dice «Distancia entre ejes 1,460 mm» (typo evidente del PDF; el real es ~2,459 mm). El código replica el PDF. Decidir si corregir contra el dato real.
- jt-2026 / interior Willys (parasol, guantera, calefacción asientos): la tabla del díptico es ilegible por OCR en esas celdas; se mantuvo el código (No incluidos en Willys, Sí en Rubicon/Mojave).
- jt-2026: Cableado/receptor remolque en Wrangler Willys/Sahara — tabla ilegible, se mantuvo el código.
- durango-hellcat-2026 / Road Predator: «Llanta de refacción: Incluida» — su PDF no la menciona (el de Red Fury sí dice explícito que NO trae). Se mantuvo el código.
- durango-hellcat-2026 / Red Fury: A/C «Automático 3 zonas» (heredado) — el PDF de Red Fury solo dice «automático» sin zonas. Se mantuvo el heredado.
- attitude-2026: el PDF lista «Llanta de refacción compacta» en las 3 versiones; no existe ese spec en el código (omisión menor, no se agregó).
