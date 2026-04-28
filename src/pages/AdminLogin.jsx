import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin/produtos')
    } catch {
      setError('E-mail ou senha inválidos')
    }
  }

  return (
    <main className="admin-login">
      <form onSubmit={handleLogin} className="admin-form">
        <h1>Login Admin</h1>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit">Entrar</button>
      </form>
    </main>
  )
}

export default AdminLogin