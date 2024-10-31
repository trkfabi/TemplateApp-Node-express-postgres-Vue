// src/utils/auth.js
import { isStaging } from './environment'

const authTokenKey = isStaging() ? 'staging-authToken' : 'authToken'
const refreshTokenKey = isStaging() ? 'staging-refreshToken' : 'refreshToken'

export function saveAuthToken(token) {
  localStorage.setItem(authTokenKey, token)
}

export function saveRefreshToken(token) {
  localStorage.setItem(refreshTokenKey, token)
}

export function getAuthToken() {
  return localStorage.getItem(authTokenKey)
}

export function getRefreshToken() {
  return localStorage.getItem(refreshTokenKey)
}

export function clearTokens() {
  localStorage.removeItem(authTokenKey)
  localStorage.removeItem(refreshTokenKey)
}
