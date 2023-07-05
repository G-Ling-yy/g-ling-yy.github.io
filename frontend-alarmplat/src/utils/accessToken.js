import { storage, tokenTableName } from '@/config'
import cookie from 'js-cookie'

/**
 * @description 获取accessToken
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getAccessToken() {
  if (storage) {
    if (storage === 'localStorage') {
      return localStorage.getItem(tokenTableName)
    } else if (storage === 'sessionStorage') {
      return sessionStorage.getItem(tokenTableName)
    } else if (storage === 'cookie') {
      return cookie.get(tokenTableName)
    } else {
      return localStorage.getItem(tokenTableName)
    }
  } else {
    return localStorage.getItem(tokenTableName)
  }
}

/**
 * @description 存储accessToken
 * @param accessToken
 * @returns {void|*}
 */
export function setAccessToken(accessToken) {
  if (storage) {
    if (storage === 'localStorage') {
      return localStorage.setItem(tokenTableName, accessToken)
    } else if (storage === 'sessionStorage') {
      return sessionStorage.setItem(tokenTableName, accessToken)
    } else if (storage === 'cookie') {
      return cookie.set(tokenTableName, accessToken)
    } else {
      return localStorage.setItem(tokenTableName, accessToken)
    }
  } else {
    return localStorage.setItem(tokenTableName, accessToken)
  }
}

/**
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
export function removeAccessToken() {
  if (storage) {
    if (storage === 'localStorage') {
      return localStorage.removeItem(tokenTableName)
    } else if (storage === 'sessionStorage') {
      return sessionStorage.clear()
    } else if (storage === 'cookie') {
      return cookie.remove(tokenTableName)
    } else {
      return localStorage.removeItem(tokenTableName)
    }
  } else {
    return localStorage.removeItem(tokenTableName)
  }
}
