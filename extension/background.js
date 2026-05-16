chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== 'SYNC_INVENTARIO') return true

  fetch('https://cars-git-main-brandon-i-sorias-projects.vercel.app/api/inventario/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tabs: message.tabs, spreadsheetId: message.spreadsheetId }),
  })
    .then((r) => r.json())
    .then((data) => sendResponse({ ok: true, data }))
    .catch((err) => sendResponse({ ok: false, error: err.message }))

  return true
})
