import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { db, secondaryAuth } from '../services/firebase'

function OrbyCreateStore() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [tagline, setTagline] = useState('')
  const [logoFile, setLogoFile] = useState(null)
  const [whatsapp, setWhatsapp] = useState('')
  const [instagram, setInstagram] = useState('')
  const [email, setEmail] = useState('')

  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [createLogin, setCreateLogin] = useState(false)

  const uploadLogo = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'loja-labany')

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dcqroxlt0/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message)
    }

    return data.secure_url
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!slug) {
      alert('Informe o slug da loja')
      return
    }

    if (createLogin) {
      if (!adminEmail) {
        alert('Informe o e-mail do admin')
        return
      }

      if (!adminPassword) {
        alert('Informe a senha do admin')
        return
      }

      if (adminPassword.length < 6) {
        alert('A senha precisa ter pelo menos 6 caracteres.')
        return
      }
    }

    setLoading(true)

    try {
      const existingSnap = await getDoc(doc(db, 'stores', slug))

      if (existingSnap.exists()) {
        alert('Já existe uma loja com esse slug.')
        setLoading(false)
        return
      }

      let logoUrl = ''

      if (logoFile) {
        logoUrl = await uploadLogo(logoFile)
      }

      await setDoc(doc(db, 'stores', slug), {
        name,
        title: `${name} | ORBY`,
        tagline,
        logo: logoUrl,
        whatsapp,
        instagram,
        email,
        active: true,

        colors: {
          primary: '#c5a19c',
          secondary: '#eee3cf',
          background: '#f8f1ec',
          text: '#4f3f3c',
        },

        menu: {
          showBrands: true,
          showCategories: true,
          brandsLabel: 'Marcas',
          categoriesLabel: 'Categorias',
        },

        checkout: {
          messageIntro: 'Olá! Tenho interesse nesses produtos:',
        },
      })

      if (createLogin) {
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          adminEmail,
          adminPassword
        )

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: adminEmail,
          storeSlug: slug,
          role: 'storeAdmin',
          createdAt: new Date(),
        })
      }

      alert(
        createLogin
          ? 'Loja criada e login configurado com sucesso!'
          : 'Loja criada com sucesso!'
      )
      navigate('/orby-admin/dashboard')
    } catch (error) {
      console.error(error)

      if (error.code === 'auth/email-already-in-use') {
        alert('Esse e-mail já está sendo usado em outro login.')
        return
      }

      if (error.code === 'auth/invalid-email') {
        alert('E-mail inválido.')
        return
      }

      if (error.code === 'auth/weak-password') {
        alert('Senha muito fraca. Use pelo menos 6 caracteres.')
        return
      }

      alert('Erro ao criar loja')
    }

    setLoading(false)
  }

  return (
    <main className="orby-admin-page">
      <section className="orby-admin-header">
        <div>
          <h1>Criar nova loja</h1>
          <p>Cadastre uma nova loja na plataforma ORBY.</p>
        </div>
      </section>

      <section className="orby-admin-layout">
        <form onSubmit={handleSubmit} className="orby-admin-form">
          <input
            type="text"
            placeholder="Nome da loja"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Slug da loja"
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, '')
              )
            }
            required
          />

          <input
            type="text"
            placeholder="Tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />

          <label>Logo da loja</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
          />

          <input
            type="text"
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />

          <input
            type="text"
            placeholder="Instagram URL"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />

          <input
            type="email"
            placeholder="E-mail da loja"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="orby-switch-row">
            <span>Criar login e senha para o admin da loja</span>
            <input
              type="checkbox"
              checked={createLogin}
              onChange={(e) => setCreateLogin(e.target.checked)}
            />
            <span className="orby-switch" />
          </label>

          {createLogin && (
            <>
              <input
                type="email"
                placeholder="E-mail de login do admin"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Senha do admin (mín. 6 caracteres)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? 'Criando loja...' : 'Criar loja'}
          </button>

          <button
            type="button"
            className="cancel-edit"
            onClick={() => navigate('/orby-admin/dashboard')}
          >
            Voltar
          </button>
        </form>
      </section>
    </main>
  )
}

export default OrbyCreateStore