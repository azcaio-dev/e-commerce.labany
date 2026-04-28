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


function AdminProducts() {
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const formRef = useRef(null)
 
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate('/admin')
    }
  })

  return () => unsubscribe()
}, [navigate])

  async function loadProducts() {
    const snapshot = await getDocs(collection(db, 'products'))

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    setProducts(data)
  }

 useEffect(() => {
  async function fetchProducts() {
    await loadProducts()
  }

  fetchProducts()
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

  function clearForm() {
    setName('')
    setPrice('')
    setDescription('')
    setFile1(null)
    setFile2(null)
    setEditingId(null)
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setName(product.name)
    setPrice(product.price)
    setDescription(product.description || '')

    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingId) {
        const updatedData = {
          name,
          price: Number(price),
          description,
        }

        if (file1) {
          const newImage1 = await uploadImage(file1)
          updatedData.image = newImage1
        }

        if (file2) {
          const newImage2 = await uploadImage(file2)
          updatedData.image2 = newImage2
        }

        await updateDoc(doc(db, 'products', editingId), updatedData)

        alert('Produto atualizado!')
      } else {
        if (!file1 || !file2) {
          alert('Selecione as duas imagens')
          setLoading(false)
          return
        }

        const image1 = await uploadImage(file1)
        const image2 = await uploadImage(file2)

        await addDoc(collection(db, 'products'), {
          name,
          price: Number(price),
          description,
          image: image1,
          image2,
          available: true,
        })

        alert('Produto cadastrado!')
      }

      clearForm()
      e.target.reset()
      loadProducts()
    } catch (error) {
      console.error(error)
      alert('Erro ao salvar produto')
    }

    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Deseja excluir este produto?')) return

    await deleteDoc(doc(db, 'products', id))
    loadProducts()
  }

  async function toggleAvailable(product) {
    await updateDoc(doc(db, 'products', product.id), {
      available: !product.available,
    })

    loadProducts()
  }

  return (
    <main className="admin-products">
      <h1>Painel de Produtos</h1>

      <form ref={formRef} onSubmit={handleSubmit} className="admin-product-form">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Preço"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

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

        <button type="submit" disabled={loading}>
          {loading
            ? 'Salvando...'
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

      <div className="admin-list">
        {products.map((product) => (
          <div key={product.id} className="admin-item">
            <img src={product.image} alt={product.name} />

            <div>
              <strong>{product.name}</strong>
              <p>
                {Number(product.price).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
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
      </div>
    </main>
  )
}

export default AdminProducts