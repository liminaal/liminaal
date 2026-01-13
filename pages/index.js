// pages/index.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [communityImages, setCommunityImages] = useState([]);

  // Detectar si hay usuario logueado
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cargar imágenes aprobadas de la comunidad
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (!error) {
        setCommunityImages(data || []);
      }
    };
    fetchImages();
  }, []);

  // Todo el comportamiento visual se maneja con useEffect + DOM (como en tu original)
  useEffect(() => {
    // --- Loader ---
    const hideLoader = () => {
      document.getElementById('siteLoader')?.classList.add('hidden');
      document.getElementById('siteContent')?.setAttribute('aria-hidden', 'false');
    };
    if (document.readyState === 'complete') setTimeout(hideLoader, 120);
    else window.addEventListener('load', () => setTimeout(hideLoader, 160));

    // --- Screensaver ---
    let idleTimer;
    const SCREENSAVER_DELAY = 5 * 60 * 1000;
    const resetTimer = () => {
      clearTimeout(idleTimer);
      document.getElementById('screensaver')?.classList.remove('show');
      idleTimer = setTimeout(() => {
        document.getElementById('screensaver')?.classList.add('show');
      }, SCREENSAVER_DELAY);
    };
    ['mousemove', 'mousedown', 'touchstart', 'keydown', 'scroll'].forEach(ev =>
      document.addEventListener(ev, resetTimer, { passive: true })
    );
    resetTimer();

    // --- Hover Preview & Popups (lógica original adaptada) ---
    const highResPath = (path) => {
      if (!path) return path;
      const parts = path.split('.');
      if (parts.length < 2) return path;
      const ext = parts.pop();
      return `${parts.join('.')}${ext.includes('@2x') ? '' : '@2x'}.${ext}`;
    };

    const positionPreview = (x, y) => {
      const hp = document.getElementById('hoverPreview');
      if (!hp) return;
      const rect = hp.getBoundingClientRect();
      let left = x + 18, top = y + 18;
      if (left + rect.width > window.innerWidth - 12) left = x - rect.width - 18;
      if (top + rect.height > window.innerHeight - 12) top = y - rect.height - 18;
      hp.style.transform = `translate3d(${left}px, ${top}px, 0) scale(1)`;
    };

    const boxes = document.querySelectorAll('.image-box');
    boxes.forEach(box => {
      let timer;
      box.addEventListener('mouseenter', e => {
        timer = setTimeout(() => {
          const imgPath = box.dataset.img;
          const previewThumb = document.getElementById('previewThumb');
          if (previewThumb) {
            previewThumb.src = highResPath(imgPath);
            previewThumb.onerror = () => previewThumb.src = imgPath;
          }
          document.getElementById('previewTitle').textContent = box.dataset.title;
          document.getElementById('previewDesc').textContent = box.dataset.desc;
          document.getElementById('hoverPreview').classList.add('active');
          positionPreview(e.clientX, e.clientY);
        }, 110);
      });
      box.addEventListener('mousemove', e => positionPreview(e.clientX, e.clientY));
      box.addEventListener('mouseleave', () => {
        clearTimeout(timer);
        document.getElementById('hoverPreview')?.classList.remove('active');
      });
      box.addEventListener('click', () => {
        const imgPath = box.dataset.img;
        const popupImg = document.getElementById('popup-img');
        if (popupImg) {
          popupImg.src = highResPath(imgPath);
          popupImg.onerror = () => popupImg.src = imgPath;
        }
        document.getElementById('popup-title').textContent = box.dataset.title;
        document.getElementById('popup-desc').textContent = box.dataset.desc;
        document.getElementById('popup').classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // --- Colaboradores entrance ---
    document.querySelectorAll('.collaborator').forEach((c, i) => {
      setTimeout(() => c.classList.add('visible'), 80 * i + 120);
    });

    // --- Cierre con ESC / click fuera ---
    const closePopups = () => {
      document.getElementById('popup')?.classList.remove('active');
      document.getElementById('popup-collab')?.classList.remove('active');
      document.body.style.overflow = '';
    };
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePopups();
    });
    document.getElementById('popup')?.addEventListener('click', e => {
      if (e.target.id === 'popup') closePopups();
    });
    document.getElementById('popup-collab')?.addEventListener('click', e => {
      if (e.target.id === 'popup-collab') closePopups();
    });
    document.querySelectorAll('.popup-close').forEach(btn => {
      btn.addEventListener('click', closePopups);
    });

    // --- Touch devices ---
    if (('ontouchstart' in window) || navigator.maxTouchPoints > 0) {
      document.getElementById('hoverPreview').style.display = 'none';
    }
  }, []);

  return (
    <>
      {/* Loader */}
      <div className="loader" id="siteLoader" role="status" aria-hidden="false">
        <div className="loader-inner">
          <div className="label">liminaalizing</div>
          <div className="dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div className="container" id="siteContent" aria-hidden="true">
        {/* Screensaver */}
        <div id="screensaver" className="hide">
          <iframe
            id="iframe-ss"
            src="https://liminaal.github.io/assets/screensaver/"
            width="100%"
            height="100%"
            frameBorder="0"
            title="Screensaver"
          ></iframe>
        </div>

        <h1>liminaal</h1>

        <div className="spotify-player">
          <iframe
            src="https://open.spotify.com/embed/playlist/5xzeVvVZU6mCfSwALg1yNp?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>

        {/* Galería fija (tu contenido original) */}
        <div className="image-placeholder">
          {[
            { title: 'Abandoned Hospital', desc: 'Abandoned hospital found...', img: 'https://liminaal.github.io/assets/images/hospital.png', date: 'found - november 2025' },
            { title: 'Cold Loneliness', desc: 'Cold halls and colder hearts.', img: 'https://liminaal.github.io/assets/images/cold-loneliness.jpg', date: 'somewhere inside' },
            { title: 'Oppressive Cells', desc: 'Cells full of silence.', img: 'https://liminaal.github.io/assets/images/oppressive-cells.jpg', date: 'locked memories' },
            { title: '???', desc: '???', img: 'https://liminaal.github.io/assets/images/unknown.png', date: '???' }
          ].map((item, i) => (
            <div
              key={i}
              className="image-box"
              data-title={item.title}
              data-desc={item.desc}
              data-img={item.img}
            >
              <img className="thumb" src={item.img} alt={item.title} loading="lazy" decoding="async" />
              <div className="meta">
                <div className="title">{item.title}</div>
                <div className="sub">{item.date}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Comunidad (desde Supabase) */}
        {communityImages.length > 0 && (
          <>
            <h2 style={{ textAlign: 'center', marginTop: '4rem', fontSize: '1.8rem', opacity: 0.7 }}>Comunidad</h2>
            <div className="image-placeholder">
              {communityImages.map(img => (
                <div
                  key={img.id}
                  className="image-box"
                  data-title={img.title || 'Sin título'}
                  data-desc={img.description || ''}
                  data-img={img.url}
                >
                  <img className="thumb" src={img.url} alt={img.title || 'Comunidad'} loading="lazy" decoding="async" />
                  <div className="meta">
                    <div className="title">{img.title || 'Comunidad'}</div>
                    <div className="sub">{new Date(img.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Colaboradores */}
        <div className="collab-wrap">
          <div className="collab-head">
            <h2>Collaborators</h2>
          </div>
          <div className="collaborators" id="collaborators">
            {[
              {
                name: 'Kaido',
                img: 'https://liminaal.github.io/assets/mii/Kaido%20head.png',
                desc: "Kaido — a young boy that likes photographing & coding.\nhe started when he was 11 y/o creating a Minecraft bot, then started taking ambiental photos when he was 13."
              },
              {
                name: 'Awitax',
                img: 'https://liminaal.github.io/assets/mii/Awitax%20head.png',
                desc: "Awitax — a young girl that loves drawing & gaming."
              }
            ].map((collab, i) => (
              <div
                key={i}
                className="collaborator"
                data-coll-img={collab.img}
                data-coll-img-full={collab.img}
                data-coll-desc={collab.desc}
                onClick={() => {
                  document.getElementById('popup-collab-img').src = collab.img;
                  document.getElementById('popup-collab-title').textContent = collab.name;
                  document.getElementById('popup-collab-desc').innerHTML = collab.desc.replace(/\n/g, '<br>');
                  document.getElementById('popup-collab').classList.add('active');
                  document.body.style.overflow = 'hidden';
                }}
              >
                <img src={collab.img} alt={collab.name} loading="lazy" />
                <div className="name">{collab.name}</div>
                <div className="role"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover preview */}
      <div className="hover-preview" id="hoverPreview" aria-hidden="true">
        <div className="preview-thumb"><img id="previewThumb" src="" alt="" /></div>
        <div className="preview-meta">
          <h4 id="previewTitle"></h4>
          <p id="previewDesc"></p>
        </div>
      </div>

      {/* Popup imagen */}
      <div className="popup" id="popup" aria-hidden="true">
        <div className="popup-inner" role="dialog" aria-modal="true">
          <button className="popup-close" aria-label="Close">✕</button>
          <div className="popup-content">
            <img id="popup-img" src="" alt="" />
            <h3 id="popup-title"></h3>
            <p id="popup-desc"></p>
          </div>
        </div>
      </div>

      {/* Popup colaborador */}
      <div className="popup-collab" id="popup-collab" aria-hidden="true">
        <div className="popup-inner" role="dialog" aria-modal="true">
          <button className="popup-close" aria-label="Close">✕</button>
          <div className="collab-left">
            <img id="popup-collab-img" src="" alt="" />
          </div>
          <div className="collab-right">
            <h3 id="popup-collab-title"></h3>
            <p id="popup-collab-desc"></p>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(245,245,245,.6)' }}>
        &copy; liminaal
      </footer>
    </>
  );
}