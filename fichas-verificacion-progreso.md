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

- ✅ ram-4000-2026 (3 vers.) — 5 correcciones (transmisión LCV, PBV, Crew Cab)
- ✅ ram-1500-2026 (8 vers.) — ~12 correcciones (colores por versión, batería, Tradesman, base Tungsten, RHO); V6 4x2/4x4 sin PDF (ver dudas)
- ✅ ram-1200-2026 (6 vers.) — ~10 correcciones (alto 4X4, espejos Bighorn, Keyless/USB/HDC mal asignados) + specs de batea/seguridad agregados
- ✅ ram-700-2026 (5 vers.) — 3 adiciones menores (volante con controles, barras ventanilla, emblemas Turbo); ficha muy fiel al PDF

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

- **ram-4000-2026 (las 3 versiones)** · desempeño · Transmisión: «Automática 8 velocidades» → «Automática 8 velocidades LCV» (celda combinada del PDF abarca las 3).
- **ram-4000-2026 (las 3 versiones)** · dimensiones · Peso bruto vehicular: «—» → «6,122 kg» (celda combinada).
- **ram-4000-2026 / Crew Cab** · desempeño/interior: override de transmisión redundante eliminado; «Reposabrazos delantero: No incluido» eliminado (no está en el PDF); «Ventanilla trasera: Manual (trasera)» → «Ventanas traseras: Manuales (en puertas traseras)».
- **ram-4000-2026 (base)** · interior · Se agregó «Visor solar pasajero: Con espejo».
- **ram-1500-2026 / Laramie+Limited** · exterior · Colores: Delmonico Red es EXCLUSIVO del Bighorn — Laramie/Limited corregidos a «Billet Silver, Bright White, Diamond Black, Granite Metallic».
- **ram-1500-2026 / Tradesman I6 + Laramie** · desempeño · Batería: «700 amp» → «730 amp, libre de mantenimiento» (PDF Tradesman).
- **ram-1500-2026 / Tradesman I6** · varios: Eje delantero 215 mm agregado; Tapicería «Tela 40/20/40»; frenado de emergencia heredado corregido (Peatonal + avanzada); «Control antivuelco: Sí»; visera parasol pasajero con espejo.
- **ram-1500-2026 / Tungsten (base)** · interior/exterior: agregados «Desempañador ventana trasera», «Cubierta Tonneau: Tres pliegues», «Alarma de seguridad», portón trasero amortiguado con apertura remota + luz LED en manija + luz de advertencia; «Control antivuelco» base → «—». Overrides «—» en versiones cuyo PDF no los lista.
- **ram-1500-2026 / RHO** · exterior/seguridad: «Gráficos: Mopar® negros en cofre + gráficos exteriores RHO», «Frenos gran performance: Sí», «Cubierta Tonneau: —».
- **ram-1200-2026 / Bighorn 4x2** · dimensiones · Alto: el 1,897 mm es SOLO de las 4X4 (el valor del PDF abarca columnas 5-6) — Bighorn 4x2 mide 1,858 mm; override movido a Bighorn 4X4.
- **ram-1200-2026 / Bighorn** · exterior · Espejos: «Calefactables y abatibles, color carrocería» → «Eléctricos con direccional, color carrocería» (calefactables/abatibles es exclusivo Laramie).
- **ram-1200-2026 / Bighorn** · exterior · Faros de niebla: «LED con función cornering» → «Sí, con función cornering» (el PDF no dice LED).
- **ram-1200-2026 / Bighorn→Crew** · interior · USB trasero: el «2 USB delanteros y 1 trasero» empieza en el Tradesman Crew Cab (span de columnas 3-6), no en Bighorn; override movido.
- **ram-1200-2026 / Bighorn→Laramie** · seguridad · Keyless Entry & Go: el PDF lo marca SOLO en Laramie; override movido de Bighorn a Laramie.
- **ram-1200-2026 (las 6)** · seguridad · HDC: «No incluido» → «Sí» (el PDF lo marca • en TODAS las versiones, incluso manuales 4x2); agregados EBA, TSC, ESS, control crucero con limitador (todas •) y asistencia de desvío de carril (solo Laramie).
- **ram-1200-2026 (base/Chassis-Regular)** · interior · Guantera con iluminación LED: «Sí» → «No incluida» (solo Crew en adelante); agregada guantera con refrigeración (todas).
- **ram-1200-2026** · agregados vs PDF: ancho de carga máximo 1,595 mm y altura de carga 500 mm (Regular–Laramie), ganchos de sujeción (6 Regular / 4 Crew+), escalón lateral de acceso a batea (solo Regular), conexión 12V en batea (solo Laramie), desempañante trasero (Crew+), limpiaparabrisas automático (Laramie), colores (Tradesman: Gris/Blanco; Bighorn/Laramie: +Rojo metálico, Gris obscuro metálico), llanta de refacción con rin de aluminio (Laramie), cristales un toque anti-pellizco (Laramie), cámara sustituida por visión 360° (Laramie).
- **ram-700-2026 (base)** · interior · Volante: se agregó «y controles de audio» (PDF: controles audio al volante en Regular Cab); el override del CVT conserva ajuste y controles.
- **ram-700-2026 (base)** · exterior · Agregados «Barras protección ventanilla trasera: Sí» y «Tercera luz de stop: LED, detrás de la cabina».
- **ram-700-2026 / Laramie** · exterior · Agregado «Emblemas: Turbo en los costados»; Roll Bar precisado como barras de extensión de carga.

## Dudas (PDF no lo especifica o es ilegible; se dejó el valor del código)

- jeep-compass-2026 / High Altitude: Tanque 60 L, Maletero 476/1,180 L, Auto Hold, Limitador de velocidad, Smart Key — el PDF del HA no los menciona; se mantuvieron heredados de Altitude.
- wrangler-2026 / Rubicon 2P: el PDF oficial dice «Distancia entre ejes 1,460 mm» (typo evidente del PDF; el real es ~2,459 mm). El código replica el PDF. Decidir si corregir contra el dato real.
- jt-2026 / interior Willys (parasol, guantera, calefacción asientos): la tabla del díptico es ilegible por OCR en esas celdas; se mantuvo el código (No incluidos en Willys, Sí en Rubicon/Mojave).
- jt-2026: Cableado/receptor remolque en Wrangler Willys/Sahara — tabla ilegible, se mantuvo el código.
- durango-hellcat-2026 / Road Predator: «Llanta de refacción: Incluida» — su PDF no la menciona (el de Red Fury sí dice explícito que NO trae). Se mantuvo el código.
- durango-hellcat-2026 / Red Fury: A/C «Automático 3 zonas» (heredado) — el PDF de Red Fury solo dice «automático» sin zonas. Se mantuvo el heredado.
- attitude-2026: el PDF lista «Llanta de refacción compacta» en las 3 versiones; no existe ese spec en el código (omisión menor, no se agregó).
- ram-4000-2026: el PDF (pág. 4) describe un paquete PTO opcional (375 HP @ 4,700 rpm, TorqueFlite HD, pesos distintos) que no es una versión; no se representó en el código.
- ram-1500-2026 / Laramie: alternador, inversor, tanque y sistema del motor no aparecen en su PDF; se mantuvieron heredados. Batería igualada a 730 amp por ser el mismo motor I6 del Tradesman.
- ram-1500-2026 / Tradesman I6: consumos, sistema del motor y alternador no están en su PDF; se mantuvo el código.
- ram-1500-2026 / Tradesman V6 4x2 y V6 4x4: NO hay PDF para estas versiones; quedaron sin verificar.
- ram-1500-2026: menores omitidos: calcomanías todoterreno (RHO), retraso de apagado de iluminación, controles de audio al volante, alerta de llenado de neumáticos.
- ram-1200-2026 / Bighorn: el PDF marca • tanto en «Fascias negras» como en «Fascia delantera al color» para Bighorn/Bighorn 4X4 (contradicción del PDF); se mantuvo «Delantera al color, trasera metálica».
- ram-1200-2026: menores omitidos: indicador de cambio electrónico (manuales), kit de herramientas, cierre centralizado, alerta de cinturón, cinturones con ajuste de altura, seguro niños, llave navaja, encendedor 12V, asidero de acceso, espejo día/noche, porta gafas/vasos, piso vinilo/alfombra, reconocimiento de voz, sensor de temperatura, iluminación de área de carga/cabina/2ª fila.
- ram-700-2026: menores omitidos: viseras con espejo, alerta de cinturón, consola central extendida, molduras de entrada/paneles premium/protectores laterales de puertas (Laramie).
