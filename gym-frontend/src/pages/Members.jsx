import { useEffect, useState } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

function Members() {
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', document_number: '' })
  const [msg, setMsg] = useState('')
  const [modal, setModal] = useState({ open: false, id: null, name: '' })

  useEffect(() => {
    api.get('/members/').then(r => setMembers(r.data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/members/', form)
      setMembers([...members, res.data])
      setMsg('Miembro registrado correctamente')
      setForm({ name: '', email: '', phone: '', document_number: '' })
    } catch {
      setMsg('Error al registrar el miembro')
    }
  }

const handleDelete = async () => {
  try {
    await api.delete(`/members/${modal.id}/`)
    setMembers(members.filter(m => m.id !== modal.id))
  } catch {
    setMsg('Error al eliminar')
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
      <h2 style={styles.title}>Gestión de Miembros</h2>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Nuevo miembro</h3>
          {msg && <p style={styles.msg}>{msg}</p>}
          <form onSubmit={handleCreate}>
            <input style={styles.input} placeholder="Nombre completo" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <input style={styles.input} placeholder="Teléfono" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input style={styles.input} placeholder="Número de documento" value={form.document_number}
              onChange={e => setForm({ ...form, document_number: e.target.value })} />
            <button type="submit" style={styles.btn}>Registrar</button>
          </form>
        </div>

        <div style={styles.card}>
          <h3>Miembros registrados</h3>
          {members.map(m => (
            <div key={m.id} style={styles.item}>
              <div>
                <strong>{m.name}</strong>
                <p style={styles.sub}>{m.email} | Doc: {m.document_number}</p>
              </div>
<button
  onClick={() => setModal({ open: true, id: m.id, name: m.name })}
  style={styles.deleteBtn}
>
  Eliminar
</button>            </div>
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

export default Members