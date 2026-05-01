import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <main className="admin-dashboard">
      <h1>Painel Admin</h1>

      <div className="admin-dashboard-actions">
        <button onClick={() => navigate('/admin/produtos')}>
          Painel de Produtos
        </button>

        <button onClick={() => navigate('/admin/banners')}>
          Painel de Banners
        </button>
      </div>
    </main>
  )
}

export default AdminDashboard