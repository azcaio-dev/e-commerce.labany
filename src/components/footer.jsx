import whatsappIcon from '../assets/whatsapp.png'
import instagramIcon from '../assets/instagram.png'
import useStore from '../hooks/useStore'

function Footer() {
  const { store, loading } = useStore()

  if (loading || !store) {
    return null
  }

  return (
    <footer
      className="footer"
      style={{
        backgroundColor: store.colors?.primary || '#000',
      }}
    >
      <div className="footer-content">

        <img
          src={store.logo}
          alt={store.name}
          className="footer-logo"
          loading='lazy'
        />

        <p className="footer-description">
          {store.tagline}
        </p>

        <div className="footer-links">

          <a
            href={`https://wa.me/${store.whatsapp}`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={whatsappIcon} alt="WhatsApp" />
            WhatsApp
          </a>

          <a
            href={store.instagram}
            target="_blank"
            rel="noreferrer"
          >
            <img src={instagramIcon} alt="Instagram" />
            Instagram
          </a>

        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} {store.name}
        </p>

      </div>
    </footer>
  )
}

export default Footer