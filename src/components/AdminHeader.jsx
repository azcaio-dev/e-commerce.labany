import { useNavigate, useParams } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'

function AdminHeader() {
  const navigate = useNavigate()
  const { storeSlug } = useParams()

  async function handleLogout() {
    await signOut(auth)
    navigate('/admin/login')
  }

  return (
    <header className="orby-header">
      <button className="orby-header-back" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <img src="/logo-orby.png" alt="ORBY" className="orby-header-logo" />

      <div className="orby-header-actions">
        <button onClick={() => navigate(`/${storeSlug}`)}>
          Ver loja
        </button>

        <button onClick={handleLogout} className="logout">
          Sair
        </button>
      </div>
    </header>
  )
}

export default AdminHeader