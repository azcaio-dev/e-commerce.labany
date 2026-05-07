import whatsappIcon from '../assets/whatsapp.png'
import instagramIcon from '../assets/instagram.png'
import { useLocation } from 'react-router-dom'
import stores from '../config/stores'

function Footer() {
  const location = useLocation()

  const storeSlug = location.pathname.split('/')[1] || 'labany'
  const store = stores[storeSlug] || stores.labany

  return (
    <footer className="footer">
        <div className="footer-content">

          <img
            src={store.logo}
            alt={store.name}
            className="footer-logo"
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