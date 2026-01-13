import { supabase } from "../lib/supabase"
import { useState, useEffect } from "react"

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  async function logout() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "#f5f5f5", fontFamily: "'Unbounded', sans-serif", background: "#050505", minHeight: "100vh" }}>
        <h1 style={{ fontSize: "3rem" }}>liminaalizing</h1>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ 
        padding: "50px", 
        maxWidth: "400px", 
        margin: "auto", 
        background: "#050505", 
        color: "#f5f5f5", 
        fontFamily: "'Unbounded', sans-serif", 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center"
      }}>
        <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "30px" }}>liminaal</h1>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
            Inicia sesión para ver la galería completa
          </p>
          <a href="/login" style={{ 
            display: "inline-block", 
            padding: "12px 24px", 
            background: "#0070f3", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "8px", 
            marginRight: "10px",
            fontWeight: "700"
          }}>
            Entrar
          </a>
          <a href="/register" style={{ 
            display: "inline-block", 
            padding: "12px 24px", 
            background: "#10b981", 
            color: "white", 
            textDecoration: "none", 
            borderRadius: "8px",
            fontWeight: "700"
          }}>
            Crear cuenta
          </a>
        </div>
      </div>
    )
  }

  // USUARIO LOGUEADO - Tu HTML original como JSX
  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #050505; 
          --fg: #f5f5f5; 
          --muted: rgba(245,245,245,0.12);
          --card-radius: 12px;
        }
        * { box-sizing: border-box; }
        html, body { 
          height: 100%; 
          margin: 0; 
          background: var(--bg); 
          color: var(--fg); 
          font-family: 'Unbounded', sans-serif;
          overflow-x: hidden;
        }
        .container { 
          max-width: 1100px; 
          margin: 0 auto; 
          padding: 80px 20px;
          position: relative;
        }
        .user-menu {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.7);
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-menu button {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-family: inherit;
        }
        h1 { text-align: center; margin: 0 0 18px; font-size: 3rem; }
        /* ... resto de tu CSS completo aquí ... */
        /* (Voy a mantenerlo limpio - copia tu CSS del HTML aquí) */
      `}</style>

      <div className="container">
        <div className="user-menu">
          <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>
            {user.email}
          </span>
          <button onClick={logout}>Salir</button>
        </div>

        <h1>liminaal</h1>

        {/* Tu Spotify player */}
        <div className="spotify-player" style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
          <iframe 
            src="https://open.spotify.com/embed/playlist/5xzeVvVZU6mCfSwALg1yNp?utm_source=generator" 
            width="100%" 
            height="152" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          />
        </div>

        {/* Tus image-box originales */}
        <div className="image-placeholder" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '2.5rem' }}>
          <div className="image-box" style={{ position: 'relative', height: '260px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', 
              boxShadow: '0 8px 30px rgba(0,0,0,0.6), inset 0 -20px 40px rgba(0,0,0,0.4)' }}>
            <img src="https://liminaal.github.io/assets/images/hospital.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 14px', background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.6))' }}>
              <div style={{ fontWeight: 700, fontSize: '1.02rem' }}>Abandoned Hospital</div>
              <div style={{ fontSize: '.78rem', opacity: 0.75 }}>found - november 2025</div>
            </div>
          </div>
          {/* Repite para las otras imágenes */}
        </div>

        {/* Botón para subir nuevas imágenes */}
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <a href="/upload" style={{ 
            display: 'inline-block', 
            padding: '15px 30px', 
            background: '#6366f1', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '12px', 
            fontWeight: 700, 
            fontSize: '1.1rem'
          }}>
            📤 Subir imagen a la comunidad
          </a>
        </div>
      </div>
    </>
  )
}
