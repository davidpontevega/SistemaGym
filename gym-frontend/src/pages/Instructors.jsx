import { useEffect, useState } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

function Instructors() {
    const [instructors, setInstructors] = useState([])
    const [form, setForm] = useState({ name: '', email: '', phone: '', speciality: '', is_active: true })
    const [msg, setMsg] = useState('')
    const [modal, setModal] = useState({ open: false, id: null, name: '' })

    useEffect(() => {
        api.get('/instructors/').then(r => setInstructors(r.data))
    }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const res = await api.post('/instructors/', form)
            setInstructors([...instructors, res.data])
            setMsg('Instructor registrado correctamente')
            setForm({ name: '', email: '', phone: '', speciality: '', is_active: true })
        } catch {
            setMsg('Error al registrar el instructor')
        }
    }
const handleDelete = async () => {
  try {
    await api.delete(`/instructors/${modal.id}/`)
    setInstructors(instructors.filter(i => i.id !== modal.id))
  } catch {
    setMsg('Error al eliminar el instructor')
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
            <h2 style={styles.title}>Gestión de Instructores</h2>
            <div style={styles.grid}>
                <div style={styles.card}>
                    <h3>Nuevo instructor</h3>
                    {msg && <p style={styles.msg}>{msg}</p>}
                    <form onSubmit={handleCreate}>
                        <input style={styles.input} placeholder="Nombre completo" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })} />
                        <input style={styles.input} placeholder="Email" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })} />
                        <input style={styles.input} placeholder="Teléfono" value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })} />
                        <input style={styles.input} placeholder="Especialidad" value={form.speciality}
                            onChange={e => setForm({ ...form, speciality: e.target.value })} />
                        <label style={styles.checkLabel}>
                            <input type="checkbox" checked={form.is_active}
                                onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                            {' '}Activo
                        </label>
                        <button type="submit" style={styles.btn}>Registrar</button>
                    </form>
                </div>

                <div style={styles.card}>
                    <h3>Instructores registrados</h3>
                    {instructors.map(i => (
                        <div key={i.id} style={styles.item}>
                            <div>
                                <strong>{i.name}</strong>
                                <p style={styles.sub}>{i.speciality} | {i.email}</p>
                                <span style={{ ...styles.badge, background: i.is_active ? '#e8f5e9' : '#fce4e4', color: i.is_active ? '#2a9d8f' : '#e63946' }}>
                                    {i.is_active ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
<button
  onClick={() => setModal({ open: true, id: i.id, name: i.name })}
  style={styles.deleteBtn}
>
  Eliminar
</button>                        </div>
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
    btn: { width: '100%', padding: '10px', marginTop: '8px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    sub: { color: '#888', fontSize: '13px', margin: '4px 0 4px' },
    deleteBtn: { background: '#e63946', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
    msg: { color: '#2a9d8f', marginBottom: '12px' },
    checkLabel: { display: 'block', marginBottom: '12px', fontSize: '14px', cursor: 'pointer' },
    badge: { fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: '500' },
}

export default Instructors