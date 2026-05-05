import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import stores from '../config/stores'

function AdminDashboard() {
  const navigate = useNavigate()
  const { storeSlug } = useParams()

  const store = stores[storeSlug]

  const [stats, setStats] = useState({
    products: 0,
    availableProducts: 0,
    banners: 0,
    activeBanners: 0,
  })

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

      if (userData.storeSlug !== storeSlug) {
        navigate(`/admin/${userData.storeSlug}/dashboard`)
        return
      }

      setCheckingAuth(false)
    })

    return () => unsubscribe()
  }, [navigate, storeSlug])

  useEffect(() => {
    if (checkingAuth) return

    async function loadStats() {
      try {
        const productsSnapshot = await getDocs(
          collection(db, 'stores', storeSlug, 'products')
        )

        const bannersSnapshot = await getDocs(
          collection(db, 'stores', storeSlug, 'banners')
        )

        const products = productsSnapshot.docs.map((doc) => doc.data())
        const banners = bannersSnapshot.docs.map((doc) => doc.data())

        setStats({
          products: products.length,
          availableProducts: products.filter((p) => p.available).length,
          banners: banners.length,
          activeBanners: banners.filter((b) => b.active).length,
        })
      } catch (error) {
        console.error(error)
      }
    }

    loadStats()
  }, [storeSlug, checkingAuth])

  useEffect(() => {
    document.title = `Dashboard - ${store?.name || 'ORBY'}`
  }, [store])

  async function handleLogout() {
    await signOut(auth)
    navigate('/admin/login')
  }

  if (checkingAuth) {
    return (
      <main className="orby-dashboard">
        <p>Verificando acesso...</p>
      </main>
    )
  }

  return (
    <main className="orby-dashboard">
      <section className="orby-dashboard-header">
        <div>
          <div className="orby-status-inline">
            <span className="badge">Loja ativa</span>
          </div>

          <h1>{store?.name || 'Minha loja'}</h1>
          <p>{store?.tagline || 'Gerencie sua loja online'}</p>
        </div>

        <button className="orby-logout" onClick={handleLogout}>
          Sair
        </button>
      </section>

      <section className="orby-stats-grid">
        <div className="orby-stat-card">
          <span>Total de produtos</span>
          <strong>{stats.products}</strong>
        </div>

        <div className="orby-stat-card">
          <span>Produtos disponíveis</span>
          <strong>{stats.availableProducts}</strong>
        </div>

        <div className="orby-stat-card">
          <span>Total de banners</span>
          <strong>{stats.banners}</strong>
        </div>

        <div className="orby-stat-card">
          <span>Banners ativos</span>
          <strong>{stats.activeBanners}</strong>
        </div>
      </section>

      <section className="orby-actions-grid">
        <button onClick={() => navigate(`/admin/${storeSlug}/produtos`)}>
          Gerenciar produtos
          <small>Adicionar, editar e remover produtos</small>
        </button>

        <button onClick={() => navigate(`/admin/${storeSlug}/banners`)}>
          Gerenciar banners
          <small>Controlar imagens da página inicial</small>
        </button>

        <button onClick={() => navigate(`/${storeSlug}`)}>
          Ver loja
          <small>Abrir a loja como cliente</small>
        </button>
      </section>
    </main>
  )
}

export default AdminDashboard