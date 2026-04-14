import Swal from 'sweetalert2'

const themed = Swal.mixin({
  confirmButtonColor: '#0d5c63',
  cancelButtonColor: '#888',
  confirmButtonText: '確定',
})

export function alertError(message, title = '發生錯誤') {
  return themed.fire({ icon: 'error', title, text: message })
}

export function alertWarning(message, title = '提醒') {
  return themed.fire({ icon: 'warning', title, text: message })
}

export function alertSuccess(message, title = '成功') {
  return themed.fire({ icon: 'success', title, text: message })
}
