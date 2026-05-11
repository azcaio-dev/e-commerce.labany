import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

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

    setLoading(true)

    try {
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

      alert('Loja criada com sucesso!')
      navigate('/orby-admin/dashboard')
    } catch (error) {
      console.error(error)
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
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Enviando logo e criando loja...' : 'Criar loja'}
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