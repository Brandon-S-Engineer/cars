// name: como se muestra en el dashboard · aliases: nombres de pestaña a probar en el Sheet, en orden
const TABS_A_SINCRONIZAR = [
  { name: 'JEEP' },
  { name: 'MAINSTREAM' },
  { name: 'LCV' },
  { name: 'TRANSITO IMA/ AMSA' },
  { name: 'LEAPMOTOR' },
  { name: 'LIQUIDACION STELLANTIS', aliases: ['LIQUIDACION STELLANTIS', 'LIQUIDACION'] },
  { name: 'TURBOFIN' },
  { name: 'DEMOS VTA ENERO' },
]

function getSpreadsheetId() {
  const match = window.location.href.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

async function fetchTab(spreadsheetId, sheetName) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
    const res = await fetch(url)
    if (!res.ok) return null
    const csv = await res.text()
    return csv.trim() ? csv : null
  } catch (e) {
    return null // silencioso — fallo de red
  }
}

async function syncInventario() {
  const spreadsheetId = getSpreadsheetId()
  if (!spreadsheetId) return

  const results = []
  const seen = new Set()

  for (const { name, aliases } of TABS_A_SINCRONIZAR) {
    for (const sheetName of aliases ?? [name]) {
      const csv = await fetchTab(spreadsheetId, sheetName)
      // Si la pestaña no existe, Google regresa la PRIMERA hoja en su lugar.
      // Un CSV idéntico a otro ya sincronizado significa eso: se descarta.
      if (!csv || seen.has(csv)) continue
      seen.add(csv)
      results.push({ name, csv })
      break
    }
  }

  if (results.length === 0) return

  chrome.runtime.sendMessage({ type: 'SYNC_INVENTARIO', tabs: results, spreadsheetId })
}

// Espera 4 segundos a que Google Sheets cargue completamente, luego sincroniza
setTimeout(syncInventario, 4000)
