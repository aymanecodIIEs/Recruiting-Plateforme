import { useCallback } from 'react'
import { API_BASE_URL } from '../utils/config'

export function useApi() {
  const request = useCallback(async (path, { method = 'GET', headers, body, query } = {}) => {
    const url = new URL(`${API_BASE_URL}${path}`)
    if (query && typeof query === 'object') {
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
      })
    }

    const response = await fetch(url.toString(), {
      method,
      headers: { 'Content-Type': 'application/json', ...(headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || `Request failed with ${response.status}`)
    }
    const contentType = response.headers.get('content-type') || ''
    return contentType.includes('application/json') ? response.json() : response.text()
  }, [])

  return { request }
}


