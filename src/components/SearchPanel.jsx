function SearchPanel({
  openSearch,
  searchTerm,
  setSearchTerm,
  products,
  setFilteredProducts,
  setActiveFilter,
  setFilterLabel,
}) {
  if (!openSearch) return null

  return (
    <div className="search-panel">
      <input
        type="text"
        placeholder="Buscar produto..."
        value={searchTerm}
        autoFocus
        onChange={(e) => {
          const value = e.target.value
          setSearchTerm(value)

          if (!value.trim()) {
            setFilteredProducts(products)
            setActiveFilter(null)
            setFilterLabel('')
            return
          }

          const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(value.toLowerCase())
          )

          setFilteredProducts(filtered)
          setActiveFilter('search')
          setFilterLabel(`Busca > ${value}`)
        }}
      />
    </div>
  )
}

export default SearchPanel