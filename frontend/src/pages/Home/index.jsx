import { useHome } from './useHome'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import UserList from '../../components/common/UserList'

export default function HomePage() {
  const { users, isLoading, error, refetch } = useHome()

  if (isLoading) return <div>Loading users...</div>
  if (error) return <div className="text-red-600">{error.message}</div>

  return (
    <Container>
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Home</h1>
        <Button onClick={refetch}>Refresh</Button>
        <Card>
          <UserList users={users} />
        </Card>
      </section>
    </Container>
  )
}



