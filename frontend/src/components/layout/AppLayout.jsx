import NavBar from '../common/NavBar'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">{children}</main>
      <footer className="p-4 text-center text-sm text-gray-500">Recruiting Platform</footer>
    </div>
  )
}


