import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApi } from '../../hooks/useApi'

export function useUsersService() {
  const { request } = useApi()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await request('/users')
      setData(result)
    } catch (e) {
      setError(e)
    } finally {
      setIsLoading(false)
    }
  }, [request])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetchUsers }),
    [data, isLoading, error, fetchUsers],
  )
}


