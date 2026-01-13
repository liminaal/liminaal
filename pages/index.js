// pages/index.js - TU DISEÑO EXACTO + AUTH integrado
import { supabase } from "../lib/supabase"
import { useState, useEffect } from "react"

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    // Loader como en tu HTML original
    const timer = setTimeout(() => setShowLoader(false), 300)
    return () => clearTimeout(timer)
  }, [])

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

  if (showLoader) {
    return (
      <>
        <style jsx global>{`
          :root{--bg:#050505;--fg:#f5f5f5;--muted:rgba(245,245,245,0.12);}
          .loader{position:fixed;inset:0;display:flex;justify-content:center;align-items:center;background:#000;z-index:99999;font-size:1.25rem;letter-spacing:2px;color:var(--fg);}
          .loader-inner{display:flex;gap:8px;align-items:center;}
          .loader .label{font-weight:700;text-transform:lowercase;}
          .loader .dots{display:inline-block;width:36px;text-align:left;}
          .loader .dots span{display:inline-block;width:6px;height:6px;margin-right:4px;border-radius:50%;background:var(--fg);opacity:.18;animation:dot 1s infinite linear;}
          .loader .dots span:nth-child(1){animation-delay:0s}.loader .dots span:nth-child(2){animation-delay:.12s}.loader .dots span:nth-child(3){animation-delay:.24s}
          @keyframes dot{0%{opacity:.18;transform:translateY(0) scale(.9);}40%{opacity:1;transform:translateY(-6px) scale(1.05);}80%{opacity:.18;transform:translateY(0) scale(.95);}}
        `}</style>
        <div className="loader">
          <div className="loader-inner">
            <div className="label">liminaalizing</div>
            <div className="dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (loading) return <div style={{padding:"50px",textAlign:"center",color:"#f5f5f5"}}>Cargando...</div>

  // LOGIN SCREEN (mismo estilo que tu HTML)
  if (!user) {
    return (
      <>
        <style jsx global>{`
          :root{--bg:#050505;--fg:#f5f5f5;--card-radius:12px;}
          *{box-sizing:border-box}
          html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font-family:'Unbounded',sans-serif}
          .login-container{max-width:400px;margin:0 auto;padding:80px 20px;display:flex;flex-direction:column;justify-content:center;min-height:100vh}
          .login-box{background:rgba(5,5,5,0.95);padding:40px;border-radius:var(--card-radius);box-shadow:0 20px 60px rgba(0,0,0,0.8);backdrop-filter:blur(20px);border:1px solid rgba(245,245,245,0.1)}
          .login-box h1{text-align:center;margin:0 0 30px;font-size:2.5rem;letter-spacing:-1px}
          .login-input{display:block;width:100%;margin:0 0 20px;padding:16px;border:none;border-radius:8px;background:rgba(245,245,245,0.08);color:var(--fg);font-family:inherit;font-size:1rem;box-shadow:inset 0 2px 10px rgba(0,0,0,0.3);transition:all .3s}
          .login-input::placeholder{color:rgba(245,245,245,0.5)}
          .login-input:focus{outline:none;background:rgba(245,245,245,0.12);box-shadow:0 0 0 2px rgba(99,102,241,0.5),inset 0 2px 10px rgba(0,0,0,0.3)}
          .login-btn{display:block;width:100%;padding:16px;margin:10px 0;font-weight:700;font-size:1.1rem;border:none;border-radius:8px;cursor:pointer;transition:all .3s;font-family:inherit;text-transform:uppercase;letter-spacing:.5px}
          .login-btn.primary{background:linear-gradient(135deg,#0070f3,#6366f1);color:white;box-shadow:0 8px 25px rgba(0,112,243,0.4)}
          .login-btn.primary:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(0,112,243,0.5)}
          .login-btn.secondary{background:linear-gradient(135deg,#10b981,#059669);color:white;box-shadow:0 8px 25px rgba(16,185,129,0.4)}
          .login-btn.secondary:hover{transform:translateY(-2px);box-shadow:0 12px 35px rgba(16,185,129,0.5)}
          .login-links{text-align:center;margin-top:30px;font-size:.95rem}
          .login-links a{color:#a5b4fc;text-decoration:none;font-weight:500}
          .login-links a:hover{color:#c7d2fe}
        `}</style>

        <div className="login-container">
          <div className="login-box">
            <h1>liminaal</h1>
            <div style={{textAlign:"center",marginBottom:"30px",fontSize:"1.1rem",opacity:0.9}}>
              entra para ver la galería completa
            </div>

            <form action="/login" style={{marginBottom:"20px"}}>
              <input name="email" type="email" placeholder="email" className="login-input" required />
              <input name="password" type="password" placeholder="contraseña" className="login-input" required />
              <button type="submit" className="login-btn primary">entrar</button>
            </form>

            <form action="/register" style={{marginBottom:"25px"}}>
              <input name="email" type="email" placeholder="email" className="login-input" required />
              <input name="password" type="password" placeholder="contraseña" className="login-input" minLength={6} required />
              <button type="submit" className="login-btn secondary">crear cuenta</button>
            </form>

            <div className="login-links">
              ¿problemas? contacta al admin
            </div>
          </div>
        </div>
      </>
    )
  }

  // TU HTML ORIGINAL EXACTO (usuario logueado)
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&display=swap" rel="stylesheet" />
      <style jsx global>{`
        :root{--bg:#050505;--fg:#f5f5f5;--muted:rgba(245,245,245,0.12);--card-radius:12px;}
        *{box-sizing:border-box}
        html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font-family:'Unbounded',sans-serif}
        ${`
        /* TODO TU CSS ORIGINAL AQUÍ EXACTO */
        #screensaver{position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;opacity:0;transition:opacity 1s ease-in-out;pointer-events:none;}
        #screensaver.show{opacity:1;pointer-events:auto;}
        #screensaver.hide{opacity:0;pointer-events:none;}
        #iframe-ss{pointer-events:none;}
        .container{max-width:1100px;margin:0 auto;padding:80px 20px}
        h1{text-align:center;margin:0 0 18px;font-size:3rem}
        .spotify-player{display:flex;justify-content:center;margin:1.5rem 0}
        iframe{border-radius:12px}
        .image-placeholder{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-top:2.5rem}
        .image-box{position:relative;height:260px;border-radius:var(--card-radius);overflow:hidden;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,0.6),inset 0 -20px 40px rgba(0,0,0,0.4);transition:transform .45s cubic-bezier(.2,.9,.2,1),box-shadow .45s}
        .image-box img.thumb{width:100%;height:100%;object-fit:cover;display:block;transition:transform .8s ease,filter .45s}
        .image-box::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(ellipse at 30% 20%, rgba(60,100,80,0.03) 0%, transparent 30%),linear-gradient(180deg,rgba(0,0,0,0.18) 10%, rgba(0,0,0,0.45) 70%);mix-blend-mode:multiply}
        .image-box::after{content:"";position:absolute;inset:0;z-index:3;pointer-events:none;background-image:linear-gradient(transparent 80%, rgba(0,0,0,0.06) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 4px);opacity:.7;mix-blend-mode:overlay;transition:opacity .5s}
        .image-box .meta{position:absolute;left:0;right:0;bottom:0;padding:12px 14px;z-index:5;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.6));transform:translateY(6px);transition:transform .36s}
        .image-box .meta .title{font-weight:700;font-size:1.02rem}
        .image-box .meta .sub{font-size:.78rem;opacity:.75}
        .image-box:hover{transform:scale(1.04) rotateX(3deg) rotateY(-2deg)}
        .image-box:hover img.thumb{transform:scale(1.08) translateY(-6px)}
        .image-box:hover .meta{transform:translateY(0)}
        .user-menu{position:absolute;top:20px;right:20px;background:rgba(0,0,0,0.8);padding:12px 20px;border-radius:12px;display:flex;align-items:center;gap:12px;z-index:1000}
        .user-menu span{font-size:.9rem;opacity:.9}
        .user-menu button{background:#ef4444;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:.9rem}
        .upload-btn{display:inline-block;margin:40px auto;padding:16px 32px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;border-radius:12px;font-weight:700;font-size:1.1rem;text-align:center;box-shadow:0 8px 25px rgba(99,102,241,0.4);transition:all .3s}
        .upload-btn:hover{transform:translateY(-3px);box-shadow:0 15px 40px rgba(99,102,241,0.5)}
        `}
      `}</style>

      <div className="container">
        {/* USER MENU */}
        <div className="user-menu">
          <span>{user.email}</span>
          <button onClick={logout}>salir</button>
        </div>

        <div id="screensaver" className="hide">
          <iframe id="iframe-ss" src="https://liminaal.github.io/assets/screensaver" width="100%" height="100%" frameBorder="0"/>
        </div>

        <h1>liminaal</h1>

        <div className="spotify-player">
          <iframe 
            src="https://open.spotify.com/embed/playlist/5xzeVvVZU6mCfSwALg1yNp?utm_source=generator" 
            width="100%" 
            height="152" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          />
        </div>

        {/* TUS IMÁGENES ORIGINALES EXACTAS */}
        <div className="image-placeholder">
          <div className="image-box" data-title="Abandoned Hospital" data-desc="Abandoned hospital found..." data-img="https://liminaal.github.io/assets/images/hospital.png">
            <img className="thumb" src="https://liminaal.github.io/assets/images/hospital.png" alt="Abandoned Hospital"/>
            <div className="meta">
              <div className="title">Abandoned Hospital</div>
              <div className="sub">found - november 2025</div>
            </div>
          </div>

          <div className="image-box" data-title="Cold Loneliness" data-desc="Cold halls and colder hearts." data-img="https://liminaal.github.io/assets/images/cold-loneliness.jpg">
            <img className="thumb" src="https://liminaal.github.io/assets/images/cold-loneliness.jpg" alt="Cold Loneliness"/>
            <div className="meta">
              <div className="title">Cold Loneliness</div>
              <div className="sub">somewhere inside</div>
            </div>
          </div>

          <div className="image-box" data-title="Oppressive Cells" data-desc="Cells full of silence." data-img="https://liminaal.github.io/assets/images/oppressive-cells.jpg">
            <img className="thumb" src="https://liminaal.github.io/assets/images/oppressive-cells.jpg" alt="Oppressive Cells"/>
            <div className="meta">
              <div className="title">Oppressive Cells</div>
              <div className="sub">locked memories</div>
            </div>
          </div>

          <div className="image-box" data-title="???" data-desc="???" data-img="https://liminaal.github.io/assets/images/unknown.png">
            <img className="thumb" src="https://liminaal.github.io/assets/images/unknown.png" alt="???"/>
            <div className="meta">
              <div className="title">???</div>
              <div className="sub">???</div>
            </div>
          </div>
        </div>

        {/* BOTÓN SUBIR NUEVAS */}
        <a href="/upload" className="upload-btn">📤 subir imagen a la comunidad</a>
      </div>

      <footer style={{textAlign:"center",padding:"2rem 0",color:"rgba(245,245,245,.6)",fontSize:".9rem"}}>
        © liminaal
      </footer>
    </>
  )
}
