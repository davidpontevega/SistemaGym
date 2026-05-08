import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

const handleLogout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  navigate('/login')
}

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>🏋️ Gym Manager</span>
      <div style={styles.links}>
        <Link to="/classes" style={styles.link}>Clases</Link>
        <Link to="/booking" style={styles.link}>Reservas</Link>
        <Link to="/members" style={styles.link}>Miembros</Link>
        <Link to="/instructors" style={styles.link}>Instructores</Link>
        <Link to="/plans" style={styles.link}>Planes</Link>
        <button onClick={handleLogout} style={styles.btn}>Cerrar sesión</button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '12px 32px', background: '#1a1a2e', color: '#fff',
  },
  logo: { fontSize: '20px', fontWeight: 'bold' },
  links: { display: 'flex', gap: '24px', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '15px' },
  btn: {
    background: '#e63946', color: '#fff', border: 'none',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px',
  },
}

export default Navbar