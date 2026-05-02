import { createPortal } from 'react-dom'

function Toast({ message, type = 'success' }) {
  if (!message) return null

  return createPortal(
    <div className={`toast toast-${type}`}>
      {message}
    </div>,
    document.body
  )
}

export default Toast