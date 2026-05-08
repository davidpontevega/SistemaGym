function ConfirmModal({ isOpen, title, message, confirmText, confirmColor, onConfirm, onCancel }) {
    if (!isOpen) return null

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.iconWrap}>
                    <span style={styles.icon}>⚠️</span>
                </div>
                <h3 style={styles.title}>{title}</h3>
                <p style={styles.message}>{message}</p>
                <div style={styles.btnRow}>
                    <button onClick={onCancel} style={styles.cancelBtn}>
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{ ...styles.confirmBtn, background: confirmColor || '#e63946' }}
                    >
                        {confirmText || 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        background: '#fff', borderRadius: '16px',
        padding: '36px 32px', width: '380px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center', animation: 'fadeIn .15s ease',
    },
    iconWrap: {
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#fff4e5', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px',
    },
    icon: { fontSize: '28px' },
    title: { fontSize: '18px', fontWeight: '600', color: '#1a1a2e', margin: '0 0 8px' },
    message: { fontSize: '14px', color: '#666', margin: '0 0 28px', lineHeight: '1.6' },
    btnRow: { display: 'flex', gap: '12px' },
    cancelBtn: {
        flex: 1, padding: '11px', background: '#f0f2f5',
        color: '#444', border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '500', cursor: 'pointer',
    },
    confirmBtn: {
        flex: 1, padding: '11px', color: '#fff',
        border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '500', cursor: 'pointer',
    },
}

export default ConfirmModal