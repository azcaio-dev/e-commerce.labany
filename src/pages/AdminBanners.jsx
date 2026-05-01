import { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  async function loadBanners() {
    const snapshot = await getDocs(collection(db, 'banners'))

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    setBanners(data)
  }

  useEffect(() => {
  async function fetchBanners() {
    await loadBanners()
  }

  fetchBanners()
}, [])

  const uploadImage = async (file) => {
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

    if (!file) {
      alert('Selecione uma imagem')
      return
    }

    setLoading(true)

    try {
      const image = await uploadImage(file)

      await addDoc(collection(db, 'banners'), {
        image,
        active: true,
      })

      setFile(null)
      e.target.reset()

      loadBanners()
    } catch (error) {
      console.error(error)
      alert('Erro ao cadastrar banner')
    }

    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Excluir banner?')) return

    await deleteDoc(doc(db, 'banners', id))
    loadBanners()
  }

  async function toggleActive(banner) {
    await updateDoc(doc(db, 'banners', banner.id), {
      active: !banner.active,
    })

    loadBanners()
  }

  return (
    <main className="admin-products">
      <h1>Painel de Banners</h1>

      <form onSubmit={handleSubmit} className="admin-product-form">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Cadastrar Banner'}
        </button>
      </form>

      <div className="admin-list">
        {banners.map((banner) => (
          <div key={banner.id} className="admin-item">
            <img src={banner.image} alt="" />

            <div>
              <p>{banner.active ? 'Ativo' : 'Inativo'}</p>
            </div>

            <div className="admin-actions">
              <button onClick={() => toggleActive(banner)}>
                {banner.active ? 'Desativar' : 'Ativar'}
              </button>

              <button onClick={() => handleDelete(banner.id)}>
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default AdminBanners