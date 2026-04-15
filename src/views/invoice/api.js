import Api from '../../api'

/**
 * 步驟一：解密 URL 參數 → 取得發票號碼
 * @param {string} encryptedData - URL query 的 data 參數
 * @returns {Promise<{ invoiceNumber: string }>}
 * @throws returnCode -1 查無發票 / -2 已下載（含 userName, downloadTime）
 */
export async function decryptInvoiceData(encryptedData) {
  const res = await Api.post('/invoice/PostDeObject', {
    data: encryptedData,
  })
  
  const body = res.data

  if (body.invoiceNumber) {
    return { invoiceNumber: body.invoiceNumber }
  }

  const code = Number(body.returnCode)
  if (code === -1) {
    throw { code: -1, message: '找不到發票' }
  }
  if (code === -2) {
    const row = Array.isArray(body.data) ? body.data[0] : body.data
    throw {
      code: -2,
      message: '發票已下載',
      userName: row?.userName ?? '',
      downloadTime: row?.download ?? '',
    }
  }
  if (code !== 0) {
    throw { code, message: '找不到發票' }
  }

  const data = body.data
  if (typeof data === 'string') {
    return { invoiceNumber: data }
  }
  return data
}

/**
 * 步驟二：取得發票資訊（中獎人、車牌、手機）
 * @param {string} invoiceNumber
 * @returns {Promise<{ invoiceNumber, userName, phone, plate, ... }>}
 */
export async function getInvoiceInfo(invoiceNumber) {
  const res = await Api.post('/invoice/get_invoice', {
    invoiceNumber,
  })
  const { returnCode, message, data } = res.data
  const code = Number(returnCode)

  if (code === -2) {
    const row = Array.isArray(data) ? data[0] : data
    throw {
      code: -2,
      message: '發票已下載',
      userName: row?.userName ?? '',
      downloadTime: row?.download ?? '',
    }
  }
  if (code !== 0 || !data) {
    throw { code, message: message || '找不到發票' }
  }

  // data 是陣列，取第一筆
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    throw { code: -1, message: '找不到發票' }
  }
  return row
}

/**
 * 步驟三：下載發票 → 回傳下載網址
 * @param {{ invoiceNumber, userName, phone, plate }} params
 * @returns {Promise<string>} 下載網址
 * @throws returnCode -1 無對應車號或電話的中獎發票
 */
export async function downloadInvoice({ invoiceNumber, userName, phone, plate }) {
  const res = await Api.post('/invoice/download_invoice', {
    invoiceNumber,
    userName,
    phone,
    plate,
  })
  const { returnCode, message, data } = res.data
  const code = Number(returnCode)

  if (code === -1) {
    throw { code: -1, message: message || '無對應車號或電話的中獎發票' }
  }
  if (code !== 0 || !data) {
    throw { code, message: message || '下載發票失敗' }
  }

  return data // 下載網址
}
