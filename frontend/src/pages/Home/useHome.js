import { useUsersService } from '../../services/users/useUsersService'

export function useHome() {
  const { data: users, isLoading, error, refetch } = useUsersService()
  return { users, isLoading, error, refetch }
}


