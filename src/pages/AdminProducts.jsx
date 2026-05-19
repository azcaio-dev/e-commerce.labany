import { useEffect, useState, useRef } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../services/firebase'
import Toast from '../components/Toast'
import AdminHeader from '../components/AdminHeader'
import useStore from '../hooks/useStore'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)

  const { store, loading: storeLoading, storeSlug } = useStore()

  const brandLabel = store?.menu?.brandsLabel || 'Marca'
  const categoryLabel = store?.menu?.categoriesLabel || 'Peças'

  const [name, setName] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [productSection, setProductSection] = useState('')
  const [sizeType, setSizeType] = useState('letter')
  const [sizes, setSizes] = useState([])
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
  })

  const navigate = useNavigate()
  const formRef = useRef(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })

    setTimeout(() => {
      setToast({
        message: '',
        type: 'success',
      })
    }, 2500)
  }

  const brands = [
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ]

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ]

  const letterSizes = [
    'PP',
    'P',
    'M',
    'G',
    'GG',
    'G1',
    'G2',
    'G3',
  ]
  const numberSizes = [
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
  ]

  const sizeOptions =
    sizeType === 'letter'
      ? letterSizes
      : sizeType === 'number'
      ? numberSizes
      : ['Tamanho único']

  function toggleSize(size) {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    )
  }

  useEffect(() => {
    if (store) {
      document.title = `Produtos - ${store.name}`
    }
  }, [store])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/admin')
      }
    })

    return () => unsubscribe()
  }, [navigate])

  async function loadProducts() {
    const snapshot = await getDocs(
      collection(db, 'stores', storeSlug, 'products')
    )

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    setProducts(data)
  }

  useEffect(() => {
    async function fetchProducts() {
      const snapshot = await getDocs(
        collection(db, 'stores', storeSlug, 'products')
      )

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setProducts(data)
    }

    fetchProducts()
  }, [storeSlug])

  function compressImage(
    file,
    maxWidth = 1000,
    quality = 0.75
  ) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const reader = new FileReader()

      reader.onload = (e) => {
        img.src = e.target.result
      }

      img.onload = () => {
        const canvas = document.createElement('canvas')

        const scale = Math.min(maxWidth / img.width, 1)

        canvas.width = img.width * scale
        canvas.height = img.height * scale

        const ctx = canvas.getContext('2d')

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        )

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(
                new Error('Erro ao comprimir imagem')
              )
              return
            }

            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '.webp'),
              {
                type: 'image/webp',
              }
            )

            resolve(compressedFile)
          },
          'image/webp',
          quality
        )
      }

      img.onerror = reject
      reader.onerror = reject

      reader.readAsDataURL(file)
    })
  }

  const uploadImage = async (file) => {
    const compressedFile = await compressImage(file)

    const formData = new FormData()

    formData.append('file', compressedFile)
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

  function clearForm() {
    setName('')
    setOldPrice('')
    setPrice('')
    setDescription('')
    setFile1(null)
    setFile2(null)
    setEditingId(null)
    setBrand('')
    setCategory('')
    setProductSection('')
    setSizeType('letter')
    setSizes([])
  }

  function handleEdit(product) {
    setEditingId(product.id)

    setName(product.name || '')
    setOldPrice(product.oldPrice ?? '')
    setPrice(product.price || '')
    setDescription(product.description || '')
    setBrand(product.brand || '')
    setCategory(product.category || '')
    setProductSection(product.productSection || '')
    setSizeType(product.sizeType || 'letter')
    setSizes(product.sizes || [])

    setFile1(null)
    setFile2(null)

    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (sizes.length === 0) {
      showToast(
        'Selecione pelo menos um tamanho',
        'warning'
      )
      return
    }

    setLoading(true)

    try {
      if (editingId) {
        const updatedData = {
          name,
          oldPrice: oldPrice
            ? Number(oldPrice)
            : null,
          price: Number(price),
          description,
          brand,
          category,
          productSection,
          sizeType,
          sizes,
        }

        if (file1) {
          updatedData.image = await uploadImage(file1)
        }

        if (file2) {
          updatedData.image2 = await uploadImage(file2)
        }

        await updateDoc(
          doc(
            db,
            'stores',
            storeSlug,
            'products',
            editingId
          ),
          updatedData
        )

        showToast(
          'Produto atualizado com sucesso!',
          'success'
        )
      } else {
        if (!file1 || !file2) {
          showToast(
            'Selecione as duas imagens',
            'warning'
          )

          setLoading(false)

          return
        }

        const [image1, image2] = await Promise.all([
          uploadImage(file1),
          uploadImage(file2),
        ])

        await addDoc(
          collection(
            db,
            'stores',
            storeSlug,
            'products'
          ),
          {
            name,
            oldPrice: oldPrice
              ? Number(oldPrice)
              : null,
            price: Number(price),
            description,
            brand,
            category,
            productSection,
            sizeType,
            sizes,
            image: image1,
            image2,
            available: true,
          }
        )

        showToast(
          'Produto cadastrado com sucesso!',
          'success'
        )
      }

      clearForm()

      e.target.reset()

      loadProducts()
    } catch (error) {
      console.error(error)

      showToast(
        'Erro ao salvar produto',
        'error'
      )
    }

    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Deseja excluir este produto?'))
      return

    await deleteDoc(
      doc(db, 'stores', storeSlug, 'products', id)
    )

    loadProducts()
  }

  async function toggleAvailable(product) {
    await updateDoc(
      doc(
        db,
        'stores',
        storeSlug,
        'products',
        product.id
      ),
      {
        available: !product.available,
      }
    )

    loadProducts()
  }

  if (storeLoading || !store) {
    return null
  }

  return (
    <>
      <AdminHeader />

      <main className="orby-admin-page">
        <section className="orby-admin-header">
          <div>
            <h1>Produtos</h1>

            <p>
              Cadastre, edite e gerencie os produtos
              da {store.name}.
            </p>
          </div>
        </section>

        <section className="orby-admin-layout">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="orby-admin-form"
          >
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Preço antigo (opcional)"
              value={oldPrice}
              onChange={(e) => setOldPrice(e.target.value)}
            />

            <input
              type="number"
              placeholder="Preço atual"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            {store.menu?.showBrands !== false && (
              <>
                <input
                  type="text"
                  placeholder={brandLabel}
                  list="brand-options"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />

                <datalist id="brand-options">
                  {brands.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </>
            )}

            {store.menu?.showCategories !== false && (
              <>
                <input
                  type="text"
                  placeholder={categoryLabel}
                  list="category-options"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />

                <datalist id="category-options">
                  {categories.map((item) => (
                    <option key={item} value={item} />
                  ))}
                </datalist>
              </>
            )}

            <select
              value={sizeType}
              onChange={(e) => {
                setSizeType(e.target.value)
                setSizes(e.target.value === 'unique' ? ['Tamanho único'] : [])
              }}
            >
              <option value="letter">Tamanho por letra</option>
              <option value="number">Tamanho por número</option>
              <option value="unique">Tamanho único</option>
            </select>

            <div className="sizes-box">
              {sizeOptions.map((size) => (
                <button
                  type="button"
                  key={size}
                  className={`size-button ${sizes.includes(size) ? 'active' : ''}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label>Imagem 1 {editingId && '(opcional)'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile1(e.target.files[0])}
              required={!editingId}
            />

            <label>Imagem 2 {editingId && '(opcional)'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile2(e.target.files[0])}
              required={!editingId}
            />

            <div className="product-section-box">
              <p>Seção do produto</p>

              <div className="product-section-options">
                {[
                  { label: 'Lançamento', value: 'launch' },
                  { label: 'Outlet', value: 'outlet' },
                  { label: 'Mais vendidos', value: 'bestseller' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.value}
                    className={`section-button ${
                      productSection === item.value ? 'active' : ''
                    }`}
                    onClick={() => setProductSection(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}>
              {loading
                ? 'Otimizando imagens...'
                : editingId
                ? 'Atualizar produto'
                : 'Cadastrar produto'}
            </button>

            {editingId && (
              <button type="button" onClick={clearForm} className="cancel-edit">
                Cancelar edição
              </button>
            )}
          </form>

          <section className="orby-admin-list">
            <div className="orby-list-header">
              <h2>Produtos cadastrados</h2>
              <span>{products.length} produto(s)</span>
            </div>

            {products.map((product) => (
              <div key={product.id} className="orby-admin-item">
                <img 
                src={product.image} 
                alt={product.name}
                loading='lazy'
                />

                <div>
                  <strong>{product.name}</strong>

                  <p>
                    {Number(product.price).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>

                  {product.brand && (
                    <p>
                      {brandLabel}: {product.brand}
                    </p>
                  )}

                  {product.category && (
                    <p>
                      {categoryLabel}: {product.category}
                    </p>
                  )}

                  <p>{product.available ? 'Disponível' : 'Indisponível'}</p>
                </div>

                <div className="admin-actions">
                  <button onClick={() => handleEdit(product)}>Editar</button>

                  <button onClick={() => toggleAvailable(product)}>
                    {product.available ? 'Desativar' : 'Ativar'}
                  </button>

                  <button onClick={() => handleDelete(product.id)}>
                    Excluir
                  </button>
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

export default AdminProducts