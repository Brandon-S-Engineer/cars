# Tarea para Fable: verificar fichas técnicas contra los PDF oficiales

## Contexto

Tienes dos fuentes:

1. **`fichas-export.md`** — las fichas técnicas de los autos tal como están hoy en el
   sitio web. Cada versión muestra su ficha COMPLETA y final (marca, modelo, año,
   versión, y specs agrupadas por categoría: Desempeño, Interior, Exterior, Seguridad…).
2. **Los PDF oficiales** de cada coche (las fichas del fabricante / agencia) que te
   adjunto aparte. Esta es la fuente de la verdad.

Tu trabajo es **comparar `fichas-export.md` contra los PDF** y reportar todo lo que
NO coincida, para que se corrija en el código.

## Reglas de comparación

- El PDF manda. Si un valor en `fichas-export.md` no coincide con el PDF, es un error.
- Compara **por versión**. El nombre de la versión y el `versionId` aparecen en el
  export — cópialos tal cual en tu reporte para poder localizar el dato.
- **Ignora diferencias de formato** que no cambian el significado: mayúsculas/minúsculas,
  acentos, comas de miles (2,744 vs 2744), "Sí/No" vs "S$/Disponible", orden de palabras,
  unidades equivalentes (hp/cv solo si el número real difiere). NO reportes esto.
- **SÍ reporta**:
  - Valor incorrecto (el número/dato es distinto al del PDF).
  - Spec que el PDF dice que la versión SÍ tiene pero el export marca como "No incluido".
  - Spec que el export dice que tiene pero el PDF dice que NO.
  - Spec presente en el PDF que falta por completo en el export.
  - Spec en el export que no existe en el PDF (posible spec inventada o de otra versión).
- Si **no estás seguro** (el PDF es ambiguo, ilegible, o no menciona ese dato),
  NO lo marques como error: ponlo en la sección "DUDAS" al final.
- Si una versión del export **no tiene PDF**, anótala en "SIN PDF" y no la verifiques.

## Formato de salida (MUY IMPORTANTE)

Escribe TODO tu reporte en un archivo llamado **`fichas-correcciones.md`**.

Usa EXACTAMENTE este formato por cada error. Un bloque por cada spec incorrecta:

```
## [marca] [modelo] [año] — [nombre de la versión]
versionId: `el-version-id-del-export`
categoria: [nombre de la categoría, ej: Desempeño]
label: [el label exacto del spec, ej: Potencia]
actual: [el valor que está hoy en el export]
correcto: [el valor que dice el PDF]
nota: [opcional — solo si necesitas aclarar algo]
```

Ejemplo real:

```
## Jeep Grand Cherokee 2026 — Altitude 4X2
versionId: `altitude-4x2`
categoria: Desempeño
label: Potencia
actual: 324 hp
correcto: 293 hp
nota: el PDF lista 293 hp para la versión 4X2 con motor base
```

Para specs que FALTAN en el export (están en el PDF pero no en el código):

```
## [marca] [modelo] [año] — [versión]
versionId: `...`
categoria: [categoría donde debería ir]
label: [label nuevo]
actual: (no existe en el export)
correcto: [valor del PDF]
```

Para specs que SOBRAN (en el export pero no en el PDF):

```
## [marca] [modelo] [año] — [versión]
versionId: `...`
categoria: [categoría]
label: [label]
actual: [valor del export]
correcto: (no existe en el PDF — debería eliminarse)
```

Al final del archivo, agrega estas dos secciones:

```
# DUDAS
- [marca/modelo/versión] · [label] · [por qué dudas]

# SIN PDF
- [marca/modelo/versión que no pudiste verificar por falta de PDF]
```

## Importante

- **No reescribas `fichas-export.md`.** Solo léelo. Tu único output es
  `fichas-correcciones.md`.
- Sé exhaustivo pero conservador: ante la duda, va a "DUDAS", no a un bloque de error.
- Copia los `versionId`, `categoria` y `label` **letra por letra** del export — así
  el dato se localiza y corrige sin ambigüedad.
- Si todo en una versión está correcto, no escribas nada de esa versión (no hace falta
  confirmar lo que está bien).
