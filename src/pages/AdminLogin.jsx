import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      const userRef = doc(db, 'users', userCredential.user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        setError('Usuário sem loja vinculada.')
        return
      }

      const userData = userSnap.data()

      navigate(`/admin/${userData.storeSlug}/dashboard`)
    } catch {
      setError('E-mail ou senha inválidos')
    }
  }

  return (
    <main className="admin-login">
      <form onSubmit={handleLogin} className="admin-form">
        <img src="/logo-orby.png" alt="ORBY" className="orby-login-logo" />

        <h1>ORBY | Login</h1>
        
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