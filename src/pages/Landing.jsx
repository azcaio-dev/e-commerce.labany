import { useEffect, useState } from 'react'
import './Landing.css'

const WA_LINK = 'https://wa.me/5581989855952?text=Quero+criar+minha+loja+com+a+Orby'
const WA_LINK_CTA = 'https://wa.me/5581989855952?text=Oi!+Quero+criar+minha+loja+com+a+Orby'

export default function Landing() {
  const [lightbox, setLightbox] = useState(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeUp 0.7s ease both'
          }
        })
      },
      { threshold: 0.1 }
    )

    const els = document.querySelectorAll(
      '.landing-page .step, .landing-page .feature-card, .landing-page .stat, .landing-page .transform-card'
    )
    els.forEach((el) => {
      el.style.opacity = '0'
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-page">

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: '20px',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: '20px', right: '24px',
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: '#fff', fontSize: '28px', cursor: 'pointer',
              borderRadius: '50%', width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
          <img
            src={lightbox}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: '90vh', maxWidth: '90vw',
              borderRadius: '12px', objectFit: 'contain',
              boxShadow: '0 0 60px rgba(0,0,0,0.8)',
            }}
          />
        </div>
      )}

      {/* Noise grain overlay */}
      <div className="landing-noise" />

      {/* ── NAV ── */}
      <nav>
        <a className="nav-logo" href="/">
          <img src="/logo-orby.png" alt="Orby" />
          <span>Orby</span>
        </a>
        <a className="nav-cta" href={WA_LINK} target="_blank" rel="noreferrer">
          Criar minha loja →
        </a>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          ✦ Novo jeito de vender online
        </div>
        <h1>
          Do catálogo no Drive<br />
          para uma <em>loja profissional</em>
        </h1>
        <p className="hero-sub">
          Transformamos seu catálogo do Google Drive em uma loja virtual completa — com carrinho, banner, WhatsApp e muito mais.
        </p>
        <div className="hero-actions">
          <a className="btn-primary" href={WA_LINK} target="_blank" rel="noreferrer">
            ✦ Quero minha loja
          </a>
          <a className="btn-ghost" href="#como-funciona">
            Como funciona ↓
          </a>
        </div>
      </section>

      {/* ── TRANSFORMATION ── */}
      <section className="transform">
        <p className="section-label">Antes e Depois</p>
        <h2 className="section-title">Sua loja num outro nível</h2>
        <p className="section-sub">Montamos a estrutura da sua loja — você cuida dos produtos do seu jeito.</p>

        <div className="transform-visual">
          <div className="transform-card">
            <span className="transform-card-label label-before">Antes</span>
            <img
              src="/before-drive.jpeg"
              alt="Catálogo no Google Drive"
              onClick={() => setLightbox('/before-drive.jpeg')}
              style={{ cursor: 'zoom-in' }}
            />
            <div className="transform-caption">
              📁 Catálogo espalhado no Google Drive — sem organização, sem carrinho, sem imagem profissional
            </div>
          </div>

          <div className="transform-arrow">
            <div className="arrow-icon">→</div>
            <span>Orby<br />transforma</span>
          </div>

          <div className="transform-card">
            <span className="transform-card-label label-after">Depois</span>
            <img
              src="/after-store.jpeg"
              alt="Loja criada pela Orby"
              onClick={() => setLightbox('/after-store.jpeg')}
              style={{ cursor: 'zoom-in' }}
            />
            <div className="transform-caption">
              🛍️ Loja profissional com seções, banner personalizado, carrinho e pedidos pelo WhatsApp
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how" id="como-funciona">
        <div className="how-inner">
          <p className="section-label">Processo</p>
          <h2 className="section-title">Simples como deve ser</h2>
          <p className="section-sub">Em menos de 24h sua loja está no ar.</p>

          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-icon">📁</div>
              <h3>Você manda o Drive</h3>
              <p>Compartilha o link da sua pasta no Google Drive com as fotos e nomes dos produtos.</p>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-icon">⚡</div>
              <h3>A Orby configura</h3>
              <p>Nossa equipe configura o layout, personaliza as cores e estrutura a loja com a identidade da sua marca.</p>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-icon">🚀</div>
              <h3>Sua loja vai ao ar</h3>
              <p>
                Você recebe o link <strong>orby.vercel.app/sualojaaqui</strong>, cadastra seus produtos e começa a vender.
              </p>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <div className="step-icon">📲</div>
              <h3>Pedidos no WhatsApp</h3>
              <p>Seus clientes escolhem, montam o carrinho e pedem direto pelo WhatsApp. Simples assim.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features">
        <p className="section-label">Recursos</p>
        <h2 className="section-title">Tudo que sua loja precisa</h2>
        <p className="section-sub">Do básico ao profissional, sem complicação técnica.</p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🛍️</div>
            <h3>Carrinho funcional</h3>
            <p>Clientes montam o pedido, escolhem tamanho e quantidade. Tudo vira mensagem no WhatsApp.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Visual personalizado</h3>
            <p>Cores, logo e banner com a identidade da sua marca. Sua loja, do seu jeito.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Seções organizadas</h3>
            <p>Mais vendidos, Lançamentos e Outlet. Seus produtos expostos de forma profissional.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>100% mobile first</h3>
            <p>Feito para funcionar perfeitamente no celular — onde seus clientes estão.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Link próprio</h3>
            <p>Seu endereço único na Orby para você compartilhar nas redes sociais e no WhatsApp.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Rápido e simples</h3>
            <p>Sem mensalidade de plataforma cara, sem complicação técnica. Você vende, a gente cuida do resto.</p>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="proof">
        <div className="proof-inner">
          <p className="section-label">Resultados</p>
          <h2 className="section-title">Lojas que já deram o salto</h2>
          <p className="section-sub">
            Lojistas de Recife e região que pararam de depender só do catálogo no Drive.
          </p>
          <div className="stats">
            <div className="stat">
              <div className="stat-num">+10</div>
              <div className="stat-label">lojas ativas</div>
            </div>
            <div className="stat">
              <div className="stat-num">24h</div>
              <div className="stat-label">para ir ao ar</div>
            </div>
            <div className="stat">
              <div className="stat-num">Fácil</div>
              <div className="stat-label">de gerenciar</div>
            </div>
            <div className="stat">
              <div className="stat-num">100%</div>
              <div className="stat-label">mobile first</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <div className="cta-wrap">
        <div className="cta-section">
          <div className="cta-glow" />
          <h2>
            Pronto para ter sua<br />
            <em>loja profissional?</em>
          </h2>
          <p className="cta-sub">Entre em contato e transforme seu catálogo em vendas de verdade.</p>
          <div className="cta-input-row">
            <a
              className="btn-primary btn-primary-lg"
              href={WA_LINK_CTA}
              target="_blank"
              rel="noreferrer"
              style={{ position: 'relative' }}
            >
              📲 Falar com a Orby
            </a>
          </div>
          <p className="cta-note">Sem burocracia. Sua loja no ar em menos de 24h.</p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <a className="footer-logo" href="/">
          <img src="/logo-orby.png" alt="Orby" />
          <span>Orby</span>
        </a>
        <p className="footer-copy">© 2025 Orby. Sua loja online em minutos.</p>
      </footer>

    </div>
  )
}