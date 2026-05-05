import stores from './stores'

function getStoreFromURL() {
  const path = window.location.pathname.split('/')[1]

  if (stores[path]) {
    return path
  }

  return 'labany' // fallback
}

const currentStore = getStoreFromURL()

const storeConfig = stores[currentStore]

export default storeConfig