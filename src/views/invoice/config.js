/**
 * 模擬後端回傳的中獎發票資料
 * TODO: 上線時改為真實 API endpoint
 */
const MOCK_INVOICE_DATA = {
  downloaded: false,
  winnerName: '王小明',
  plate: 'ABC-1234',
  phone: '0912345678',
  downloadedAt: null,
  downloadedBy: null,
}

export async function fetchInvoiceData(/* token */) {
  // TODO: return fetch(`/api/invoice/${token}`).then(r => r.json())
  return MOCK_INVOICE_DATA
}

export async function downloadInvoice(/* token */) {
  // TODO: 呼叫 API 取得 PDF blob → 觸發下載
  return true
}
