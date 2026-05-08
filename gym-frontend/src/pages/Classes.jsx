import { useEffect, useState } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

function Classes() {
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({ name: '', description: '', capacity: '', duration: '', instructor: '' })
  const [instructors, setInstructors] = useState([])
  const [msg, setMsg] = useState('')
  const [modal, setModal] = useState({ open: false, id: null, name: '' })

  useEffect(() => {
    api.get('/classes/').then(r => setClasses(r.data))
    api.get('/instructors/').then(r => setInstructors(r.data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/classes/', form)
      setClasses([...classes, res.data])
      setMsg('Clase creada correctamente')
      setForm({ name: '', description: '', capacity: '', duration: '', instructor: '' })
    } catch {
      setMsg('Error al crear la clase')
    }
  }


const handleDelete = async () => {
  try {
    await api.delete(`/classes/${modal.id}/`)
    setClasses(classes.filter(c => c.id !== modal.id))
  } catch {
    setMsg('Error al eliminar la clase')
  } finally {
    setModal({ open: false, id: null, name: '' })
  }
}

  return (
    <div style={styles.container}>
      <ConfirmModal
  isOpen={modal.open}
  title="Eliminar miembro"
  message={`¿Estás seguro que deseas eliminar a "${modal.name}"?`}
  confirmText="Sí, eliminar"
  confirmColor="#e63946"
  onConfirm={handleDelete}
  onCancel={() => setModal({ open: false, id: null, name: '' })}
/>
      <h2 style={styles.title}>Clases del Gimnasio</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Nueva clase</h3>
          {msg && <p style={styles.msg}>{msg}</p>}
          <form onSubmit={handleCreate}>
            <input style={styles.input} placeholder="Nombre" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} placeholder="Descripción" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
            <input style={styles.input} placeholder="Capacidad" type="number" value={form.capacity}
              onChange={e => setForm({ ...form, capacity: e.target.value })} />
            <input style={styles.input} placeholder="Duración (min)" type="number" value={form.duration}
              onChange={e => setForm({ ...form, duration: e.target.value })} />
            <select style={styles.input} value={form.instructor}
              onChange={e => setForm({ ...form, instructor: e.target.value })}>
              <option value="">Seleccionar instructor</option>
              {instructors.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
            <button type="submit" style={styles.btn}>Crear clase</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>Clases registradas</h3>
          {classes.map(c => (
            <div key={c.id} style={styles.item}>
              <div>
                <strong>{c.name}</strong>
                <p style={styles.sub}>Capacidad: {c.capacity} | Duración: {c.duration} min</p>
              </div>
<button
  onClick={() => setModal({ open: true, id: c.id, name: c.name })}
  style={styles.deleteBtn}
>
  Eliminar
</button>           </div>
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
  deleteBtn: { background: '#e63946', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  msg: { color: '#2a9d8f', marginBottom: '12px' },
}

export default Classes