import { NavLink } from 'react-router-dom'

export default function NavBar() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`

  return (
    <header className="border-b bg-white">
      <nav className="container mx-auto flex items-center gap-3 p-4">
        <NavLink to="/" className={({ isActive }) => linkClass({ isActive })} end>
          Home
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => linkClass({ isActive })}>
          About
        </NavLink>
      </nav>
    </header>
  )
}


