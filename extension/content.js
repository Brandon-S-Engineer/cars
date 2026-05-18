const TABS_A_SINCRONIZAR = ['JEEP', 'MAINSTREAM', 'LCV', 'TRANSITO IMA/ AMSA']

function getSpreadsheetId() {
  const match = window.location.href.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return match ? match[1] : null
}

async function syncInventario() {
  const spreadsheetId = getSpreadsheetId()
  if (!spreadsheetId) return

  const results = []

  for (const name of TABS_A_SINCRONIZAR) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(name)}`
      const res = await fetch(url)
      if (!res.ok) continue
      const csv = await res.text()
      if (csv.trim()) results.push({ name, csv })
    } catch (e) {
      // silencioso — fallo de red o tab no existe
    }
  }

  if (results.length === 0) return

  chrome.runtime.sendMessage({ type: 'SYNC_INVENTARIO', tabs: results, spreadsheetId })
}

// Espera 4 segundos a que Google Sheets cargue completamente, luego sincroniza
setTimeout(syncInventario, 4000)
