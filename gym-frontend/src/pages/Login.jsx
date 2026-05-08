import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.post('/auth/login/', form)
localStorage.setItem('access_token', res.data.access)
localStorage.setItem('refresh_token', res.data.refresh)
      navigate('/classes')
    } catch (err) {
      setError('Usuario o contraseña incorrectos')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏋️ Gym Manager</h2>
        <p style={styles.sub}>Inicia sesión para continuar</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Usuario"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" style={styles.btn}>Ingresar</button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#f0f2f5',
  },
  card: {
    background: '#fff', padding: '40px', borderRadius: '12px',
    width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: { textAlign: 'center', marginBottom: '4px', color: '#1a1a2e' },
  sub: { textAlign: 'center', color: '#888', marginBottom: '24px' },
  input: {
    width: '100%', padding: '12px', marginBottom: '16px',
    borderRadius: '8px', border: '1px solid #ddd',
    fontSize: '14px', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '12px', background: '#1a1a2e',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '15px', cursor: 'pointer',
  },
  error: { color: '#e63946', marginBottom: '12px', textAlign: 'center' },
}

export default Login