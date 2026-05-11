import { useEffect, useState } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import Toast from '../components/Toast'
import { useParams } from 'react-router-dom'
import AdminHeader from '../components/AdminHeader'

function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const { storeSlug } = useParams()

  function showToast(message, type = 'success') {
    setToast({ message, type })

    setTimeout(() => {
      setToast({ message: '', type: 'success' })
    }, 2500)
  }

  async function loadBanners() {
    const snapshot = await getDocs(
      collection(db, 'stores', storeSlug, 'banners')
    )

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
    }, [storeSlug])

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
      showToast('Selecione uma imagem', 'warning')
      return
    }

    setLoading(true)

    try {
      const image = await uploadImage(file)

      await addDoc(collection(db, 'stores', storeSlug, 'banners'), {
        image,
        active: true,
      })

      setFile(null)
      e.target.reset()
      loadBanners()

      showToast('Banner cadastrado com sucesso!', 'success')
    } catch (error) {
      console.error(error)
      showToast('Erro ao cadastrar banner', 'error')
    }

    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Deseja excluir este banner?')) return

    await deleteDoc(doc(db, 'stores', storeSlug, 'banners', id))
    loadBanners()
    showToast('Banner excluído', 'success')
  }

  async function toggleActive(banner) {
    await updateDoc(doc(db, 'stores', storeSlug, 'banners', banner.id), {
      active: !banner.active,
    })

    loadBanners()

    showToast(
      banner.active ? 'Banner desativado' : 'Banner ativado',
      'success'
    )
  }

  return (
    <>
      <AdminHeader />
    <main className="orby-admin-page">
      <section className="orby-admin-header">
        <div>
          <h1>Banners</h1>
          <p>Cadastre e controle os banners da página inicial.</p>
        </div>
      </section>

      <section className="orby-admin-layout">
        <form onSubmit={handleSubmit} className="orby-admin-form">
          <label>Imagem do banner</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Cadastrar banner'}
          </button>
        </form>

        <section className="orby-admin-list">
          <div className="orby-list-header">
            <h2>Banners cadastrados</h2>
            <span>{banners.length} banner(s)</span>
          </div>

          {banners.map((banner) => (
            <div key={banner.id} className="orby-admin-banner">
              <img
                src={banner.image}
                alt="Banner"
                loading='lazy'
                onError={(e) => {
                  e.target.src = '/placeholder.png'
                }}
              />

              <div className="orby-banner-info">
                <strong>{banner.active ? 'Ativo' : 'Inativo'}</strong>

                <div className="admin-actions">
                  <button onClick={() => toggleActive(banner)}>
                    {banner.active ? 'Desativar' : 'Ativar'}
                  </button>

                  <button onClick={() => handleDelete(banner.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </section>

      <Toast message={toast.message} type={toast.type} />
    </main>
    </>
  )
}

export default AdminBanners