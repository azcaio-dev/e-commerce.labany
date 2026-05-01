import whatsappIcon from '../assets/whatsapp.png'
import instagramIcon from '../assets/instagram.png'
import emailIcon from '../assets/email.png'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Loja Labany</h3>

        <p>Moda feminina com estilo e qualidade</p>

        <div className="footer-social">
          <a href="https://wa.me/5581999999999" target="_blank" rel="noreferrer">
            <img src={whatsappIcon} alt="WhatsApp" />
          </a>

          <a href="https://instagram.com/" target="_blank" rel="noreferrer">
            <img src={instagramIcon} alt="Instagram" />
          </a>
        </div>

        <div className="footer-contact">
          <img src={emailIcon} alt="Email" />
          <span>suporte@labany.com</span>
        </div>

        <span className="footer-copy">
          © {new Date().getFullYear()} Loja Labany
        </span>
      </div>
    </footer>
  )
}

export default Footer