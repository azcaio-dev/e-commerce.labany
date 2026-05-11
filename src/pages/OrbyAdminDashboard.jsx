import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../services/firebase'

function OrbyAdminDashboard() {
  const navigate = useNavigate()

  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/admin/login')
        return
      }

      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)

      if (!userSnap.exists()) {
        await signOut(auth)
        navigate('/admin/login')
        return
      }

      const userData = userSnap.data()

      if (userData.role !== 'orbyOwner') {
        alert('Acesso negado')
        navigate('/admin/login')
        return
      }

      setCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (checkingAuth) return

    async function loadStores() {
      try {
        const snapshot = await getDocs(collection(db, 'stores'))

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setStores(data)
      } catch (error) {
        console.error('Erro ao carregar lojas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStores()
  }, [checkingAuth])

  async function toggleStoreStatus(store) {
    try {
      await updateDoc(doc(db, 'stores', store.id), {
        active: store.active === false,
      })

      setStores((prev) =>
        prev.map((item) =>
          item.id === store.id
            ? { ...item, active: store.active === false }
            : item
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar status da loja:', error)
      alert('Erro ao atualizar status da loja')
    }
  }

  async function deleteStore(store) {
    const confirmDelete = confirm(
      `Deseja excluir a loja "${store.name}"?`
    )

    if (!confirmDelete) return

    try {
      await deleteDoc(doc(db, 'stores', store.id))

      setStores((prev) =>
        prev.filter((item) => item.id !== store.id)
      )

      alert('Loja excluída com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir loja')
    }
  }

  async function duplicateStore(store) {
    const newName = prompt('Nome da nova loja:')

    if (!newName) return

    const newSlug = prompt('Slug da nova loja:')

    if (!newSlug) return

    const whatsapp = prompt('WhatsApp da nova loja:') || ''
    const instagram = prompt('Instagram da nova loja:') || ''

    const copyProducts = confirm(
      'Deseja copiar os produtos da loja original?'
    )

    const copyBanners = confirm(
      'Deseja copiar os banners da loja original?'
    )

    try {
      const originalRef = doc(db, 'stores', store.id)
      const originalSnap = await getDoc(originalRef)

      if (!originalSnap.exists()) {
        alert('Loja original não encontrada')
        return
      }

      const originalData = originalSnap.data()

      await setDoc(doc(db, 'stores', newSlug), {
        ...originalData,
        name: newName,
        title: `${newName} | ORBY`,
        whatsapp,
        instagram,
        active: true,
      })

      if (copyProducts) {
        const productsSnapshot = await getDocs(
          collection(db, 'stores', store.id, 'products')
        )

        for (const productDoc of productsSnapshot.docs) {
          await setDoc(
            doc(db, 'stores', newSlug, 'products', productDoc.id),
            productDoc.data()
          )
        }
      }

      if (copyBanners) {
        const bannersSnapshot = await getDocs(
          collection(db, 'stores', store.id, 'banners')
        )

        for (const bannerDoc of bannersSnapshot.docs) {
          await setDoc(
            doc(db, 'stores', newSlug, 'banners', bannerDoc.id),
            bannerDoc.data()
          )
        }
      }

      const snapshot = await getDocs(collection(db, 'stores'))

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setStores(data)

      alert('Loja duplicada com sucesso!')
    } catch (error) {
      console.error(error)
      alert('Erro ao duplicar loja')
    }
  }

  async function handleLogout() {
    await signOut(auth)
    navigate('/admin/login')
  }

  if (checkingAuth || loading) {
    return (
      <main className="orby-dashboard">
        <p>Carregando painel ORBY...</p>
      </main>
    )
  }

  return (
    <main className="orby-dashboard">
      <section className="orby-dashboard-header">
        <div>
          <div className="orby-status-inline">
            <span className="badge">Painel Master</span>
          </div>

          <h1>ORBY Admin</h1>
          <p>Gerencie todas as lojas da plataforma.</p>
        </div>

        <button className="orby-logout" onClick={handleLogout}>
          Sair
        </button>
      </section>

      <section className="orby-stats-grid">
        <div className="orby-stat-card">
          <span>Total de lojas</span>
          <strong>{stores.length}</strong>
        </div>

        <div className="orby-stat-card">
          <span>
            <span className="orby-stat-dot orby-stat-dot--active" />
            Lojas ativas
          </span>
          <strong>
            {stores.filter((store) => store.active !== false).length}
          </strong>
        </div>

        <div className="orby-stat-card">
          <span>
            <span className="orby-stat-dot orby-stat-dot--inactive" />
            Lojas inativas
          </span>
          <strong>
            {stores.filter((store) => store.active === false).length}
          </strong>
        </div>
      </section>

      <section className="orby-admin-list">
        <div className="orby-list-header">
          <h2>Lojas cadastradas <span>{stores.length} loja(s)</span></h2>
          <button
            className="orby-nova-loja-btn"
            onClick={() => navigate('/orby-admin/criar-loja')}
          >
            + Nova loja
          </button>
        </div>

        {stores.map((store) => (
          <div key={store.id} className="orby-admin-item">
            <img
              src={store.logo || '/placeholder.png'}
              alt={store.name}
              loading="lazy"
            />

            <div className="orby-admin-item-info">
              <strong>{store.name}</strong>
              <p>{store.tagline}</p>
              <p>Slug: {store.id}</p>
              <span className={`orby-status-pill ${store.active === false ? 'orby-status-pill--inactive' : 'orby-status-pill--active'}`}>
                <span className="orby-status-dot" />
                {store.active === false ? 'Inativa' : 'Ativa'}
              </span>
            </div>

            <div className="admin-actions">
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => navigate(`/${store.id}`)}
              >
                Ver loja
              </button>

              <button
                className="admin-btn admin-btn--neutral"
                onClick={() => navigate(`/admin/${store.id}/dashboard`)}
              >
                Painel da loja
              </button>

              <button
                className="admin-btn admin-btn--neutral"
                onClick={() => navigate(`/orby-admin/editar-loja/${store.id}`)}
              >
                Editar
              </button>

              <button
                className="admin-btn admin-btn--danger-outline"
                onClick={() => deleteStore(store)}
              >
                Excluir
              </button>

              <button
                className="admin-btn admin-btn--neutral"
                onClick={() => duplicateStore(store)}
              >
                Duplicar
              </button>

              <button
                className="admin-btn admin-btn--danger"
                onClick={() => toggleStoreStatus(store)}
              >
                {store.active === false ? 'Ativar' : 'Inativar'}
              </button>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default OrbyAdminDashboard