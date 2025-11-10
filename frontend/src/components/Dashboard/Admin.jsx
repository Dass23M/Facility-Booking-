import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import RoomList from '../Rooms/List'
import ResourceList from '../Resources/List'

export default function AdminDashboard() {
  const { logout } = useAuth()

  return (
    <div>
      <nav>
        <Link to="/rooms">Manage Rooms</Link> | 
        <Link to="/resources">Manage Resources</Link> | 
        <button onClick={logout}>Logout</button>
      </nav>
      <h2>Admin Dashboard</h2>
      <RoomList />
      <ResourceList />
    </div>
  )
}