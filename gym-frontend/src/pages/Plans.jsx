import { useEffect, useState } from 'react'
import api from '../api/axios'
import ConfirmModal from '../components/ConfirmModal'

function Plans() {
  const [plans, setPlans] = useState([])
  const [members, setMembers] = useState([])
  const [form, setForm] = useState({ name: '', description: '', price: '', duration_days: '' })
  const [editingPlan, setEditingPlan] = useState(null)
  const [activateForm, setActivateForm] = useState({ member_id: '', plan_id: '' })
  const [msg, setMsg] = useState('')
  const [activateMsg, setActivateMsg] = useState('')
  const [modal, setModal] = useState({ open: false, id: null, name: '' })

  useEffect(() => {
    api.get('/plans/').then(r => setPlans(r.data))
    api.get('/members/').then(r => setMembers(r.data))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/plans/', form)
      setPlans([...plans, res.data])
      setMsg('Plan creado correctamente')
      setForm({ name: '', description: '', price: '', duration_days: '' })
    } catch {
      setMsg('Error al crear el plan')
    }
  }

  const handleEdit = (plan) => {
    setEditingPlan(plan)
    setForm({ name: plan.name, description: plan.description, price: plan.price, duration_days: plan.duration_days })
    setMsg('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await api.put(`/plans/${editingPlan.id}/`, form)
      setPlans(plans.map(p => p.id === editingPlan.id ? res.data : p))
      setMsg('Plan actualizado correctamente')
      setEditingPlan(null)
      setForm({ name: '', description: '', price: '', duration_days: '' })
    } catch {
      setMsg('Error al actualizar el plan')
    }
  }

const handleDelete = async () => {
  try {
    await api.delete(`/plans/${modal.id}/`)
    setPlans(plans.filter(p => p.id !== modal.id))
    setMsg('Plan eliminado correctamente')
  } catch {
    setMsg('Error al eliminar el plan')
  } finally {
    setModal({ open: false, id: null, name: '' })
  }
}

  const handleActivate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/memberships/activate/', activateForm)
      setActivateMsg('Membresía activada correctamente')
      setActivateForm({ member_id: '', plan_id: '' })
    } catch (err) {
      setActivateMsg(err.response?.data?.error || 'Error al activar membresía')
    }
  }

  const handleCancelEdit = () => {
    setEditingPlan(null)
    setForm({ name: '', description: '', price: '', duration_days: '' })
    setMsg('')
  }

  return (
    <div style={styles.container}>
      <ConfirmModal
  isOpen={modal.open}
  title="Eliminar plan"
  message={`¿Estás seguro que deseas eliminar el plan "${modal.name}"? Esta acción no se puede deshacer.`}
  confirmText="Sí, eliminar"
  confirmColor="#e63946"
  onConfirm={handleDelete}
  onCancel={() => setModal({ open: false, id: null, name: '' })}
/>
      <h2 style={styles.title}>Planes y Membresías</h2>
      <div style={styles.grid}>

        <div style={styles.card}>
          <h3>{editingPlan ? `Editando: ${editingPlan.name}` : 'Nuevo plan'}</h3>
          {msg && (
            <p style={{ ...styles.msg, color: msg.includes('Error') ? '#e63946' : '#2a9d8f' }}>
              {msg}
            </p>
          )}
          <form onSubmit={editingPlan ? handleUpdate : handleCreate}>
            <input style={styles.input} placeholder="Nombre del plan" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <input style={styles.input} placeholder="Descripción" value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
            <input style={styles.input} placeholder="Precio (S/.)" type="number" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} />
            <input style={styles.input} placeholder="Duración en días" type="number" value={form.duration_days}
              onChange={e => setForm({ ...form, duration_days: e.target.value })} />
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btn}>
                {editingPlan ? 'Guardar cambios' : 'Crear plan'}
              </button>
              {editingPlan && (
                <button type="button" onClick={handleCancelEdit} style={styles.grayBtn}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <h3>Planes disponibles</h3>
          {plans.map(p => (
            <div key={p.id} style={styles.item}>
              <div>
                <strong>{p.name}</strong>
                <p style={styles.sub}>S/. {p.price} | {p.duration_days} días</p>
                <p style={styles.sub}>{p.description}</p>
              </div>
              <div style={styles.actions}>
                <button onClick={() => handleEdit(p)} style={styles.editBtn}>Editar</button>
<button
  onClick={() => setModal({ open: true, id: p.id, name: p.name })}
  style={styles.deleteBtn}
>
  Eliminar
</button>              </div>
            </div>
          ))}
        </div>

        <div style={{ ...styles.card, gridColumn: 'span 2' }}>
          <h3>Activar membresía</h3>
          {activateMsg && (
            <p style={{ ...styles.msg, color: activateMsg.includes('Error') || activateMsg.includes('ya') ? '#e63946' : '#2a9d8f' }}>
              {activateMsg}
            </p>
          )}
          <form onSubmit={handleActivate} style={styles.inlineForm}>
            <select style={styles.input} value={activateForm.member_id}
              onChange={e => setActivateForm({ ...activateForm, member_id: e.target.value })}>
              <option value="">Seleccionar miembro</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select style={styles.input} value={activateForm.plan_id}
              onChange={e => setActivateForm({ ...activateForm, plan_id: e.target.value })}>
              <option value="">Seleccionar plan</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.name} — S/. {p.price}</option>
              ))}
            </select>
            <button type="submit" style={styles.btn}>Activar membresía</button>
          </form>
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
  btn: { flex: 1, padding: '10px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  grayBtn: { flex: 1, padding: '10px', background: '#888', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  btnRow: { display: 'flex', gap: '8px' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  sub: { color: '#888', fontSize: '13px', margin: '2px 0 0' },
  actions: { display: 'flex', gap: '8px', flexShrink: 0 },
  editBtn: { background: '#1a1a2e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { background: '#e63946', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' },
  inlineForm: { display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' },
  msg: { marginBottom: '12px' },
}

export default Plans