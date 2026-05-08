import { useEffect, useState } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

function Booking() {
  const [bookings, setBookings] = useState([])
  const [members, setMembers] = useState([])
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({ member_id: '', gym_class_id: '' })
  const [msg, setMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [modal, setModal] = useState({ open: false, bookingId: null })

  useEffect(() => {
    api.get('/bookings/').then(r => setBookings(r.data))
    api.get('/members/').then(r => setMembers(r.data))
    api.get('/classes/').then(r => setClasses(r.data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/bookings/', form)
      setBookings([...bookings, res.data])
      setMsg('Reserva creada correctamente')
      setIsError(false)
      setForm({ member_id: '', gym_class_id: '' })
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al crear la reserva')
      setIsError(true)
    }
  }

  const handleCancel = async () => {
    try {
      await api.patch(`/bookings/${modal.bookingId}/`, { status: 'CANCELLED' })
      setBookings(bookings.map(b =>
        b.id === modal.bookingId ? { ...b, status: 'CANCELLED' } : b
      ))
      setMsg('Reserva cancelada')
      setIsError(false)
    } catch {
      setMsg('Error al cancelar la reserva')
      setIsError(true)
    } finally {
      setModal({ open: false, bookingId: null })
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Reservas de Clases</h2>

      <ConfirmModal
        isOpen={modal.open}
        title="Cancelar reserva"
        message="¿Estás seguro que deseas cancelar esta reserva? El miembro perderá su lugar en la clase."
        confirmText="Sí, cancelar"
        confirmColor="#e67e22"
        onConfirm={handleCancel}
        onCancel={() => setModal({ open: false, bookingId: null })}
      />

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Nueva reserva</h3>
          {msg && <p style={{ ...styles.msg, color: isError ? '#e63946' : '#2a9d8f' }}>{msg}</p>}
          <form onSubmit={handleSubmit}>
            <select style={styles.input} value={form.member_id}
              onChange={e => setForm({ ...form, member_id: e.target.value })}>
              <option value="">Seleccionar miembro</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select style={styles.input} value={form.gym_class_id}
              onChange={e => setForm({ ...form, gym_class_id: e.target.value })}>
              <option value="">Seleccionar clase</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name} — Cap: {c.capacity}</option>
              ))}
            </select>
            <button type="submit" style={styles.btn}>Reservar</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>Reservas registradas</h3>
          {bookings.map(b => (
            <div key={b.id} style={styles.item}>
              <div>
                <strong>{b.member?.name || `Miembro #${b.member}`}</strong>
                <p style={styles.sub}>
                  {b.gym_class?.name || `Clase #${b.gym_class}`} |
                  <span style={{ color: b.status === 'CONFIRMED' ? '#2a9d8f' : '#e63946' }}>
                    {' '}{b.status}
                  </span>
                </p>
              </div>
              {b.status === 'CONFIRMED' && (
                <button
                  onClick={() => setModal({ open: true, bookingId: b.id })}
                  style={styles.cancelBtn}
                >
                  Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { padding: '32px', background: '#f0f2f5', minHeight: '100vh' },
  title: { marginBottom: '24px', color: '#1a1a2e' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  card: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  sub: { color: '#888', fontSize: '13px', margin: '4px 0 0' },
  cancelBtn: { background: '#e67e22', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' },
  msg: { marginBottom: '12px' },
}

export default Booking