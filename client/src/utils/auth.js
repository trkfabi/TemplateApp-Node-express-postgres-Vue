// src/utils/auth.js
import { isStaging } from './environment'

const authTokenKey = isStaging() ? 'staging-authToken' : 'authToken'
const refreshTokenKey = isStaging() ? 'staging-refreshToken' : 'refreshToken'

export function saveAuthToken(token, persistent) {
  persistent
    ? localStorage.setItem(authTokenKey, token)
    : sessionStorage.setItem(authTokenKey, token)
}

export function saveRefreshToken(token, persistent) {
  persistent
    ? localStorage.setItem(refreshTokenKey, token)
    : sessionStorage.setItem(refreshTokenKey, token)
}

export function getAuthToken() {
  return (
    localStorage.getItem(authTokenKey) || sessionStorage.getItem(authTokenKey)
  )
}

export function getRefreshToken() {
  return (
    localStorage.getItem(refreshTokenKey) ||
    sessionStorage.getItem(refreshTokenKey)
  )
}

export function clearTokens() {
  localStorage.removeItem(authTokenKey)
  localStorage.removeItem(refreshTokenKey)
  sessionStorage.removeItem(authTokenKey)
  sessionStorage.removeItem(refreshTokenKey)
}
