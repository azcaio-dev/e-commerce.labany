import whatsappIcon from '../assets/whatsapp.png'
import instagramIcon from '../assets/instagram.png'
import emailIcon from '../assets/email.png'
import { useLocation } from 'react-router-dom'
import stores from '../config/stores'

function Footer() {
  const location = useLocation()

  const storeSlug = location.pathname.split('/')[1] || 'labany'
  const store = stores[storeSlug] || stores.labany

  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>{store.name}</h3>

        <p>{store.tagline}</p>

        <div className="footer-social">
          {store.whatsapp && (
            <a
              href={`https://wa.me/${store.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              <img src={whatsappIcon} alt="WhatsApp" />
            </a>
          )}

          {store.instagram && (
            <a
              href={store.instagram}
              target="_blank"
              rel="noreferrer"
            >
              <img src={instagramIcon} alt="Instagram" />
            </a>
          )}
        </div>

        {store.email && (
          <div className="footer-contact">
            <img src={emailIcon} alt="Email" />
            <span>{store.email}</span>
          </div>
        )}

        <span className="footer-copy">
          © {new Date().getFullYear()} {store.name}
        </span>
      </div>
    </footer>
  )
}

export default Footer