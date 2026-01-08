import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'
import { usersApi } from '../api/users.api'

// Toast notification functions (replace with your preferred library)
const showSuccessToast = (message: string) => {
  console.log('✅ Success:', message)
  // toast.success(message)
}

const showErrorToast = (message: string) => {
  console.error('❌ Error:', message)
  // toast.error(message)
}

export const notificationMiddleware: Middleware = (api) => (next) => (action) => {
  // Handle successful mutations
  if (usersApi.endpoints.updateUsername.matchFulfilled(action)) {
    showSuccessToast('Username updated successfully!')
  }

  // Handle failed mutations
  if (usersApi.endpoints.updateUsername.matchRejected(action)) {
    showErrorToast('Failed to update username')
  }

  // Handle any rejected action with value (RTK Query errors)
  if (isRejectedWithValue(action)) {
    console.warn('API Error:', action.payload)
  }

  return next(action)
}