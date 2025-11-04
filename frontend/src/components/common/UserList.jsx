export default function UserList({ users }) {
  if (!users || users.length === 0) return <p className="text-gray-500">No users</p>
  return (
    <ul className="list-disc pl-6">
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  )
}


