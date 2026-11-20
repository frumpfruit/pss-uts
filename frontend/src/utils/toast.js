import { gooeyToast } from 'goey-toast'

/**
 * Enterprise Toast Notification Helper powered by goey-toast
 * Position: bottom-right (aligned to UDINUS layout)
 * Presets available: 'bouncy' | 'smooth' | 'snappy' | 'subtle'
 */
export const toast = {
  // 1. Success Toast (hijau emerald)
  success: (title, description, options = {}) => {
    return gooeyToast.success(title, {
      description,
      duration: 3500,
      showProgress: true,
      preset: 'bouncy',
      ...options,
    })
  },

  // 2. Error Toast (merah rose)
  error: (title, description, options = {}) => {
    return gooeyToast.error(title, {
      description,
      duration: 4500,
      showProgress: true,
      preset: 'snappy',
      ...options,
    })
  },

  // 3. Warning Toast (kuning amber)
  warning: (title, description, options = {}) => {
    return gooeyToast.warning(title, {
      description,
      duration: 4000,
      showProgress: true,
      preset: 'bouncy',
      ...options,
    })
  },

  // 4. Info Toast (biru navy khas UDINUS)
  info: (title, description, options = {}) => {
    return gooeyToast.info(title, {
      description,
      duration: 3500,
      showProgress: true,
      preset: 'smooth',
      ...options,
    })
  },

  // 5. Default / Neutral Toast
  default: (title, description, options = {}) => {
    return gooeyToast(title, {
      description,
      duration: 3500,
      preset: 'smooth',
      ...options,
    })
  },

  // 6. Action Toast (dengan tombol aksi interaktif)
  action: (title, description, actionLabel, onAction, options = {}) => {
    return gooeyToast(title, {
      description,
      duration: 5000,
      action: {
        label: actionLabel,
        onClick: onAction,
      },
      preset: 'bouncy',
      showProgress: true,
      ...options,
    })
  },

  // 7. Promise Toast (animasi gooey morphing: loading -> success / error)
  promise: (promiseInstance, data) => {
    return gooeyToast.promise(promiseInstance, {
      preset: 'bouncy',
      ...data,
    })
  },

  // 8. Update Toast yang sedang aktif
  update: (id, options) => {
    return gooeyToast.update(id, options)
  },

  // 9. Tutup / Dismiss Toast
  dismiss: (idOrFilter) => {
    return gooeyToast.dismiss(idOrFilter)
  },
}

export { gooeyToast, gooeyToast as goeyToast }
